import { create } from 'zustand';

export interface UserData {
  name: string;
  intent: string;
}

interface AuthState {
  isSignedIn: boolean;
  userData: UserData | null;
  login: (data?: UserData) => void;
  logout: () => void;
  setUserData: (data: UserData) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isSignedIn: false,
  userData: null,
  login: (data) => set((state) => ({ 
    isSignedIn: true, 
    userData: data || state.userData || { name: 'Player', intent: 'Relationship' } 
  })),
  logout: () => set({ isSignedIn: false, userData: null }),
  setUserData: (data) => set({ userData: data }),
}));
