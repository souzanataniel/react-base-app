import '../tamagui-web.css'
import {Animated, useColorScheme, View} from 'react-native'
import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native'
import {useFonts} from 'expo-font'
import {SplashScreen, Stack} from 'expo-router'
import {useEffect, useRef, useState} from 'react'
import Toast from 'react-native-toast-message';
import {AppProvider} from '@/shared/providers/AppProvider';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import LottieSplash from '@/shared/components/ui/SplashScreen/LottieSplash';
import {useAuthStore} from '@/features/auth/stores/authStore';

import splashAnimation from '@/assets/animations/loader.json';
import {Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold} from '@expo-google-fonts/inter';

export {
  ErrorBoundary,
} from 'expo-router'

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  let [fontsLoaded] = useFonts({
    'Inter': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  const [appIsReady, setAppIsReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const appOpacity = useRef(new Animated.Value(0)).current;
  const {initialize, isInitialized, isAuthenticated} = useAuthStore();
  const [initializeCalled, setInitializeCalled] = useState(false);

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);


  useEffect(() => {
    async function prepare() {
      try {
        if (!fontsLoaded) return;
        if (initializeCalled) return;

        console.log('📱 Layout: primeira e única inicialização');
        setInitializeCalled(true);
        await initialize();
        setAppIsReady(true);

      } catch (e) {
        console.warn('Erro na preparação:', e);
        setAppIsReady(true);
      }
    }

    prepare().then();
  }, [fontsLoaded]);

  const handleSplashComplete = () => {
    console.log('📱 handleSplashComplete chamado', {appIsReady, isInitialized});

    if (appIsReady && (isInitialized || isAuthenticated)) {
      console.log('🚀 Iniciando transição seamless');

      Animated.timing(appOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        console.log('📱 App fade in completo - removendo splash overlay');
        setShowSplash(false);
      });
    } else {
      console.log('⏳ App não está pronto ainda - aguardando...');
      setTimeout(() => {
        if (isInitialized) {
          handleSplashComplete();
        }
      }, 500);
    }
  };

  useEffect(() => {
    if (appIsReady && isInitialized && !showSplash) {
      Animated.timing(appOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [appIsReady, isInitialized, showSplash, appOpacity]);

  return (
    <View style={{flex: 1}}>
      <Animated.View
        style={{
          flex: 1,
          opacity: appOpacity,
          backgroundColor: '#2873FF'
        }}
        pointerEvents={showSplash ? 'none' : 'auto'}
      >
        <Providers>
          <RootLayoutNav/>
          <Toast/>
        </Providers>
      </Animated.View>

      {showSplash && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999
          }}
        >
          <LottieSplash
            animationSource={splashAnimation}
            onComplete={handleSplashComplete}
            duration={5000}
            text="Preparando sua experiência..."
            textSize={16}
            animationSize="fullscreen"
            spacing={32}
          />
        </View>
      )}
    </View>
  );
}

const Providers = ({children}: { children: React.ReactNode }) => {
  return <AppProvider>{children}</AppProvider>
}

function RootLayoutNav() {
  const colorScheme = useColorScheme()
  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{
          headerShown: false,
          animation: 'none',
        }}>
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
              animation: 'none',
            }}
          />
          <Stack.Screen
            name="(auth)"
            options={{
              headerShown: false,
              animation: 'none',
            }}
          />
          <Stack.Screen
            name="(app)"
            options={{
              headerShown: false,
              animation: 'none',
            }}
          />
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}
