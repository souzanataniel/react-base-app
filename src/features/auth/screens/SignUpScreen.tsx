import React from 'react';
import {Text, View, XStack, YStack} from 'tamagui';
import {BaseScreenWrapper} from '@/shared/components/layout';
import {Link, router} from 'expo-router';
import {useSignUp} from '@/features/auth/hooks/useSignUp';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {SignUpForm} from '@/features/auth/components/SignUpForm';
import {LogoMediumDark} from '@/shared/components/ui/Background/Logo';
import {useGlobalAlert} from '@/shared/components/feedback/BaseAlert/BaseAlert';

export const SignUpScreen = () => {
  const {
    firstName,
    lastName,
    email,
    phone,
    password,
    acceptTerms,
    updateFirstName,
    updateLastName,
    updateEmail,
    updatePhone,
    updatePassword,
    updateAcceptTerms,
    submit,
    canSubmit,
    isLoading,
    clearError,
    errors,
    getPasswordStrength,
  } = useSignUp();

  const insets = useSafeAreaInsets();
  const {showError} = useGlobalAlert();

  const handleSubmitClick = async () => {
    const result = await submit();

    if (!result.success) {
      showError('Erro no Cadastro', result.message);
    }

    if (Object.keys(errors).length > 0) {
      const msgs = Object.values(errors)
        .map((e: any) => e?.message)
        .filter(Boolean)
        .join('\n');
      showError('Corrija os campos', msgs || 'Há erros no formulário.');
    }
  };

  return (
    <BaseScreenWrapper>
      <View flex={1} paddingTop={insets.top + 10} justifyContent="center">
        <YStack padding="$2" gap="$2">
          <YStack
            backgroundColor="$defaultWhite"
            borderRadius="$6"
            padding="$5"
            marginHorizontal="$2"
            shadowColor="#000"
            shadowOpacity={0.15}
            shadowOffset={{width: 0, height: 1}}
            shadowRadius={3}
            gap="$2"
          >
            <YStack position="absolute" top="$4" left="$4" zIndex={10}>
              <YStack
                width={40}
                height={40}
                borderRadius={20}
                backgroundColor="$defaultQuaternaryLabel"
                alignItems="center"
                justifyContent="center"
                pressStyle={{opacity: 0.7, scale: 0.95}}
                onPress={() => router.push('/(auth)/home')}>
                <Text fontSize="$5" color="$defaultSecondaryLabel" fontWeight="600">
                  ←
                </Text>
              </YStack>
            </YStack>

            <YStack alignItems="center" marginBottom="$2">
              <LogoMediumDark/>
            </YStack>

            <YStack gap="$2" alignItems="center">
              <Text fontSize="$6" fontWeight="600" color="$defaultLabel" textAlign="center">
                Cadastrar
              </Text>
              <Text fontSize="$3" fontWeight="400" color="$defaultLabel" textAlign="center">
                Preencha os dados para criar sua conta
              </Text>
            </YStack>

            <SignUpForm
              firstName={firstName}
              lastName={lastName}
              email={email}
              phone={phone}
              password={password}
              acceptTerms={acceptTerms}
              onFirstNameChange={(value) => {
                updateFirstName(value);
                clearError();
              }}
              onLastNameChange={(value) => {
                updateLastName(value);
                clearError();
              }}
              onEmailChange={(value) => {
                updateEmail(value);
                clearError();
              }}
              onPhoneChange={(value) => {
                updatePhone(value);
                clearError();
              }}
              onPasswordChange={(value) => {
                updatePassword(value);
                clearError();
              }}
              onAcceptTermsChange={(value) => {
                updateAcceptTerms(value);
                clearError();
              }}
              onBlurFirstName={() => {}}
              onBlurLastName={() => {}}
              onBlurEmail={() => {}}
              onBlurPhone={() => {}}
              onBlurPassword={() => {}}
              canSubmit={canSubmit}
              isLoading={isLoading}
              onSubmit={handleSubmitClick}
              passwordStrength={getPasswordStrength()}
            />

            <YStack alignItems="center" gap="$2" marginTop="$2">
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

              <Link href="/(auth)/sign-in" replace asChild>
                <YStack alignItems="center" pressStyle={{opacity: 0.7}}>
                  <Text fontSize="$3" color="$defaultSecondaryLabel" fontWeight="400" textAlign="center">
                    Já possui conta?{' '}
                    <Text fontWeight="600" textDecorationLine="underline" color="$defaultLabel">
                      Fazer login
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
