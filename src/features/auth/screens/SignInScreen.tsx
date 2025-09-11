import React from 'react';
import {Text, View, XStack, YStack} from 'tamagui';
import {BackButton} from 'src/shared/components';
import {BaseScreenWrapper} from '@/shared/components/layout';
import {Link} from 'expo-router';
import {useSignIn} from '@/features/auth/hooks/useSignIn';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {COLORS} from '@/shared/constants/colors';
import {LogoMedium} from '@/shared/components/ui/Background/Logo';
import {SignInForm} from '@/features/auth/components/SignInForm';
import {useBaseAlert} from '@/shared/components/feedback/Alert/BaseAlertProvider';

export const SignInScreen = () => {
  const {
    email,
    password,
    updateEmail,
    updatePassword,
    submit,
    canSubmit,
    isLoading,
    clearError,
    errors,
  } = useSignIn();

  const insets = useSafeAreaInsets();
  const alert = useBaseAlert();

  const handleSubmitClick = async () => {
    const result = await submit();

    if (!result.success) {
      alert.showError('Erro no Login', result.message);
    }

    if (Object.keys(errors).length > 0) {
      const msgs = Object.values(errors)
        .map((e: any) => e?.message)
        .filter(Boolean)
        .join('\n');
      alert.showError('Corrija os campos', msgs || 'Há erros no formulário.');
    }
  };

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
          <YStack alignItems="center" justifyContent="center">
            <LogoMedium/>
          </YStack>

          <YStack flex={0.6} padding="$3">
            <YStack
              backgroundColor="$white"
              borderRadius="$6"
              padding="$5"
              marginHorizontal="$2"
              shadowColor="#000"
              shadowOpacity={0.15}
              shadowOffset={{width: 0, height: 1}}
              shadowRadius={3}
            >
              <YStack gap="$1" marginBottom="$6">
                <Text fontSize="$6" fontWeight="600" color="$darkBlue">
                  Entrar
                </Text>
                <Text fontSize="$3" fontWeight="400" color="$mediumBlue">
                  Insira seus dados para continuar
                </Text>
              </YStack>

              <SignInForm
                email={email}
                password={password}
                onEmailChange={(value) => {
                  updateEmail(value);
                  clearError();
                }}
                onPasswordChange={(value) => {
                  updatePassword(value);
                  clearError();
                }}
                onBlurEmail={() => {}}
                onBlurPassword={() => {}}
                canSubmit={canSubmit}
                isLoading={isLoading}
                onSubmit={handleSubmitClick}
                colors={{
                  dark: COLORS.DARK,
                  medium: '$medium' as any,
                  white: '$white' as any,
                }}
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
                    <Text fontSize="$3" color="$mediumBlue" fontWeight="400" textAlign="center">
                      Não possui conta?{' '}
                      <Text fontWeight="600" textDecorationLine="underline" color="$darkBlue">
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
};
