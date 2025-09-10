import React from 'react';
import {Redirect} from 'expo-router';
import {useAuth} from '@/features/auth/hooks/useAuth';

interface AuthGuardProps {
  requireAuth?: boolean;
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * Componente para proteção de rotas baseado no estado de autenticação
 *
 * @param requireAuth - Se true, usuário deve estar logado. Se false, usuário deve estar deslogado
 * @param children - Componentes a serem renderizados
 * @param redirectTo - Rota de redirecionamento personalizada
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({
                                                      requireAuth = true,
                                                      children,
                                                      redirectTo
                                                    }) => {
  const {isAuthenticated, isInitialized} = useAuth();

  console.log('AuthGuard:', {requireAuth, isAuthenticated, isInitialized});

  if (!isInitialized) {
    console.log('AuthGuard: Aguardando inicialização...');
    return null;
  }

  if (requireAuth && !isAuthenticated) {
    const loginRoute = redirectTo || '/(auth)/sign-in';
    return <Redirect href={loginRoute as any}/>;
  }

  if (!requireAuth && isAuthenticated) {
    const homeRoute = redirectTo || '/(app)/home';
    return <Redirect href={homeRoute as any}/>;
  }

  return <>{children}</>;
};
