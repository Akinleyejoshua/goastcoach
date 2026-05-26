import { create } from 'zustand';

export interface Feedback {
  overallScore: number;
  strengths: string[];
  areasToImprove: string[];
  priorityFix: string;
  drillSuggestion: string;
  confidenceLevel: 'Low' | 'Medium' | 'High';
}

export interface Session {
  _id: string;
  userId: string;
  imageUrl: string;
  thumbnail: string;
  feedback: Feedback;
  uploadedAt: string;
}

interface AppState {
  currentSession: Session | null;
  sessions: Session[];
  setCurrentSession: (session: Session | null) => void;
  setSessions: (sessions: Session[]) => void;
  addSession: (session: Session) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentSession: null,
  sessions: [],
  setCurrentSession: (session) => set({ currentSession: session }),
  setSessions: (sessions) => set({ sessions }),
  addSession: (session) => set((state) => ({ sessions: [session, ...state.sessions] })),
}));
