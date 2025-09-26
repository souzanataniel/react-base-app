import React, {useEffect} from 'react';
import {View} from 'react-native';
import {Redirect} from 'expo-router';
import {useAuthStore} from '@/features/auth/stores/authStore';
import {TransitionOverlay} from './TransitionOverlay';
import LottieSplash from '@/shared/components/ui/SplashScreen/LottieSplash';
import splashAnimation from '@/assets/animations/loader.json';

interface AuthGateProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  publicOnly?: boolean;
}

export const AuthGate: React.FC<AuthGateProps> = ({
                                                    children,
                                                    requireAuth = false,
                                                    publicOnly = false
                                                  }) => {
  const {isInitialized, isAuthenticated, isRedirecting, initialize} = useAuthStore();

  useEffect(() => {
    if (!isInitialized) {
      console.log('🔄 AuthGate: Iniciando autenticação...');
      initialize();
    }
  }, [isInitialized, initialize]);

  if (!isInitialized) {
    console.log('⏳ AuthGate: Aguardando inicialização...');
    return (
      <View style={{flex: 1}}>
        <LottieSplash
          animationSource={splashAnimation}
          onComplete={() => {}}
          duration={3000}
          text="Carregando..."
          textSize={16}
          animationSize="fullscreen"
          spacing={32}
        />
      </View>
    );
  }

  if (isRedirecting) {
    console.log('🎭 AuthGate: Mostrando transição...');
    return (
      <TransitionOverlay
        onComplete={() => {
          console.log('🎯 Transição completa - renderizando conteúdo...');
        }}
      />
    );
  }

  if (requireAuth && !isAuthenticated) {
    console.log('🔒 AuthGate: Redirecionando para login (não autenticado)');
    return <Redirect href="/(auth)/sign-in"/>;
  }

  if (publicOnly && isAuthenticated) {
    console.log('🏠 AuthGate: Redirecionando para home (já autenticado)');
    return <Redirect href="/(app)/home"/>;
  }

  console.log('✅ AuthGate: Renderizando conteúdo', {
    requireAuth,
    publicOnly,
    isAuthenticated
  });

  return <>{children}</>;
};
