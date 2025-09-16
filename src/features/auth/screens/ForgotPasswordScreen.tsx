import React from 'react';
import {Text, View, YStack} from 'tamagui';
import {BaseScreenWrapper} from '@/shared/components/layout';
import {LogoMediumDark} from '@/shared/components/ui/Background/Logo';
import {ForgotPasswordForm} from '@/features/auth/components/ForgotPasswordForm';
import {useForgotPassword} from '@/features/auth/hooks/useForgotPassword';
import {useBaseAlert} from '@/shared/components/feedback/Alert/BaseAlertProvider';
import {HapticButton} from '@/shared/components';
import {router} from 'expo-router';
import {useGradient} from '@/shared/components/ui/GradientBox/GradientBox';
import {LinearGradient} from 'expo-linear-gradient';

export const ForgotPasswordScreen = () => {
  const {
    email,
    updateEmail,
    submit,
    canSubmit,
    isLoading,
    clearError,
  } = useForgotPassword();
  const alert = useBaseAlert();
  const heroGradient = useGradient('medium');

  const handleSubmitClick = async () => {
    const result = await submit();

    if (result.success) {
      alert.showSuccess('Email Enviado', result.message);
      router.push('/(auth)/forgot-password-sent')
    } else {
      alert.showError('Erro', result.message);
    }
  };

  return (
    <BaseScreenWrapper>
      <LinearGradient colors={heroGradient} style={{flex: 1}}>
        <View flex={1} justifyContent="center">
          <YStack padding="$2">
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
              <YStack alignItems="center" marginBottom="$4">
                <LogoMediumDark/>
              </YStack>

              <YStack gap="$2" marginBottom="$6" alignItems="center">
                <Text fontSize="$6" fontWeight="600" color="$absoluteTextPrimary" textAlign="center">
                  Recuperar senha
                </Text>
                <Text fontSize="$3" fontWeight="400" color="$absoluteTextSecondary" textAlign="center">
                  Digite seu email para receber um link de recuperação de senha.
                </Text>
              </YStack>

              <YStack gap="$4">
                <ForgotPasswordForm
                  email={email}
                  onEmailChange={(text) => {
                    updateEmail(text);
                    clearError();
                  }}
                  onBlurEmail={() => {}}
                  canSubmit={canSubmit}
                  isLoading={isLoading}
                  onSubmit={handleSubmitClick}
                />

                <HapticButton
                  onPress={() => router.back()}
                  hapticType="light"
                  backgroundColor="transparent"
                  borderColor="$absolutePrimary"
                  borderWidth={2}
                  color="$absolutePrimary"
                >
                  Voltar
                </HapticButton>
              </YStack>
            </YStack>
          </YStack>
        </View>
      </LinearGradient>
    </BaseScreenWrapper>
  );
};
