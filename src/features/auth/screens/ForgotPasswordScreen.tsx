import React from 'react';
import {Text, View, XStack, YStack} from 'tamagui';
import {BackButton} from 'src/shared/components';
import {BaseScreenWrapper} from '@/shared/components/layout';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {LogoMedium} from '@/shared/components/ui/Background/Logo';
import {ForgotPasswordForm} from '@/features/auth/components/ForgotPasswordForm';
import {useForgotPassword} from '@/features/auth/hooks/useForgotPassword';
import {useBaseAlert} from '@/shared/components/feedback/Alert/BaseAlertProvider';

export const ForgotPasswordScreen = () => {
  const {
    email,
    updateEmail,
    submit,
    canSubmit,
    isLoading,
    clearError,
  } = useForgotPassword();

  const insets = useSafeAreaInsets();
  const alert = useBaseAlert();

  const handleSubmitClick = async () => {
    const result = await submit();

    if (result.success) {
      alert.showSuccess('Email Enviado', result.message);
    } else {
      alert.showError('Erro', result.message);
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
          {/* Logo Section */}
          <YStack alignItems="center" justifyContent="center">
            <LogoMedium/>
          </YStack>

          {/* Form Section */}
          <YStack flex={0.6} padding="$3" paddingTop="$10">
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
                <Text
                  fontSize="$6"
                  fontWeight="600"
                  color="$darkBlue"
                >
                  Recuperar senha
                </Text>
                <Text
                  fontSize="$3"
                  fontWeight="400"
                  color="$mediumBlue"
                  lineHeight="$4"
                >
                  Digite seu email para receber um link de recuperação de senha.
                </Text>
              </YStack>

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
            </YStack>
          </YStack>
        </YStack>
      </View>
    </BaseScreenWrapper>
  );
};
