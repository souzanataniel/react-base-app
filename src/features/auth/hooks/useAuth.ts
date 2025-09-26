import {useAuthStore} from '@/features/auth/stores/authStore';

export const useAuth = () => {
  const store = useAuthStore();

  return {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    isInitialized: store.isInitialized,
    isRedirecting: store.isRedirecting,
    error: store.error,

    signIn: store.signIn,
    signUp: store.signUp,
    signOut: store.signOut,
    initialize: store.initialize,
    updatePassword: store.updatePassword,
    setUser: store.setUser,
    setError: store.setError,
    setLoading: store.setLoading,
    setRedirecting: store.setRedirecting,
    clearError: store.clearError,
  };
};
