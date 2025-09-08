import {AuthTokens, User} from '@/features/auth';
import {useCallback, useMemo} from 'react';
import {useAuthActions, useAuthLoading, useAuthStore, useIsAuthenticated, useIsInitialized} from './authStore';
import {useUserActions, useUserLoading} from './userStore';
import {useUser} from '@/shared/store';

export {useAuthStore, useIsAuthenticated, useAuthLoading, useIsInitialized, useAuthActions} from './authStore';
export {useUserStore, useUser, useUserLoading, useUserActions, useUserHelpers} from './userStore';

export const useCombinedAuth = () => {
  const authActions = useAuthActions();
  const userActions = useUserActions();

  const combinedLogin = useCallback(async (user: User, tokens: AuthTokens) => {
    await authActions.login(tokens);
    userActions.setUser(user);
  }, [authActions.login, userActions.setUser]);

  const combinedLogout = useCallback(async () => {
    await authActions.logout();
    userActions.clearUser();
  }, [authActions.logout, userActions.clearUser]);

  const initialize = useCallback(async () => {
    await authActions.initialize();

    // Se autenticado, busca dados do usuário
    if (useAuthStore.getState().isAuthenticated) {
      try {
        await userActions.refreshUser();
      } catch (error) {
        console.error('Failed to fetch user data on init:', error);
        // Se falha ao buscar usuário, força logout
        await authActions.logout();
        userActions.clearUser();
      }
    }
  }, [authActions.initialize, authActions.logout, userActions.refreshUser, userActions.clearUser]);

  const refreshAuth = useCallback(async () => {
    const isValid = await authActions.checkAuthStatus();

    if (isValid) {
      await userActions.refreshUser();
    } else {
      userActions.clearUser();
    }

    return isValid;
  }, [authActions.checkAuthStatus, userActions.refreshUser, userActions.clearUser]);

  return useMemo(() => ({
    login: combinedLogin,
    logout: combinedLogout,
    initialize,
    refreshAuth,
  }), [combinedLogin, combinedLogout, initialize, refreshAuth]);
};

export const useAuth = () => {
  const isAuthenticated = useIsAuthenticated();
  const user = useUser();
  const authLoading = useAuthLoading();
  const userLoading = useUserLoading();
  const isInitialized = useIsInitialized();

  const isLoading = useMemo(() => authLoading || userLoading, [authLoading, userLoading]);
  const userName = useMemo(() => user?.name, [user?.name]);
  const userEmail = useMemo(() => user?.email, [user?.email]);
  const isEmailVerified = useMemo(() => user?.emailVerified ?? false, [user?.emailVerified]);

  return useMemo(() => ({
    isAuthenticated,
    user,
    isLoading,
    isInitialized,
    // Quick access to user info
    userName,
    userEmail,
    isEmailVerified,
  }), [
    isAuthenticated,
    user,
    isLoading,
    isInitialized,
    userName,
    userEmail,
    isEmailVerified,
  ]);
};

export const useAuthGuard = () => {
  const {isAuthenticated, isInitialized, isLoading} = useAuth();

  return useMemo(() => ({
    canAccess: isAuthenticated && isInitialized,
    shouldShowLogin: !isAuthenticated && isInitialized,
    shouldShowLoading: !isInitialized || isLoading,
  }), [isAuthenticated, isInitialized, isLoading]);
};
