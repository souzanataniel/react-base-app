import React from 'react';
import {YStack} from 'tamagui';
import {CircleCheck, Mail} from '@tamagui/lucide-icons';
import {LoadingButton} from '@/shared/components';
import {EmailInput} from '@/shared/components/ui/Input/EmailInput';

type Props = {
  email: string;
  onEmailChange: (v: string) => void;
  onBlurEmail: () => void;
  canSubmit: boolean;
  isLoading: boolean;
  onSubmit: () => void;
};

export function ForgotPasswordForm({
                                     email,
                                     onEmailChange,
                                     onBlurEmail,
                                     isLoading,
                                     onSubmit
                                   }: Props) {
  return (
    <YStack gap="$2">
      <EmailInput
        label="Email"
        value={email}
        onChangeText={onEmailChange}
        onBlur={onBlurEmail}
        leftIcon={<Mail size={20} color="$defaultSecondaryLabel"/>}
        showSuccessIcon
        successIcon={<CircleCheck size={25} color="$defaultPrimary"/>}
      />

      <YStack marginTop="$4">
        <LoadingButton
          loading={isLoading}
          loadingText="Enviando..."
          onPress={onSubmit}
          height={52}
          fontSize="$4"
          fontWeight="600"
          hapticType="medium"
        >
          Recuperar Senha
        </LoadingButton>
      </YStack>
    </YStack>
  );
}
