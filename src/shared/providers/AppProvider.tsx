import React from 'react';
import {TamaguiProvider, type TamaguiProviderProps, Theme} from 'tamagui';
import {ToastProvider, ToastViewport} from '@tamagui/toast';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {BaseToast} from '../components';
import {BaseLoaderProvider} from '../components/feedback/Loader';
import {config} from '../../../tamagui.config';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {AuthProvider} from '@/features/auth/providers/AuthProvider';
import {useThemeManager} from '@/shared/hooks/useTheme';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {BaseAlertProvider} from '@/shared/components/feedback/BaseAlert/BaseAlert';
import {HapticProvider} from '@/shared/components/feedback/Haptic/HapticContext';
import '@/lib/firebase';
import {BaseModalProvider} from '@/shared/components/feedback/BaseModal/BaseModal';
import {ImageSourcePickerProvider} from '@/shared/components/ui/ImageSourcePicker/ImageSourcePicker';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: (failureCount, error: any) => {
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
      onError: (error) => {
        console.error('Mutation Error:', error);
      },
    },
  },
});

const ThemedApp = ({children}: { children: React.ReactNode }) => {
  const {currentTheme} = useThemeManager();

  return (
    <Theme name={currentTheme}>
      <AuthProvider>
        <ToastProvider swipeDirection="horizontal" duration={3000} native={[]}>
          <BaseAlertProvider>
            <BaseLoaderProvider>
              <BaseModalProvider>
                <ImageSourcePickerProvider>
                  {children}
                </ImageSourcePickerProvider>;
              </BaseModalProvider>
              <BaseToast/>
              <ToastViewport
                top="$10"
                left="$4"
                right="$4"
                alignItems="stretch"
                pointerEvents="box-none"
              />
            </BaseLoaderProvider>
          </BaseAlertProvider>
        </ToastProvider>
      </AuthProvider>
    </Theme>
  );
};

export function AppProvider({children, ...rest}: Omit<TamaguiProviderProps, 'config'>) {
  return (
    <HapticProvider>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{flex: 1}}>
          <SafeAreaProvider>
            <TamaguiProvider config={config} {...rest}>
              <ThemedApp>
                {children}
              </ThemedApp>
            </TamaguiProvider>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </HapticProvider>
  );
}
