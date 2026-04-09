import { create } from 'zustand';

interface User {
  id: string;
  phone: string;
  partner_id: string | null;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (phone: string) => Promise<void>;
  logout: () => void;
  linkPartner: (partnerId: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (phone: string) => {
    // Mock login logic for now
    set({
      user: { id: `user_${Math.random()}`, phone, partner_id: null },
      isAuthenticated: true,
    });
  },
  logout: () => set({ user: null, isAuthenticated: false }),
  linkPartner: async (partnerId: string) => {
    // Mock link logic
    set((state) => ({
      user: state.user ? { ...state.user, partner_id: partnerId } : null,
    }));
  },
}));
