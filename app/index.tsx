import {useEffect} from 'react';
import {View} from 'react-native';
import {Redirect} from 'expo-router';
import {useAuthStore} from '@/features/auth/stores/authStore';
import LottieSplash from '@/shared/components/ui/SplashScreen/LottieSplash';
import splashAnimation from '@/assets/animations/loader.json';

/**
 * 🎯 Página inicial que redireciona baseado no estado de autenticação
 * Esta é a primeira tela que aparece quando o app abre
 */
export default function IndexPage() {
  const {isInitialized, isAuthenticated, initialize} = useAuthStore();

  useEffect(() => {
    if (!isInitialized) {
      console.log('🔄 Index: Iniciando autenticação...');
      initialize();
    }
  }, [isInitialized, initialize]);

  // 🔄 LOADING: Mostra splash até inicializar
  if (!isInitialized) {
    console.log('⏳ Index: Aguardando inicialização...');
    return (
      <View style={{flex: 1}}>
        <LottieSplash
          animationSource={splashAnimation}
          onComplete={() => {}} // Não faz nada, espera isInitialized
          duration={3000}
          text="Inicializando..."
          textSize={16}
          animationSize="fullscreen"
          spacing={32}
        />
      </View>
    );
  }

  // ✅ REDIRECIONAR baseado no estado de autenticação
  if (isAuthenticated) {
    console.log('🏠 Index: Redirecionando para app (autenticado)');
    return <Redirect href="/(app)/home"/>;
  } else {
    console.log('🔐 Index: Redirecionando para auth (não autenticado)');
    return <Redirect href="/(auth)/sign-in"/>;
  }
}
