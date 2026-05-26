'use client';

import Image from 'next/image';
import { MessageCircle, Target, TrendingUp, AlertTriangle, Lightbulb, CheckCircle } from 'lucide-react';
import { type Session } from '@/store/appStore';
import ChatButton from './ChatButton';

interface Props {
  session: Session;
  expanded?: boolean;
}

export default function FeedbackCard({ session }: Props) {
  const { feedback, imageUrl } = session;

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 dark:text-green-400';
    if (score >= 6) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-secondary dark:bg-secondary">
          {imageUrl && (
            <Image src={imageUrl} alt="Uploaded technique" fill className="object-cover" />
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-4 mb-3">
            <div>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground">Overall Score</p>
              <p className={`text-3xl font-bold ${getScoreColor(feedback.overallScore)}`}>
                {feedback.overallScore}/10
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground">Confidence</p>
              <p className={`text-sm font-medium px-2 py-1 rounded ${
                feedback.confidenceLevel === 'High' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' :
                feedback.confidenceLevel === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400' :
                'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
              }`}>
                {feedback.confidenceLevel}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <section>
          <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-semibold mb-2">
            <CheckCircle size={20} />
            <h3>Strengths</h3>
          </div>
          <ul className="list-disc list-inside space-y-1 text-foreground dark:text-foreground ml-6">
            {feedback.strengths.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </section>

        <section>
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-semibold mb-2">
            <AlertTriangle size={20} />
            <h3>Areas to Improve</h3>
          </div>
          <ul className="list-disc list-inside space-y-1 text-foreground dark:text-foreground ml-6">
            {feedback.areasToImprove.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </section>

        <section className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-800 dark:text-red-400 font-semibold mb-2">
            <Target size={20} />
            <h3>Priority Fix</h3>
          </div>
          <p className="text-foreground dark:text-foreground">{feedback.priorityFix}</p>
        </section>

        <section className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-blue-800 dark:text-blue-400 font-semibold mb-2">
            <Lightbulb size={20} />
            <h3>Drill Suggestion</h3>
          </div>
          <p className="text-foreground dark:text-foreground">{feedback.drillSuggestion}</p>
        </section>
      </div>

      <div className="pt-4 border-t border-card-border dark:border-card-border">
        <ChatButton session={session} />
      </div>
    </div>
  );
}
