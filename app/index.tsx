import React, {useEffect} from 'react';
import {Redirect} from 'expo-router';
import {useAuth} from '@/features/auth/hooks/useAuth';

export default function Index() {
  const {isAuthenticated, isInitialized, initialize} = useAuth();

  useEffect(() => {
    console.log('🚀 Inicializando auth store...');
    initialize();
  }, []);

  console.log('📍 Index state:', {isAuthenticated, isInitialized});

  if (!isInitialized) {
    console.log('⏳ Aguardando inicialização...');
    return null;
  }

  const targetRoute = isAuthenticated ? '/(app)/home' : '/(auth)/home';
  console.log('🔄 Redirecionando para:', targetRoute);

  return <Redirect href={targetRoute}/>;
}
