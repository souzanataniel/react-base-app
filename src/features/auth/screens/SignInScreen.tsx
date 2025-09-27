import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import { Text, View, XStack, YStack } from 'tamagui';
import { BaseScreenWrapper } from '@/shared/components/layout';
import { Link, router } from 'expo-router';
import { useSignIn } from '@/features/auth/hooks/useSignIn';
import { SignInForm } from '@/features/auth/components/SignInForm';
import { LogoMediumDark } from '@/shared/components/ui/Background/Logo';
// import { useGlobalAlert } from '@/shared/components/feedback/BaseAlert/BaseAlert'; // TEMPORARIAMENTE COMENTADO

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

  // TEMPORARIAMENTE COMENTADO PARA EVITAR ERRO
  // const { showError } = useGlobalAlert();

  const handleSubmitClick = async () => {
    const result = await submit();

    if (!result.success) {
      // USANDO Alert nativo temporariamente
      Alert.alert('Erro no Login', result.message);
      // showError('Erro no Login', result.message);
    }

    if (Object.keys(errors).length > 0) {
      const msgs = Object.values(errors)
        .map((e: any) => e?.message)
        .filter(Boolean)
        .join('\n');

      // USANDO Alert nativo temporariamente
      Alert.alert('Corrija os campos', msgs || 'Há erros no formulário.');
      // showError('Corrija os campos', msgs || 'Há erros no formulário.');
    }
  };

  useEffect(() => {
    updateEmail('souzanataniel@hotmail.com');
    updatePassword('123456');
  }, []);

  return (
    <BaseScreenWrapper extraScrollHeight={100}>
      <View flex={1} justifyContent="center">
        <YStack padding="$2">
          <YStack
            backgroundColor="$defaultWhite"
            borderRadius="$6"
            padding="$5"
            marginHorizontal="$2"
            shadowColor="#000"
            shadowOpacity={0.15}
            shadowOffset={{ width: 0, height: 1 }}
            shadowRadius={3}
          >
            <YStack position="absolute" top="$4" left="$4" zIndex={10}>
              <YStack
                width={40}
                height={40}
                borderRadius={20}
                backgroundColor="$defaultQuaternaryLabel"
                alignItems="center"
                justifyContent="center"
                pressStyle={{ opacity: 0.7, scale: 0.95 }}
                onPress={() => router.push('/(auth)/home')}>
                <Text fontSize="$5" color="$defaultSecondaryLabel" fontWeight="600">
                  ←
                </Text>
              </YStack>
            </YStack>
            <YStack alignItems="center" marginBottom="$4">
              <LogoMediumDark />
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
              onBlurEmail={() => { }}
              onBlurPassword={() => { }}
              canSubmit={canSubmit}
              isLoading={isLoading}
              onSubmit={handleSubmitClick}
            />

            <YStack alignItems="center" gap="$4" paddingTop="$4">
              <XStack alignItems="center" width="100%" paddingHorizontal="$4">
                <View flex={1} height={1} backgroundColor="$defaultPlaceholderText" />
                <Text
                  fontSize="$3"
                  color="$defaultSecondaryLabel"
                  paddingHorizontal="$3"
                  fontWeight="400"
                >
                  ou
                </Text>
                <View flex={1} height={1} backgroundColor="$defaultPlaceholderText" />
              </XStack>

              <Link href="/(auth)/sign-up" replace asChild>
                <YStack alignItems="center" pressStyle={{ opacity: 0.7 }}>
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
