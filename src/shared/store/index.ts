import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {User} from '@/features/auth';

interface AppState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  theme: 'light' | 'dark' | 'system';
  language: string;

  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setLanguage: (language: string) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      theme: 'system',
      language: 'pt-BR',

      setUser: (user) => set((state) => ({
        user,
        isAuthenticated: !!user
      })),

      setToken: (token) => set({token}),

      setTheme: (theme) => set({theme}),

      setLanguage: (language) => set({language}),

      logout: () => set({
        user: null,
        token: null,
        isAuthenticated: false
      }),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        theme: state.theme,
        language: state.language,
      }),
    }
  )
);

export const useUser = () => useAppStore((state) => state.user);
export const useAuth = () => useAppStore((state) => ({
  isAuthenticated: state.isAuthenticated,
  token: state.token
}));
export const useTheme = () => useAppStore((state) => state.theme);
