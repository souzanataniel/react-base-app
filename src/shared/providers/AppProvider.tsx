import {TamaguiProvider, type TamaguiProviderProps, Theme} from 'tamagui'
import {ToastProvider, ToastViewport} from '@tamagui/toast'
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {BaseToast} from '../components';
import {BaseAlertProvider} from '../components/feedback/Alert';
import {BaseLoaderProvider} from '../components/feedback/Loader';
import {config} from '../../../tamagui.config';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {useColorScheme} from 'react-native';
import {AuthProvider} from '@/features/auth/providers/AuthProvider';
import React from 'react';

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

export function AppProvider({children, ...rest}: Omit<TamaguiProviderProps, 'config'>) {
  const colorScheme = useColorScheme();
  const themeName = colorScheme ?? 'light';

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <TamaguiProvider config={config} {...rest}>
          <Theme name={themeName}>
            <AuthProvider>
              <ToastProvider swipeDirection="horizontal" duration={3000} native={[]}>
                <BaseAlertProvider>
                  <BaseLoaderProvider>
                    {children}
                    <BaseToast/>
                    <ToastViewport
                      top="$10"
                      left="$4"
                      right="$4"
                      alignItems="stretch"
                      pointerEvents="box-none"/>
                  </BaseLoaderProvider>
                </BaseAlertProvider>
              </ToastProvider>
            </AuthProvider>
          </Theme>
        </TamaguiProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  )
}
