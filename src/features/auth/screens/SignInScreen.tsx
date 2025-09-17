import React, {useEffect} from 'react';
import {Text, View, XStack, YStack} from 'tamagui';
import {BaseScreenWrapper} from '@/shared/components/layout';
import {Link} from 'expo-router';
import {useSignIn} from '@/features/auth/hooks/useSignIn';
import {SignInForm} from '@/features/auth/components/SignInForm';
import {useBaseAlert} from '@/shared/components/feedback/Alert/BaseAlertProvider';
import {LogoMediumDark} from '@/shared/components/ui/Background/Logo';

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

  useEffect(() => {
    updateEmail('souzanataniel@hotmail.com');
    updatePassword('123456');
  }, []);

  return (
    <BaseScreenWrapper extraScrollHeight={100} keyboardOpeningTime={300}>
      <View flex={1} justifyContent="center">
        <YStack padding="$2">
          <YStack
            backgroundColor="$defaultWhite"
            borderRadius="$6"
            padding="$5"
            marginHorizontal="$2"
            shadowColor="#000"
            shadowOpacity={0.15}
            shadowOffset={{width: 0, height: 1}}
            shadowRadius={3}
          >
            <YStack alignItems="center" marginBottom="$4">
              <LogoMediumDark/>
            </YStack>

            <YStack gap="$2" marginBottom="$6" alignItems="center">
              <Text fontSize="$6" fontWeight="600" color="$defaultLabel" textAlign="center">
                Entrar
              </Text>
              <Text fontSize="$3" fontWeight="400" color="$defaultLabel" textAlign="center">
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
            />

            <YStack alignItems="center" gap="$4" paddingTop="$4">
              <XStack alignItems="center" width="100%" paddingHorizontal="$4">
                <View flex={1} height={1} backgroundColor="$defaultPlaceholderText"/>
                <Text
                  fontSize="$3"
                  color="$defaultSecondaryLabel"
                  paddingHorizontal="$3"
                  fontWeight="400"
                >
                  ou
                </Text>
                <View flex={1} height={1} backgroundColor="$defaultPlaceholderText"/>
              </XStack>

              <Link href="/(auth)/sign-up" replace asChild>
                <YStack alignItems="center" pressStyle={{opacity: 0.7}}>
                  <Text fontSize="$3" color="$defaultSecondaryLabel" fontWeight="400" textAlign="center">
                    Não possui conta?{' '}
                    <Text fontWeight="600" textDecorationLine="underline" color="$defaultLabel">
                      Cadastre-se
                    </Text>
                  </Text>
                </YStack>
              </Link>
            </YStack>
          </YStack>
        </YStack>
      </View>
    </BaseScreenWrapper>
  );
};
