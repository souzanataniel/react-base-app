import React from 'react';
import {Text, View, YStack} from 'tamagui';
import {BaseScreenWrapper} from '@/shared/components/layout';
import {LogoMediumDark} from '@/shared/components/ui/Background/Logo';
import {ForgotPasswordForm} from '@/features/auth/components/ForgotPasswordForm';
import {useForgotPassword} from '@/features/auth/hooks/useForgotPassword';
import {HapticButton} from '@/shared/components';
import {router} from 'expo-router';
import {useGlobalAlert} from '@/shared/components/feedback/BaseAlert/BaseAlert';

export const ForgotPasswordScreen = () => {
  const {
    email,
    updateEmail,
    submit,
    canSubmit,
    isLoading,
    clearError,
  } = useForgotPassword();
  const {showError, showSuccess} = useGlobalAlert();

  const handleSubmitClick = async () => {
    const result = await submit();

    if (result.success) {
      showSuccess('Email Enviado', result.message);
      router.push('/(auth)/forgot-password-sent')
    } else {
      showError('Erro', result.message);
    }
  };

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
            shadowOffset={{width: 0, height: 1}}
            shadowRadius={3}
          >
            <YStack alignItems="center" marginBottom="$4">
              <LogoMediumDark/>
            </YStack>

            <YStack gap="$2" marginBottom="$6" alignItems="center">
              <Text fontSize="$6" fontWeight="600" color="$defaultLabel" textAlign="center">
                Recuperar senha
              </Text>
              <Text fontSize="$3" fontWeight="400" color="$defaultLabel" textAlign="center">
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
                onPress={() => router.push('/(auth)/forgot-password-sent')}
                hapticType="light"
                backgroundColor="transparent"
                borderColor="$defaultPrimary"
                borderWidth={2}
                color="$defaultPrimary"
              >
                Voltar
              </HapticButton>
            </YStack>
          </YStack>
        </YStack>
      </View>
    </BaseScreenWrapper>
  );
};
