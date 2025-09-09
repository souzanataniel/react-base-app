import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthState, SignInCredentials, SignUpCredentials, User} from '@/features/auth';
import * as authService from '../services/authService';

interface AuthStore extends AuthState {
  signIn: (credentials: SignInCredentials) => Promise<{ success: boolean; error?: string }>;
  signUp: (credentials: SignUpCredentials) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
  setUser: (user: User | null) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,
      error: null,

      // Actions
      signIn: async (credentials: SignInCredentials) => {
        set({isLoading: true, error: null});
        console.log('Cheguei aqui')

        try {
          const response = await authService.signIn(credentials);
          console.log(response)
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

          return {success: true};
        } catch (error) {
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

      initialize: async () => {
        set({isLoading: true});

        try {
          // Primeiro verifica se há dados persistidos
          const persistedState = get();

          // Se há usuário persistido, verifica se a sessão ainda é válida
          if (persistedState.user) {
            console.log('Usuário encontrado no storage, verificando sessão...');

            const session = await authService.getSession();

            if (session?.user) {
              // Sessão válida, busca dados atualizados do usuário
              const currentUser = await authService.getCurrentUser();

              if (currentUser) {
                console.log('Sessão válida, mantendo usuário logado');
                set({
                  user: currentUser,
                  isAuthenticated: true,
                  isInitialized: true,
                  isLoading: false,
                  error: null,
                });
                return;
              }
            }

            // Sessão inválida, limpa dados
            console.log('Sessão inválida, fazendo logout');
            set({
              user: null,
              isAuthenticated: false,
              isInitialized: true,
              isLoading: false,
              error: null,
            });
            return;
          }

          // Não há usuário persistido, verifica se há sessão ativa
          const session = await authService.getSession();

          if (session?.user) {
            const user = await authService.getCurrentUser();

            if (user) {
              console.log('Sessão ativa encontrada, fazendo login automático');
              set({
                user,
                isAuthenticated: true,
                isInitialized: true,
                isLoading: false,
                error: null,
              });
              return;
            }
          }

          // Nenhuma sessão encontrada
          console.log('Nenhuma sessão encontrada');
          set({
            user: null,
            isAuthenticated: false,
            isInitialized: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          console.error('Erro ao inicializar auth:', error);
          set({
            user: null,
            isAuthenticated: false,
            isInitialized: true,
            isLoading: false,
            error: null,
          });
        }
      },

      setUser: (user: User | null) => {
        set({
          user,
          isAuthenticated: !!user
        });
      },

      setError: (error: string | null) => {
        set({error});
      },

      setLoading: (loading: boolean) => {
        set({isLoading: loading});
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Persiste apenas dados essenciais
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
