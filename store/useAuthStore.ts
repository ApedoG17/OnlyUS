import { create } from 'zustand';

interface AuthState {
  isSignedIn: boolean;
  login: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isSignedIn: false,
  login: () => set({ isSignedIn: true }),
  logout: () => set({ isSignedIn: false }),
}));
