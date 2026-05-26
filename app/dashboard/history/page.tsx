'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { History, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useAppStore, type Session } from '@/store/appStore';
import FeedbackCard from '@/components/FeedbackCard';

export default function HistoryPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const sessions = useAppStore((s) => s.sessions);
  const setSessions = useAppStore((s) => s.setSessions);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const token = document.cookie.split('; ').find((row) => row.startsWith('auth-token='))?.split('=')[1];
        if (!token) {
          router.push('/login');
          return;
        }

        const res = await fetch('/api/sessions', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch sessions');
        }

        const data = await res.json();
        setSessions(data.sessions);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [router, setSessions]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground dark:text-foreground flex items-center gap-2">
          <History className="w-7 h-7" />
          Session History
        </h1>
        <p className="text-muted-foreground dark:text-muted-foreground mt-1">Review your past coaching sessions and track your progress.</p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-4 bg-destructive/10 dark:bg-destructive/20 border border-destructive/30 dark:border-destructive/50 text-destructive dark:text-destructive rounded-lg">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {!loading && sessions.length === 0 && (
        <div className="text-center py-16 bg-card dark:bg-card rounded-xl border border-card-border dark:border-card-border">
          <History className="w-16 h-16 mx-auto text-muted-foreground dark:text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground dark:text-foreground">No sessions yet</h3>
          <p className="text-muted-foreground dark:text-muted-foreground mt-1">Upload your first photo to get AI feedback</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-4 px-4 py-2 bg-indigo-600 dark:bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-700 transition-colors"
          >
            Upload Photo
          </button>
        </div>
      )}

      <div className="space-y-4">
        {sessions.map((session) => (
          <SessionCard
            key={session._id}
            session={session}
            isExpanded={expandedId === session._id}
            onToggle={() => toggleExpand(session._id)}
          />
        ))}
      </div>
    </div>
  );
}

function SessionCard({ session, isExpanded, onToggle }: { session: Session; isExpanded: boolean; onToggle: () => void }) {
  const date = new Date(session.uploadedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-card dark:bg-card rounded-xl border border-card-border dark:border-card-border overflow-hidden">
      <div className="p-4 flex items-center gap-4 cursor-pointer" onClick={onToggle}>
        <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-secondary dark:bg-secondary">
          {session.thumbnail ? (
            <Image src={session.thumbnail} alt="Session thumbnail" fill className="object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground dark:text-muted-foreground">No image</div>
          )}
        </div>

        <div className="flex-1">
          <p className="text-sm text-muted-foreground dark:text-muted-foreground">{date}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className={`px-2 py-1 rounded text-sm font-medium ${
              session.feedback.overallScore >= 8
                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                : session.feedback.overallScore >= 6
                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
                : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
            }`}>
              Score: {session.feedback.overallScore}/10
            </span>
          </div>
          <p className="text-foreground dark:text-foreground font-medium mt-2 line-clamp-1">{session.feedback.priorityFix}</p>
        </div>

        <button className="text-muted-foreground dark:text-muted-foreground hover:text-foreground transition-colors">
          {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </button>
      </div>

      {isExpanded && (
        <div className="border-t border-card-border dark:border-card-border p-4 bg-secondary dark:bg-secondary">
          <FeedbackCard session={session} />
        </div>
      )}
    </div>
  );
}
