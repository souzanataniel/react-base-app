import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {authService, tokenService} from '../services';
import {AuthState, AuthTokens} from '@/features/auth/types';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,

      // Login action - apenas marca como autenticado
      login: async (tokens: AuthTokens) => {
        set({
          isAuthenticated: true,
          isLoading: false
        });
      },

      // Logout action - limpa autenticação
      logout: async () => {
        set({isLoading: true});

        try {
          await authService.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({
            isAuthenticated: false,
            isLoading: false
          });
        }
      },

      // Initialize auth state on app start
      initialize: async () => {
        set({isLoading: true});

        try {
          const isAuthenticated = await tokenService.isAuthenticated();

          set({
            isAuthenticated,
            isLoading: false,
            isInitialized: true
          });
        } catch (error) {
          console.error('Auth initialization error:', error);
          set({
            isAuthenticated: false,
            isLoading: false,
            isInitialized: true
          });
        }
      },

      // Check current auth status
      checkAuthStatus: async () => {
        try {
          const isAuthenticated = await tokenService.isAuthenticated();

          if (!isAuthenticated && get().isAuthenticated) {
            // Token expirou, desloga
            set({isAuthenticated: false});
          }

          return isAuthenticated;
        } catch (error) {
          console.error('Auth check error:', error);
          set({isAuthenticated: false});
          return false;
        }
      },
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => AsyncStorage),

      // Só persiste estado de autenticação
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
      }),

      // Hydrate corretamente após load
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isLoading = false;
          state.isInitialized = false;
        }
      },
    }
  )
);

// Selectors para performance
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useIsInitialized = () => useAuthStore((state) => state.isInitialized);

// Actions - CORRIGIDO: Usar seletores específicos para evitar novo objeto
export const useLoginAction = () => useAuthStore((state) => state.login);
export const useLogoutAction = () => useAuthStore((state) => state.logout);
export const useInitializeAction = () => useAuthStore((state) => state.initialize);
export const useCheckAuthStatusAction = () => useAuthStore((state) => state.checkAuthStatus);

// MANTIDO para compatibilidade - mas agora memoizado corretamente
export const useAuthActions = () => {
  const login = useLoginAction();
  const logout = useLogoutAction();
  const initialize = useInitializeAction();
  const checkAuthStatus = useCheckAuthStatusAction();

  // Zustand já memoiza estas funções automaticamente
  return { login, logout, initialize, checkAuthStatus };
};
