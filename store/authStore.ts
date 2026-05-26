import { create } from 'zustand';

interface User {
  _id: string;
  fullName: string;
  sport: string;
  position: string;
  experienceLevel: string;
  email: string;
  // Advanced profile fields (optional)
  bio?: string;
  team?: string;
  trainingFrequency?: string;
  goals?: string;
  age?: number;
  height?: number;
  weight?: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  logout: () => set({ user: null, token: null }),
}));
