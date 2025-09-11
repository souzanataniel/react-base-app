import React from 'react';
import {Text, View, XStack, YStack} from 'tamagui';
import {BackButton} from 'src/shared/components';
import {BaseScreenWrapper} from '@/shared/components/layout';
import {Link} from 'expo-router';
import {useSignUp} from '@/features/auth/hooks/useSignUp';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {SignUpForm} from '@/features/auth/components/SignUpForm';
import {LogoMediumDark, LogoSmall} from '@/shared/components/ui/Background/Logo';
import {BlurView} from 'expo-blur';
import {useBaseAlert} from '@/shared/components/feedback/Alert/BaseAlertProvider';

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
  const alert = useBaseAlert();

  const handleSubmitClick = async () => {
    const result = await submit();

    if (!result.success) {
      alert.showError('Erro no Cadastro', result.message);
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
        <View flex={1} paddingTop={insets.top + 10}>
          <YStack flex={1} padding="$3" paddingBottom="$10">
            <YStack
              backgroundColor="$white"
              borderRadius="$6"
              padding="$5"
              marginHorizontal="$2"
              shadowColor="#000"
              shadowOpacity={0.15}
              shadowOffset={{width: 0, height: 1}}
              shadowRadius={3}
              gap="$4"
            >
              {/* Logo centralizada */}
              <YStack alignItems="center" marginBottom="$2">
                <LogoMediumDark/>
              </YStack>

              {/* Título e subtítulo centralizados */}
              <YStack gap="$2" alignItems="center">
                <Text fontSize="$6" fontWeight="600" color="$darkBlue" textAlign="center">
                  Cadastrar
                </Text>
                <Text fontSize="$3" fontWeight="400" color="$mediumBlue" textAlign="center">
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

              <YStack alignItems="center" gap="$3" paddingTop="$4">
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

                <Link href="/(auth)/sign-in" replace asChild>
                  <YStack alignItems="center" pressStyle={{opacity: 0.7}}>
                    <Text fontSize="$3" color="$mediumBlue" fontWeight="400" textAlign="center">
                      Já possui conta?{' '}
                      <Text fontWeight="600" textDecorationLine="underline" color="$darkBlue">
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
