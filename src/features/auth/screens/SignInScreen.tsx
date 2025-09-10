import React from 'react';
import {Text, View, XStack, YStack} from 'tamagui';
import {BackButton} from 'src/shared/components';
import {BaseScreenWrapper} from '@/shared/components/layout';
import {Link} from 'expo-router';
import {useSignIn} from '@/features/auth/hooks/useSignIn';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {COLORS} from '@/shared/constants/colors';
import {Logo} from '@/shared/components/ui/Background/Logo';
import {SignInForm} from '@/features/auth/components/SignInForm';

export const SignInScreen = () => {
  const {
    credentials,
    updateField,
    markFieldAsTouched,
    handleSubmit,
    canSubmit,
    isLoading,
    clearError,
  } = useSignIn();

  const [rememberMe, setRememberMe] = React.useState(false);
  const insets = useSafeAreaInsets();

  const onSubmit = async () => await handleSubmit();

  return (
    <BaseScreenWrapper>
      <View>
        <XStack
          justifyContent="space-between"
          alignItems="center"
          paddingTop={insets.top + 10}
          paddingHorizontal="$4"
          marginBottom="$4"
        >
          <BackButton/>
        </XStack>

        <YStack flex={1} gap="$4">
          {/* Logo Section */}
          <YStack alignItems="center" justifyContent="center">
            <Logo variant="medium"/>
          </YStack>

          {/* Form Section */}
          <YStack flex={0.6} padding="$3">
            <YStack
              backgroundColor="$white"
              borderRadius="$6"
              padding="$5"
              marginHorizontal="$2"
              elevation={1}
            >
              <YStack gap="$1" marginBottom="$6">
                <Text
                  fontSize="$6"
                  fontWeight="600"
                  color="$darkBlue"
                >
                  Entrar
                </Text>
                <Text
                  fontSize="$3"
                  fontWeight="400"
                  color="$mediumBlue"
                >
                  Insira seus dados para continuar
                </Text>
              </YStack>

              <SignInForm
                email={credentials.email}
                password={credentials.password}
                rememberMe={rememberMe}
                onEmailChange={(t) => {
                  updateField('email', t);
                  clearError();
                }}
                onPasswordChange={(t) => {
                  updateField('password', t);
                  clearError();
                }}
                onBlurEmail={() => markFieldAsTouched('email')}
                onBlurPassword={() => markFieldAsTouched('password')}
                canSubmit={canSubmit}
                isLoading={isLoading}
                onSubmit={onSubmit}
                colors={{dark: COLORS.DARK, medium: '$medium' as any, white: '$white' as any}}
              />

              <View flex={1}/>

              <YStack alignItems="center" gap="$4" paddingTop="$4">
                <XStack alignItems="center" width="100%" paddingHorizontal="$4">
                  <View flex={1} height={1} backgroundColor="$borderColor"/>
                  <Text
                    fontSize="$3"
                    color="$mediumBlue"
                    paddingHorizontal="$3"
                    fontWeight="400"
                  >
                    ou
                  </Text>
                  <View flex={1} height={1} backgroundColor="$borderColor"/>
                </XStack>

                <Link href="/(auth)/sign-up" replace asChild>
                  <YStack alignItems="center" pressStyle={{opacity: 0.7}}>
                    <Text
                      fontSize="$3"
                      color="$mediumBlue"
                      fontWeight="400"
                      textAlign="center"
                    >
                      Não possui conta?{' '}
                      <Text
                        fontWeight="600"
                        textDecorationLine="underline"
                        color="$darkBlue"
                      >
                        Cadastre-se
                      </Text>
                    </Text>
                  </YStack>
                </Link>
              </YStack>
            </YStack>
          </YStack>
        </YStack>
      </View>
    </BaseScreenWrapper>
  );
}
