import React, {useEffect, useState} from 'react';
import {useRouter, useSegments} from 'expo-router';
import {useAuthStore} from '@/features/auth/stores/authStore';
import {useCombinedAuth} from '@/features/auth/stores';
import {ActivityIndicator, Text, View} from 'react-native';

interface AuthInitializerProps {
  children: React.ReactNode;
}

export function AuthInitializer({children}: AuthInitializerProps) {
  const router = useRouter();
  const segments = useSegments();
  const {isAuthenticated, isInitialized, isLoading} = useAuthStore();
  const {initialize} = useCombinedAuth();

  const [isHydrated, setIsHydrated] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHydrated(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const initializeAuth = async () => {
      try {
        console.log('🔄 Inicializando autenticação...');
        await initialize();
        console.log('✅ Autenticação inicializada');
      } catch (error) {
        console.error('❌ Erro na inicialização:', error);
        setInitError('Erro ao inicializar autenticação');
      }
    };

    if (!isInitialized) {
      initializeAuth();
    }
  }, [isHydrated, isInitialized, initialize]);

  useEffect(() => {
    if (!isInitialized || !isHydrated || isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    console.log('🔄 Verificando roteamento:', {
      isAuthenticated,
      inAuthGroup,
      segments: segments.join('/')
    });

    if (!isAuthenticated && !inAuthGroup) {
      console.log('➡️ Redirecionando para login');
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      console.log('➡️ Redirecionando para home');
      router.replace('/(app)/home');
    }
  }, [isAuthenticated, isInitialized, segments, isHydrated, isLoading]);

  if (!isHydrated || !isInitialized || isLoading) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1a2a35'
      }}>
        <ActivityIndicator size="large" color="#ffffff"/>
        <Text style={{color: '#ffffff', marginTop: 16}}>
          {!isHydrated ? 'Carregando configurações...' :
            !isInitialized ? 'Inicializando...' :
              'Verificando autenticação...'}
        </Text>
        {initError && (
          <Text style={{color: '#ff6b6b', marginTop: 8, textAlign: 'center'}}>
            {initError}
          </Text>
        )}
      </View>
    );
  }

  return <>{children}</>;
}
