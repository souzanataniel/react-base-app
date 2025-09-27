import '../tamagui-web.css'
import '@/lib/firebase'

import {useFonts} from 'expo-font'
import {SplashScreen, Stack} from 'expo-router'
import {useEffect} from 'react'
import Toast from 'react-native-toast-message';
import {AppProvider} from '@/shared/providers/AppProvider';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold} from '@expo-google-fonts/inter';
import {getApp} from '@react-native-firebase/app';
import {getMessaging, onMessage, setBackgroundMessageHandler} from '@react-native-firebase/messaging';
import * as Notifications from 'expo-notifications';

export {
  ErrorBoundary,
} from 'expo-router'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowList: false,
  }),
});

const setupNotifications = () => {
  try {
    const messaging = getMessaging(getApp());

    setBackgroundMessageHandler(messaging, async (remoteMessage) => {
      console.log('📱 BACKGROUND: Mensagem recebida', {
        title: remoteMessage.notification?.title,
        body: remoteMessage.notification?.body,
        data: remoteMessage.data
      });

      if (remoteMessage.data) {
        console.log('💾 Processando dados da notificação:', remoteMessage.data);
      }

      return Promise.resolve();
    });

    onMessage(messaging, (remoteMessage) => {
      console.log('📱 FOREGROUND: Mensagem recebida', {
        title: remoteMessage.notification?.title,
        body: remoteMessage.notification?.body,
        data: remoteMessage.data
      });
    });

    console.log('✅ Listeners de notificação configurados');
  } catch (error) {
    console.error('❌ Erro ao configurar notificações:', error);
  }
};

setupNotifications();

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  let [fontsLoaded] = useFonts({
    'Inter': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    const notificationResponseSubscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log('🚀 NOTIFICATION TAPPED:', {
          data: response.notification.request.content.data,
          title: response.notification.request.content.title
        });

        // Aqui você pode navegar para telas específicas baseado em response.notification.request.content.data
        // Exemplo: router.push('/specific-screen')
      }
    );

    return () => notificationResponseSubscription.remove();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Providers>
      <RootLayoutNav/>
      <Toast/>
    </Providers>
  );
}

const Providers = ({children}: { children: React.ReactNode }) => {
  return <AppProvider>{children}</AppProvider>
}

function RootLayoutNav() {
  return (
    <SafeAreaProvider>
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
    </SafeAreaProvider>
  )
}
