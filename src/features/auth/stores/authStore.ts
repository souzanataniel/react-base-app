import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as authService from '../services/authService';
import {AuthState, SignInCredentials, SignUpCredentials, User} from '@/features/auth/types/auth.types';
import {router} from 'expo-router';

interface AuthStore extends AuthState {
  signIn: (credentials: SignInCredentials) => Promise<{
    success: boolean;
    error?: string,
    fieldErrors?: Record<string, string>;
  }>;
  signUp: (credentials: SignUpCredentials) => Promise<{
    success: boolean;
    error?: string,
    fieldErrors?: Record<string, string>;
  }>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
  setUser: (user: User | null) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,
      error: null,

      initialize: async () => {
        try {
          authService.onAuthStateChange((user) => {
            console.log('🔄 Auth state changed in store:', {hasUser: !!user, email: user?.email});

            const currentState = get();
            const wasAuthenticated = currentState.isAuthenticated;
            const isNowAuthenticated = !!user;

            set({
              user,
              isAuthenticated: isNowAuthenticated,
              error: null,
            });

            if (!wasAuthenticated && isNowAuthenticated && currentState.isInitialized) {
              console.log('🏠 Redirecionamento automático: usuário autenticado');
              setTimeout(() => {
                try {
                  router.replace('/(app)/home');
                } catch (error) {
                  console.error('❌ Erro no redirecionamento automático:', error);
                }
              }, 100);
            } else if (wasAuthenticated && !isNowAuthenticated && currentState.isInitialized) {
              console.log('🚪 Redirecionamento automático: usuário desautenticado');
              setTimeout(() => {
                try {
                  router.replace('/(auth)/home');
                } catch (error) {
                  console.error('❌ Erro no redirecionamento automático:', error);
                }
              }, 100);
            }
          });

          const persistedState = get();

          if (persistedState.user) {
            const session = await authService.getSession();

            if (session?.user) {
              const currentUser = await authService.getCurrentUser();
              if (currentUser) {
                set({
                  user: currentUser,
                  isAuthenticated: true,
                  isInitialized: true,
                  error: null,
                });
                return;
              }
            }
          }

          const session = await authService.getSession();
          if (session?.user) {
            const user = await authService.getCurrentUser();
            if (user) {
              set({
                user,
                isAuthenticated: true,
                isInitialized: true,
                error: null,
              });
              return;
            }
          }

          set({
            user: null,
            isAuthenticated: false,
            isInitialized: true,
            error: null,
          });
        } catch (error) {
          console.error('Erro na inicialização:', error);
          set({
            user: null,
            isAuthenticated: false,
            isInitialized: true,
            error: null,
          });
        }
      },

      signIn: async (credentials: SignInCredentials) => {
        set({isLoading: true, error: null});
        try {
          console.log('🔐 Executando signIn no store...');
          const response = await authService.signIn(credentials);

          if (response.error) {
            console.log('❌ Erro no signIn:', response.error);
            set({
              error: response.error,
              isLoading: false,
              isAuthenticated: false,
              user: null
            });
            return {success: false, error: response.error};
          }

          console.log('✅ SignIn bem-sucedido, atualizando estado...');

          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          console.log('🏠 Executando redirecionamento pós-login...');

          setTimeout(() => {
            try {
              router.replace('/(app)/home');
              console.log('✅ Redirecionamento executado com sucesso');
            } catch (redirectError) {
              console.error('❌ Erro no redirecionamento:', redirectError);
              try {
                router.push('/(app)/home');
              } catch (fallbackError) {
                console.error('❌ Erro no redirecionamento fallback:', fallbackError);
              }
            }
          }, 50);

          return {success: true};
        } catch (error) {
          console.error('💥 Exceção no signIn:', error);
          const errorMessage = 'Erro inesperado ao fazer login';
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
            user: null
          });
          return {success: false, error: errorMessage};
        }
      },

      signUp: async (credentials: SignUpCredentials) => {
        set({isLoading: true, error: null});

        try {
          const response = await authService.signUp(credentials);

          if (response.error) {
            set({
              error: response.error,
              isLoading: false,
              isAuthenticated: false,
              user: null
            });
            return {success: false, error: response.error};
          }

          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          setTimeout(() => {
            try {
              router.replace('/(app)/home');
            } catch (error) {
              console.error('❌ Erro no redirecionamento pós-signup:', error);
            }
          }, 50);

          return {success: true};
        } catch (error) {
          const errorMessage = 'Erro inesperado ao criar conta';
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
            user: null
          });
          return {success: false, error: errorMessage};
        }
      },

      signOut: async () => {
        set({isLoading: true});

        try {
          await authService.signOut();
        } catch (error) {
          console.error('Erro ao fazer logout:', error);
        } finally {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      setUser: (user: User | null) => {
        const currentState = get();
        set({
          user,
          isAuthenticated: !!user,
          error: user ? null : currentState.error
        });
      },

      setError: (error: string | null) => {
        set({error});
      },

      setLoading: (loading: boolean) => {
        set({isLoading: loading});
      },

      clearError: () => {
        set({error: null});
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
