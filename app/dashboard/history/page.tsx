'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { History, ChevronDown, ChevronUp, AlertCircle, Award } from 'lucide-react';
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-royalblue/10 dark:bg-royalblue/20 rounded-2xl flex items-center justify-center">
            <History className="w-6 h-6 text-royalblue" />
          </div>
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-white">
              Session History
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg">
              Track your progress and review AI coaching insights
            </p>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-zinc-200 dark:border-zinc-800 border-t-royalblue rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="mt-8 bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 
                      px-6 py-5 rounded-2xl text-sm font-medium flex items-start gap-4 border-l-4 border-red-500">
          <AlertCircle size={24} className="mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!loading && sessions.length === 0 && (
        <div className="text-center py-20 bg-white dark:bg-zinc-950 rounded-3xl">
          <div className="mx-auto w-20 h-20 bg-zinc-100 dark:bg-zinc-900 rounded-2xl flex items-center justify-center mb-6">
            <History className="w-10 h-10 text-zinc-400" />
          </div>
          <h3 className="text-2xl font-semibold text-black dark:text-white mb-3">No sessions yet</h3>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto mb-8">
            Upload your first technique photo to start receiving AI-powered coaching feedback
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-royalblue hover:bg-[#1E40AF] text-white px-8 py-4 rounded-2xl font-medium transition-colors"
          >
            Upload Your First Photo
          </button>
        </div>
      )}

      <div className="space-y-6">
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
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  const score = session.feedback.overallScore;
  const scoreColor = score >= 8 ? 'text-emerald-600 dark:text-emerald-400' : 
                    score >= 6 ? 'text-amber-600 dark:text-amber-400' : 
                    'text-red-600 dark:text-red-400';

  return (
    <div className="bg-white dark:bg-zinc-950 rounded-3xl overflow-hidden">
      {/* Card Header */}
      <div 
        className="p-8 flex flex-col md:flex-row gap-6 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
        onClick={onToggle}
      >
        {/* Thumbnail */}
        <div className="relative w-full md:w-48 h-48 md:h-32 flex-shrink-0 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900">
          {session.thumbnail ? (
            <Image 
              src={session.thumbnail} 
              alt="Session thumbnail" 
              fill 
              className="object-cover" 
            />
          ) : (
            <div className="flex items-center justify-center h-full text-zinc-400">
              No image
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">{date}</p>
              <p className="font-medium text-lg text-black dark:text-white line-clamp-2 mb-4">
                {session.feedback.priorityFix}
              </p>
            </div>

            <div className={`flex-shrink-0 px-5 py-2.5 rounded-2xl font-semibold text-sm bg-zinc-100 dark:bg-zinc-900 ${scoreColor}`}>
              {score}/10
            </div>
          </div>

          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
              <Award className="w-4 h-4" />
              AI Analysis
            </div>
            
            <div className="text-royalblue">
              {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Feedback */}
      {isExpanded && (
        <div className="border-t border-zinc-200 dark:border-zinc-800 px-8 pb-8">
          <div className="pt-8">
            <FeedbackCard session={session} expanded />
          </div>
        </div>
      )}
    </div>
  );
}