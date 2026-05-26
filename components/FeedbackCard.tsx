'use client';

import Image from 'next/image';
import { MessageCircle, Target, Lightbulb, CheckCircle, AlertTriangle } from 'lucide-react';
import { type Session } from '@/store/appStore';
import ChatButton from './ChatButton';

interface Props {
  session: Session;
  expanded?: boolean;
}

export default function FeedbackCard({ session }: Props) {
  const { feedback, imageUrl } = session;

  return (
    <div className="bg-card border border-card-border rounded-xl overflow-hidden">
      <div className="flex flex-col sm:flex-row gap-4 p-4 md:p-6">
        <div className="relative w-full sm:w-40 h-40 sm:h-32 flex-shrink-0 rounded-xl overflow-hidden bg-secondary">
          {imageUrl && (
            <Image src={imageUrl} alt="Uploaded technique" fill className="object-cover" />
          )}
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <div className="flex flex-wrap items-end gap-6 mb-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Overall Score</p>
              <p className="text-3xl font-bold text-foreground">
                {feedback.overallScore}/10
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Confidence</p>
              <p className={`text-sm font-medium px-3 py-1.5 rounded-full ${
                feedback.confidenceLevel === 'High' ? 'bg-primary/10 text-primary' :
                feedback.confidenceLevel === 'Medium' ? 'bg-secondary text-secondary-foreground' :
                'bg-muted/30 text-muted-foreground'
              }`}>
                {feedback.confidenceLevel}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-6 pb-4 md:pb-6 pt-0 space-y-5">
        <section>
          <div className="flex items-center gap-2 text-primary font-semibold mb-2.5">
            <CheckCircle size={18} />
            <h3>Strengths</h3>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-foreground text-sm ml-6">
            {feedback.strengths.map((s, i) => (
              <li key={i} className="list-disc leading-relaxed">{s}</li>
            ))}
          </ul>
        </section>

        <section>
          <div className="flex items-center gap-2 text-primary font-semibold mb-2.5">
            <AlertTriangle size={18} />
            <h3>Areas to Improve</h3>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-foreground text-sm ml-6">
            {feedback.areasToImprove.map((a, i) => (
              <li key={i} className="list-disc leading-relaxed">{a}</li>
            ))}
          </ul>
        </section>

        <section className="border border-card-border rounded-lg p-4">
          <div className="flex items-center gap-2 text-primary font-semibold mb-2.5">
            <Target size={18} />
            <h3>Priority Fix</h3>
          </div>
          <p className="text-foreground text-sm leading-relaxed">{feedback.priorityFix}</p>
        </section>

        <section className="border border-primary/30 rounded-lg p-4 bg-primary/5">
          <div className="flex items-center gap-2 text-primary font-semibold mb-2.5">
            <Lightbulb size={18} />
            <h3>Drill Suggestion</h3>
          </div>
          <p className="text-foreground text-sm leading-relaxed">{feedback.drillSuggestion}</p>
        </section>
      </div>

      <div className="px-4 md:px-6 pb-4 md:pb-6 pt-0 border-t border-card-border mt-2">
        <ChatButton session={session} />
      </div>
    </div>
  );
}
