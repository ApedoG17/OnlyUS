import { create } from 'zustand';

export interface UserData {
  id: string;
  name: string;
  intent: string;
}

const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

interface AuthState {
  isSignedIn: boolean;
  userData: UserData | null;
  login: (data?: UserData) => void;
  logout: () => void;
  setUserData: (data: UserData) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isSignedIn: false,
  userData: { id: generateUUID(), name: 'User', intent: 'Connection' },
  login: (data) => set((state) => ({ 
    isSignedIn: true, 
    userData: data ? { ...state.userData, ...data } as UserData : state.userData 
  })),
  logout: () => set({ isSignedIn: false, userData: null }),
  setUserData: (data) => set({ userData: data }),
}));
