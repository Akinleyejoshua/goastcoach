'use client';

import Image from 'next/image';
import { Target, AlertTriangle, Lightbulb, CheckCircle, ShieldCheck } from 'lucide-react';
import { type Session } from '@/store/appStore';
import ChatButton from './ChatButton';

interface Props {
  session: Session;
  expanded?: boolean;
}

export default function FeedbackCard({ session }: Props) {
  const { feedback, imageUrl } = session;

  // Leveraging the theme's core colors for the score indicators
  const getScoreStyles = (score: number) => {
    if (score >= 8) return 'text-success bg-success/10 border-success/20';
    if (score >= 6) return 'text-warning bg-warning/10 border-warning/20';
    return 'text-destructive bg-destructive/10 border-destructive/20';
  };

  return (
    <div className="animate-fadeIn max-w-fill mx-auto bg-card text-foreground border border-card-border rounded-2xl shadow-xl dark:shadow-none overflow-hidden transition-all duration-300">
      
      {/* Top Header Profile & Score Section */}
      <div className="p-6 sm:p-8 border-b border-card-border bg-gradient-to-b from-secondary/30 to-transparent">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          
          {/* Image Container with Premium Ring Effect */}
          <div className="relative w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden bg-secondary ring-4 ring-card-border/50 shadow-inner">
            {imageUrl ? (
              <Image src={imageUrl} alt="Uploaded technique" fill className="object-cover" priority />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No Image</div>
            )}
          </div>

          {/* Identity & Metrics Block */}
          <div className="flex-1 w-full text-center sm:text-left space-y-4">
            <div>
              <span className="text-xs font-bold tracking-widest text-primary uppercase">Analysis Overview</span>
              <h2 className="text-xl font-bold tracking-tight mt-0.5">Technique Feedback</h2>
            </div>
            
            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-4">
              {/* Overall Score Badge */}
              <div className={`flex items-center gap-2.5 px-4 py-2 rounded-xl border font-bold text-lg ${getScoreStyles(feedback.overallScore)}`}>
                <span className="text-xs font-medium uppercase tracking-wider opacity-80">Score:</span>
                {feedback.overallScore}/10
              </div>

              {/* Confidence Badge */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-card-border bg-secondary/80 text-secondary-foreground text-sm font-semibold">
                <ShieldCheck size={16} className="text-primary" />
                <span className="text-muted-foreground font-normal text-xs mr-0.5">Confidence:</span>
                {feedback.confidenceLevel}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Insights Content */}
      <div className="p-6 sm:p-8 space-y-8">
        
        {/* Two Column Grid for Strengths & Improvements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strengths */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-success font-bold text-sm tracking-wide uppercase">
              <CheckCircle size={18} />
              <h3>Strengths</h3>
            </div>
            <ul className="space-y-2.5 text-sm leading-relaxed text-muted-foreground">
              {feedback.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-success shrink-0" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas to Improve */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-warning font-bold text-sm tracking-wide uppercase">
              <AlertTriangle size={18} />
              <h3>Areas to Improve</h3>
            </div>
            <ul className="space-y-2.5 text-sm leading-relaxed text-muted-foreground">
              {feedback.areasToImprove.map((a, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-warning shrink-0" />
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Blocks Container */}
        <div className="grid grid-cols-1 gap-4 pt-2">
          {/* Priority Fix Block */}
          <div className="group relative bg-destructive/5 dark:bg-destructive/10 border border-destructive/20 hover:border-destructive/40 rounded-xl p-5 transition-all">
            <div className="flex items-center gap-2.5 text-destructive font-bold text-sm uppercase tracking-wide mb-2">
              <Target size={18} className="group-hover:scale-110 transition-transform" />
              <h3>Priority Fix</h3>
            </div>
            <p className="text-sm leading-relaxed text-secondary-foreground font-medium">
              {feedback.priorityFix}
            </p>
          </div>

          {/* Drill Suggestion Block */}
          <div className="group relative bg-primary/5 dark:bg-primary/10 border border-primary/20 hover:border-primary/40 rounded-xl p-5 transition-all">
            <div className="flex items-center gap-2.5 text-primary font-bold text-sm uppercase tracking-wide mb-2">
              <Lightbulb size={18} className="group-hover:scale-110 transition-transform" />
              <h3>Drill Suggestion</h3>
            </div>
            <p className="text-sm leading-relaxed text-secondary-foreground font-medium">
              {feedback.drillSuggestion}
            </p>
          </div>
        </div>
      </div>

      {/* Footer / Chat Action */}
      <div className="px-6 py-4 sm:px-8 sm:py-5 bg-secondary/40 border-t border-card-border flex items-center justify-end">
        <ChatButton session={session} />
      </div>
    </div>
  );
}