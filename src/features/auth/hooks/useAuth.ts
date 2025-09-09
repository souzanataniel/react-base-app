import {SignInCredentials, SignUpCredentials, useAuthStore, User} from '@/features/auth';

/**
 * Hook principal de autenticação
 * Expõe estado e ações do sistema de auth
 */
export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
    error,
    signIn,
    signUp,
    signOut,
    initialize,
    setError,
    setUser,
  } = useAuthStore();

  /**
   * Faz login do usuário
   */
  const handleSignIn = async (credentials: SignInCredentials) => {
    return await signIn(credentials);
  };

  /**
   * Cadastra novo usuário
   */
  const handleSignUp = async (credentials: SignUpCredentials) => {
    return await signUp(credentials);
  };

  /**
   * Faz logout do usuário
   */
  const handleSignOut = async () => {
    await signOut();
  };

  /**
   * Inicializa o sistema de autenticação
   */
  const handleInitialize = async () => {
    await initialize();
  };

  /**
   * Limpa erro atual
   */
  const clearError = () => {
    setError(null);
  };

  /**
   * Verifica se usuário está logado
   */
  const isLoggedIn = isAuthenticated && !!user;

  /**
   * Obtém nome completo do usuário
   */
  const getFullName = (user?: User | null): string => {
    const currentUser = user || useAuthStore.getState().user;
    if (!currentUser) return '';

    const {firstName, lastName} = currentUser;
    return [firstName, lastName].filter(Boolean).join(' ') || '';
  };

  /**
   * Obtém primeiro nome do usuário
   */
  const getFirstName = (user?: User | null): string => {
    const currentUser = user || useAuthStore.getState().user;
    return currentUser?.firstName || '';
  };

  return {
    // Estado
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
    error,
    isLoggedIn,

    // Actions
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    initialize: handleInitialize,
    clearError,
    setUser,

    // Helpers
    getFullName,
    getFirstName,
  };
};
