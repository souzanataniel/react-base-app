import React, {useCallback} from 'react';
import {Text, View, XStack, YStack} from 'tamagui';
import {BaseScreenWrapper} from '@/shared/components/layout';
import {Link, useFocusEffect} from 'expo-router';
import {useSignUp} from '@/features/auth/hooks/useSignUp';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {SignUpForm} from '@/features/auth/components/SignUpForm';
import {LogoMediumDark} from '@/shared/components/ui/Background/Logo';
import {useBaseAlert} from '@/shared/components/feedback/Alert/BaseAlertProvider';
import {LinearGradient} from 'expo-linear-gradient';
import {useGradient} from '@/shared/components/ui/GradientBox/GradientBox';
import {useStatusBar} from '@/shared/components/ui/StatusBarContext/StatusBarContext';

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
  const heroGradient = useGradient('medium');
  const {setStatusBar, resetStatusBar} = useStatusBar();

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

  useFocusEffect(
    useCallback(() => {
      setStatusBar('#F3F4F6', 'dark');
      return () => resetStatusBar();
    }, [setStatusBar, resetStatusBar])
  );

  return (
    <BaseScreenWrapper>
      <LinearGradient colors={heroGradient} style={{flex: 1}}>
        <View flex={1} paddingTop={insets.top + 10} justifyContent="center">
          <YStack padding="$2" gap="$2">
            <YStack
              backgroundColor="$white"
              borderRadius="$6"
              padding="$5"
              marginHorizontal="$2"
              shadowColor="#000"
              shadowOpacity={0.15}
              shadowOffset={{width: 0, height: 1}}
              shadowRadius={3}
              gap="$2"
            >
              {/* Logo centralizada */}
              <YStack alignItems="center" marginBottom="$2">
                <LogoMediumDark/>
              </YStack>

              <YStack gap="$2" alignItems="center">
                <Text fontSize="$6" fontWeight="600" color="$absoluteTextPrimary" textAlign="center">
                  Cadastrar
                </Text>
                <Text fontSize="$3" fontWeight="400" color="$absoluteTextSecondary" textAlign="center">
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
                  <View flex={1} height={1} backgroundColor="$absolutePlaceholder"/>
                  <Text
                    fontSize="$3"
                    color="$absoluteTextTertiary"
                    paddingHorizontal="$3"
                    fontWeight="400"
                  >
                    ou
                  </Text>
                  <View flex={1} height={1} backgroundColor="$absolutePlaceholder"/>
                </XStack>

                <Link href="/(auth)/sign-in" replace asChild>
                  <YStack alignItems="center" pressStyle={{opacity: 0.7}}>
                    <Text fontSize="$3" color="$absoluteTextTertiary" fontWeight="400" textAlign="center">
                      Já possui conta?{' '}
                      <Text fontWeight="600" textDecorationLine="underline" color="$absoluteTextSecondary">
                        Fazer login
                      </Text>
                    </Text>
                  </YStack>
                </Link>
              </YStack>
            </YStack>
          </YStack>
        </View>
      </LinearGradient>
    </BaseScreenWrapper>
  );
};
