import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as authService from '../services/authService';
import {
  AuthState,
  SignInCredentials,
  SignUpCredentials,
  UpdatePasswordCredentials,
  User
} from '@/features/auth/types/auth.types';

interface AuthStore extends AuthState {
  isRedirecting: boolean; // 🎯 NOVO: controla transição pós-login
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
  updatePassword: (credentials: UpdatePasswordCredentials) => Promise<{
    success: boolean;
    error?: string;
    message: string;
  }>;
  setRedirecting: (redirecting: boolean) => void; // 🎯 NOVO
}

// Controle global de inicialização
let isInitializing = false;
let authStateUnsubscribe: (() => void) | null = null;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,
      isRedirecting: false, // 🎯 NOVO
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

        console.log('🚀 Iniciando autenticação...');
        isInitializing = true;

        try {
          // Cleanup de listener anterior
          if (authStateUnsubscribe) {
            authStateUnsubscribe();
            authStateUnsubscribe = null;
          }

          // 1. CHECAR SESSÃO IMEDIATAMENTE (não depender só do listener)
          console.log('🔍 Verificando sessão existente...');
          const session = await authService.getSession();

          let currentUser: User | null = null;
          if (session?.user) {
            console.log('👤 Sessão válida encontrada, buscando dados do usuário...');
            currentUser = await authService.getCurrentUser();
          }

          // 2. DEFINIR ESTADO INICIAL BASEADO NA SESSÃO REAL
          set({
            user: currentUser,
            isAuthenticated: !!currentUser,
            isInitialized: true, // 🎯 AQUI que libera a UI
            error: null,
          });

          console.log('✅ Estado inicial definido:', {
            hasUser: !!currentUser,
            isAuthenticated: !!currentUser,
            email: currentUser?.email
          });

          // 3. REGISTRAR LISTENER PARA MUDANÇAS FUTURAS
          console.log('👂 Configurando listener de mudanças...');
          const authListener = authService.onAuthStateChange(async (user) => {
            console.log('🔄 Auth state changed:', { hasUser: !!user });

            set({
              user,
              isAuthenticated: !!user,
              error: null,
            });
          });

          // Guardar unsubscribe
          if (typeof authListener === 'function') {
            authStateUnsubscribe = authListener;
          } else if (authListener?.data?.subscription) {
            authStateUnsubscribe = () => authListener.data.subscription.unsubscribe();
          }

        } catch (error) {
          console.error('💥 Erro na inicialização:', error);
          set({
            user: null,
            isAuthenticated: false,
            isInitialized: true, // Mesmo com erro, libera a UI
            error: error?.message || 'Erro na inicialização',
          });
        } finally {
          isInitializing = false;
        }
      },

      signIn: async (credentials: SignInCredentials) => {
        set({ isLoading: true, error: null });

        try {
          console.log('🔐 Executando login...');
          const response = await authService.signIn(credentials);

          if (response.error) {
            set({
              error: response.error,
              isLoading: false,
              isAuthenticated: false,
              user: null
            });
            return { success: false, error: response.error };
          }

          // ✅ INICIA TRANSIÇÃO ELEGANTE
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
            isRedirecting: true, // 🎯 ATIVA TRANSIÇÃO
            error: null,
          });

          console.log('✅ Login realizado com sucesso - iniciando transição');
          return { success: true };

        } catch (error) {
          const errorMessage = 'Erro inesperado ao fazer login';
          console.error('💥 Exceção no login:', error);
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
            user: null
          });
          return { success: false, error: errorMessage };
        }
      },

      signUp: async (credentials: SignUpCredentials) => {
        set({ isLoading: true, error: null });

        try {
          console.log('📝 Executando cadastro...');
          const response = await authService.signUp(credentials);

          if (response.error) {
            set({
              error: response.error,
              isLoading: false,
              isAuthenticated: false,
              user: null
            });
            return { success: false, error: response.error };
          }

          // ✅ INICIA TRANSIÇÃO ELEGANTE
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
            isRedirecting: true, // 🎯 ATIVA TRANSIÇÃO
            error: null,
          });

          console.log('✅ Cadastro realizado com sucesso - iniciando transição');
          return { success: true };

        } catch (error) {
          const errorMessage = 'Erro inesperado ao criar conta';
          console.error('💥 Exceção no cadastro:', error);
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
            user: null
          });
          return { success: false, error: errorMessage };
        }
      },

      signOut: async () => {
        set({ isLoading: true });

        try {
          console.log('🚪 Executando logout...');
          await authService.signOut();
          console.log('✅ Logout concluído');
        } catch (error) {
          console.error('💥 Erro no logout:', error);
        } finally {
          // ✅ SEM NAVEGAÇÃO MANUAL - deixa a AuthGate redirecionar
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            isRedirecting: false, // 🎯 RESET TRANSIÇÃO
            error: null,
          });
        }
      },

      updatePassword: async (credentials: UpdatePasswordCredentials) => {
        set({ isLoading: true, error: null });

        try {
          console.log('🔑 Executando atualização de senha...');
          const response = await authService.updatePassword(credentials);

          if (response.success) {
            console.log('✅ Senha atualizada com sucesso');
            set({
              isLoading: false,
              error: null,
            });
            return {
              success: true,
              message: response.message
            };
          } else {
            console.log('❌ Erro ao atualizar senha:', response.error);
            set({
              error: response.error || 'Erro ao atualizar senha',
              isLoading: false,
            });
            return {
              success: false,
              error: response.error,
              message: response.message
            };
          }
        } catch (error) {
          const errorMessage = 'Erro inesperado ao atualizar senha';
          console.error('💥 Exceção na atualização de senha:', error);
          set({
            error: errorMessage,
            isLoading: false,
          });
          return {
            success: false,
            error: errorMessage,
            message: errorMessage
          };
        }
      },

      setUser: (user: User | null) => {
        set({
          user,
          isAuthenticated: !!user,
        });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      clearError: () => {
        set({ error: null });
      },

      setRedirecting: (redirecting: boolean) => {
        set({ isRedirecting: redirecting });
      },

      cleanup: () => {
        if (authStateUnsubscribe) {
          authStateUnsubscribe();
          authStateUnsubscribe = null;
          console.log('🧹 Cleanup do listener realizado');
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        // ⚠️ NÃO PERSISTIR isAuthenticated para evitar "vai-e-volta"
        // Só persiste user para UX (avatar, nome, etc.)
        user: state.user,
      }),
    }
  )
);
