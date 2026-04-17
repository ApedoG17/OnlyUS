import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export interface UserData {
  id: string;
  name: string;
  intent: string;
  connectionId?: string;
  partnerId?: string;
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
  setConnectionData: (connectionId: string, partnerId: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isSignedIn: false,
      userData: { id: generateUUID(), name: 'User', intent: 'Connection' },
      login: (data) => set((state) => ({ 
        isSignedIn: true, 
        userData: data ? { ...state.userData, ...data } as UserData : state.userData 
      })),
      logout: () => set({ isSignedIn: false, userData: null }),
      setUserData: (data) => set({ userData: data }),
      setConnectionData: (connectionId, partnerId) => set((state) => ({
        userData: state.userData ? { ...state.userData, connectionId, partnerId } : null
      })),
    }),
    {
      name: 'onlyus-auth-storage',
      storage: createJSONStorage(() => {
        if (Platform.OS === 'web') {
          if (typeof window !== 'undefined') return window.localStorage;
          return { getItem: () => null, setItem: () => {}, removeItem: () => {} };
        }
        return AsyncStorage;
      }),
    }
  )
);
