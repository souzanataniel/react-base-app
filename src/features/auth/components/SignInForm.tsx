import React from 'react';
import {Text, XStack, YStack} from 'tamagui';
import {CircleCheck, LockKeyhole, Mail} from '@tamagui/lucide-icons';
import {LabelInput} from '@/shared/components/ui/Input/FormInput';
import {LabelPasswordInput} from '@/shared/components/ui/Input/FormPasswordInput';
import {LoadingButton} from '@/shared/components';
import {Link} from 'expo-router';
import {COLORS} from '@/shared/constants/colors';

type Props = {
  email: string;
  password: string;
  onEmailChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onBlurEmail: () => void;
  onBlurPassword: () => void;
  canSubmit: boolean;
  isLoading: boolean;
  onSubmit: () => void;
};

export function SignInForm({
                             email, password,
                             onEmailChange, onPasswordChange,
                             onBlurEmail, onBlurPassword,
                             canSubmit, isLoading, onSubmit,
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
        leftIcon={<Mail size={20} color="$defaultSecondaryLabel"/>}
        showSuccessIcon
        rightIcon={<CircleCheck size={25} color="$defaultPrimary"/>}
      />

      <LabelPasswordInput
        label="Senha"
        placeholder="••••••••"
        value={password}
        onChangeText={onPasswordChange}
        onBlur={onBlurPassword}
        leftIcon={<LockKeyhole size={20} color="$defaultSecondaryLabel"/>}
        borderWidth={1}
        borderRadius="$4"
      />

      <XStack
        justifyContent="flex-end"
        alignItems="center"
        paddingHorizontal="$2"
        minHeight={40}
        pressStyle={{opacity: 0.7}}
      >
        <Link href="/(auth)/forgot-password" asChild>
          <Text
            fontSize="$3"
            color="$defaultSecondaryLabel"
            textDecorationLine="underline"
            fontWeight="500"
          >
            Esqueceu sua senha?
          </Text>
        </Link>
      </XStack>

      <LoadingButton
        loading={isLoading}
        loadingText="Entrando..."
        onPress={onSubmit}
        disabled={!canSubmit}
        color="$defaultWhite"
        height={52}
        fontSize="$4"
        fontWeight="600"
        hapticType="medium"
      >
        Entrar
      </LoadingButton>
    </YStack>
  );
}
