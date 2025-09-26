import {useEffect} from 'react';
import {View} from 'react-native';
import {Redirect} from 'expo-router';
import {useAuthStore} from '@/features/auth/stores/authStore';
import LottieSplash from '@/shared/components/ui/SplashScreen/LottieSplash';
import splashAnimation from '@/assets/animations/loader.json';

export default function IndexPage() {
  const {isInitialized, isAuthenticated, initialize} = useAuthStore();

  useEffect(() => {
    if (!isInitialized) {
      console.log('🔄 Index: Iniciando autenticação...');
      initialize();
    }
  }, [isInitialized, initialize]);

  if (!isInitialized) {
    console.log('⏳ Index: Aguardando inicialização...');
    return (
      <View style={{flex: 1}}>
        <LottieSplash
          animationSource={splashAnimation}
          onComplete={() => {}}
          duration={3000}
          text="Inicializando..."
          textSize={16}
          animationSize="fullscreen"
          spacing={32}
        />
      </View>
    );
  }

  if (isAuthenticated) {
    console.log('🏠 Index: Redirecionando para app (autenticado)');
    return <Redirect href="/(app)/home"/>;
  } else {
    console.log('🔐 Index: Redirecionando para auth (não autenticado)');
    return <Redirect href="/(auth)/sign-in"/>;
  }
}
