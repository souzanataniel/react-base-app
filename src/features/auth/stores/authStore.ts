import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as authService from '../services/authService';
import {AuthState, SignInCredentials, SignUpCredentials, User} from '@/features/auth/types/auth.types';
import {router} from 'expo-router';

// Constantes
const NAVIGATION_DELAY = 50;
const ROUTES = {
  APP_HOME: '/(app)/home',
  AUTH_HOME: '/(auth)/home',
} as const;

interface AuthStore extends AuthState {
  signIn: (credentials: SignInCredentials) => Promise<{
    success: boolean;
    error?: string;
    fieldErrors?: Record<string, string>;
  }>;
  signUp: (credentials: SignUpCredentials) => Promise<{
    success: boolean;
    error?: string;
    fieldErrors?: Record<string, string>;
  }>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
  setUser: (user: User | null) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  clearError: () => void;
  cleanup: () => void;
}

// Controle global de inicialização
let isInitializing = false;
let authStateUnsubscribe: (() => void) | null = null;

// Função auxiliar de navegação
const navigateToRoute = (route: string) => {
  setTimeout(() => {
    try {
      router.replace(route as any);
      console.log(`Navegando para ${route}`);
    } catch (error) {
      console.error(`Erro na navegação para ${route}:`, error);
    }
  }, NAVIGATION_DELAY);
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,
      error: null,

      initialize: async () => {
        const currentState = get();

        if (isInitializing) {
          console.log('⚠️ Inicialização já em andamento - ignorando');
          return;
        }

        if (currentState.isInitialized) {
          console.log('✅ Já inicializado - ignorando');
          return;
        }

        console.log('🚀 Iniciando autenticação (primeira vez)...');

        isInitializing = true;
        console.log('Iniciando autenticação...');

        try {
          // Cleanup de listener anterior
          if (authStateUnsubscribe) {
            authStateUnsubscribe();
            authStateUnsubscribe = null;
          }

          // Configurar listener que processará a inicialização
          const authListener = authService.onAuthStateChange((user) => {
            const state = get();

            // Só processar se não estiver inicializado ainda
            if (!state.isInitialized) {
              console.log('Processando mudança inicial de auth:', {hasUser: !!user, email: user?.email});

              set({
                user,
                isAuthenticated: !!user,
                isInitialized: true,
                error: null,
              });
            } else {
              console.log('Auth mudou após inicialização:', {hasUser: !!user});
              set({
                user,
                isAuthenticated: !!user,
                error: null,
              });
            }
          });

          // Configurar unsubscribe
          if (typeof authListener === 'function') {
            authStateUnsubscribe = authListener;
          } else if (authListener?.data?.subscription) {
            authStateUnsubscribe = () => authListener.data.subscription.unsubscribe();
          }

          // Aguardar o listener processar o INITIAL_SESSION automaticamente
          // Isso evita duplicar getCurrentUser() - o Supabase já vai disparar INITIAL_SESSION
          console.log('Aguardando processamento automático da sessão...');

        } catch (error) {
          console.error('Erro na inicialização:', error);
          set({
            user: null,
            isAuthenticated: false,
            isInitialized: true,
            error: error?.message || 'Erro na inicialização',
          });
        } finally {
          isInitializing = false;
        }
      },

      signIn: async (credentials: SignInCredentials) => {
        set({isLoading: true, error: null});

        try {
          console.log('Executando login...');
          const response = await authService.signIn(credentials);

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

          console.log('Login realizado, redirecionando...');
          navigateToRoute(ROUTES.APP_HOME);
          return {success: true};

        } catch (error) {
          const errorMessage = 'Erro inesperado ao fazer login';
          console.error('Exceção no login:', error);
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
          console.log('Executando cadastro...');
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

          console.log('Cadastro realizado, redirecionando...');
          navigateToRoute(ROUTES.APP_HOME);
          return {success: true};

        } catch (error) {
          const errorMessage = 'Erro inesperado ao criar conta';
          console.error('Exceção no cadastro:', error);
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
          console.log('Executando logout...');
          await authService.signOut();
          console.log('Logout concluído');
        } catch (error) {
          console.error('Erro no logout:', error);
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
        set({
          user,
          isAuthenticated: !!user,
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

      cleanup: () => {
        if (authStateUnsubscribe) {
          authStateUnsubscribe();
          authStateUnsubscribe = null;
          console.log('Cleanup do listener realizado');
        }
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
