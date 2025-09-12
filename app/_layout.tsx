import '../tamagui-web.css'
import {useColorScheme} from 'react-native'
import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native'
import {useFonts} from 'expo-font'
import {SplashScreen, Stack} from 'expo-router'
import {Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold} from '@expo-google-fonts/poppins'
import {useEffect} from 'react'
import Toast from 'react-native-toast-message';
import {AppProvider} from '@/shared/providers/AppProvider';
import {SafeAreaProvider} from 'react-native-safe-area-context';

export {
  ErrorBoundary,
} from 'expo-router'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Poppins': Poppins_400Regular,
    'Poppins-Medium': Poppins_500Medium,
    'Poppins-SemiBold': Poppins_600SemiBold,
    'Poppins-Bold': Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  if (!fontsLoaded) {
    return null
  }

  return (
    <Providers>
      <RootLayoutNav/>
      <Toast/>
    </Providers>
  )
}

const Providers = ({children}: { children: React.ReactNode }) => {
  return <AppProvider>{children}</AppProvider>
}

function RootLayoutNav() {
  const colorScheme = useColorScheme()
  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen
            name="(auth)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="(app)"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}
