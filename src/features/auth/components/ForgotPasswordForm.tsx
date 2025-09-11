import React from 'react';
import {YStack} from 'tamagui';
import {CircleCheck, Mail} from '@tamagui/lucide-icons';
import {LabelInput} from '@/shared/components/ui/Input/FormInput';
import {LoadingButton} from '@/shared/components';
import {COLORS} from '@/shared/constants/colors';

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
                                     canSubmit,
                                     isLoading,
                                     onSubmit
                                   }: Props) {
  return (
    <YStack gap="$2">
      <LabelInput
        label="Email"
        placeholder="exemplo@gmail.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        spellCheck={false}
        textContentType="emailAddress"
        autoComplete="email"
        value={email}
        onChangeText={onEmailChange}
        onBlur={onBlurEmail}
        backgroundColor="$baseBackground"
        labelColor="$darkBlue"
        borderWidth={1}
        borderRadius="$4"
        leftIcon={<Mail size={20} color="$mediumBlue"/>}
        showSuccessIcon
        rightIcon={<CircleCheck size={25} color="$baseBackground" fill={COLORS.DARK}/>}
      />

      <YStack marginTop="$4">
        <LoadingButton
          loading={isLoading}
          loadingText="Enviando..."
          onPress={onSubmit}
          backgroundColor="$darkBlue"
          color="$white"
          borderRadius="$10"
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
