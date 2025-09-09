import React, {useEffect} from 'react';
import {Spinner, Text, YStack} from 'tamagui';
import {useAuth} from '@/features/auth';
import * as authService from '../services/authService';

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Provider que inicializa o sistema de autenticação
 * e escuta mudanças no estado de auth
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const {initialize, isInitialized, isLoading, setUser} = useAuth();

  useEffect(() => {
    console.log('AuthProvider: Inicializando...');

    initialize();

    const {data: {subscription}} = authService.onAuthStateChange((user) => {
      console.log('Auth state changed:', !!user);
      setUser(user);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  console.log('AuthProvider render:', {isInitialized, isLoading});

  if (!isInitialized || isLoading) {
    return (
      <YStack
        flex={1}
        justifyContent="center"
        alignItems="center"
        backgroundColor="$background"
        gap="$4"
      >
        <Spinner size="large" color="$blue10"/>
        <Text color="$gray11" fontSize="$4">
          Inicializando...
        </Text>
      </YStack>
    );
  }

  console.log('AuthProvider: Renderizando children');

  return <>{children}</>;
};
