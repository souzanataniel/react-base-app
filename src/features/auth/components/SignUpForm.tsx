import React from 'react';
import {Progress, Text, XStack, YStack} from 'tamagui';
import {CircleCheck, LockKeyhole, Mail, Phone, User} from '@tamagui/lucide-icons';
import {LabelInput} from '@/shared/components/ui/Input/FormInput';
import {LabelPasswordInput} from '@/shared/components/ui/Input/FormPasswordInput';
import {CheckboxLabel, LoadingButton} from '@/shared/components';
import {PhoneInput} from '@/shared/components/ui/Input/BasePhoneInput';
import {COLORS} from '@/shared/constants/colors';

type Props = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  acceptTerms: boolean;
  onFirstNameChange: (v: string) => void;
  onLastNameChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onPhoneChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onAcceptTermsChange: (v: boolean) => void;
  onBlurFirstName: () => void;
  onBlurLastName: () => void;
  onBlurEmail: () => void;
  onBlurPhone: () => void;
  onBlurPassword: () => void;
  canSubmit: boolean;
  isLoading: boolean;
  onSubmit: () => void;
  passwordStrength: 'weak' | 'medium' | 'strong';
};

export function SignUpForm({
                             firstName,
                             lastName,
                             email,
                             phone,
                             password,
                             acceptTerms,
                             onFirstNameChange,
                             onLastNameChange,
                             onEmailChange,
                             onPhoneChange,
                             onPasswordChange,
                             onAcceptTermsChange,
                             onBlurFirstName,
                             onBlurLastName,
                             onBlurEmail,
                             onBlurPhone,
                             onBlurPassword,
                             isLoading,
                             onSubmit,
                             passwordStrength
                           }: Props) {

  const strengthConfig = {
    weak: {color: '$error', progress: 33, text: 'Fraca'},
    medium: {color: '$warning', progress: 66, text: 'Média'},
    strong: {color: '$success', progress: 100, text: 'Forte'},
  };

  const currentStrength = strengthConfig[passwordStrength];

  return (
    <YStack gap="$2">
      <LabelInput
        label="Nome"
        placeholder="Seu nome"
        value={firstName}
        onChangeText={onFirstNameChange}
        onBlur={onBlurFirstName}
        backgroundColor="$baseBackground"
        labelColor="$darkBlue"
        borderWidth={1}
        borderRadius="$4"
        leftIcon={<User size={20} color="$mediumBlue"/>}
        autoCapitalize="words"
        showSuccessIcon
        rightIcon={<CircleCheck size={25} color="$baseBackground" fill={COLORS.DARK}/>}
      />

      <LabelInput
        label="Sobrenome"
        placeholder="Seu sobrenome"
        value={lastName}
        onChangeText={onLastNameChange}
        onBlur={onBlurLastName}
        backgroundColor="$baseBackground"
        labelColor="$darkBlue"
        borderWidth={1}
        borderRadius="$4"
        leftIcon={<User size={20} color="$mediumBlue"/>}
        autoCapitalize="words"
        showSuccessIcon
        rightIcon={<CircleCheck size={25} color="$baseBackground" fill={COLORS.DARK}/>}
      />

      <PhoneInput
        label="Celular"
        backgroundColor="$baseBackground"
        labelColor="$darkBlue"
        leftIcon={<Phone size={20} color="$mediumBlue"/>}
        showSuccessIcon={true}
        successIcon={<CircleCheck size={25} color="$baseBackground" fill={COLORS.DARK}/>}
        onChangeText={onPhoneChange}
        onBlur={onBlurPhone}
        value={phone}
      />

      <LabelInput
        label="Email"
        placeholder="exemplo@gmail.com"
        keyboardType="email-address"
        value={email}
        onChangeText={onEmailChange}
        onBlur={onBlurEmail}
        backgroundColor="$baseBackground"
        labelColor="$darkBlue"
        borderWidth={1}
        borderRadius="$4"
        leftIcon={<Mail size={20} color="$mediumBlue"/>}
        autoCapitalize="none"
        autoCorrect={false}
        spellCheck={false}
        textContentType="emailAddress"
        autoComplete="email"
        showSuccessIcon
        rightIcon={<CircleCheck size={25} color="$baseBackground" fill={COLORS.DARK}/>}
      />

      <LabelPasswordInput
        label="Senha"
        placeholder="••••••••"
        value={password}
        onChangeText={onPasswordChange}
        onBlur={onBlurPassword}
        backgroundColor="$baseBackground"
        labelColor="$darkBlue"
        leftIcon={<LockKeyhole size={20} color="$mediumBlue"/>}
        borderWidth={1}
        borderRadius="$4"
      />

      {password.length > 0 && (
        <YStack gap="$2" paddingHorizontal="$2" marginTop="$1" marginBottom="$2">
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize="$2" color="$light">Força da senha:</Text>
            <Text fontSize="$2" color={currentStrength.color} fontWeight="600">
              {currentStrength.text}
            </Text>
          </XStack>
          <Progress
            value={currentStrength.progress}
            backgroundColor="$lighter"
            height={4}
          >
            <Progress.Indicator
              backgroundColor={currentStrength.color}
              animation="bouncy"
            />
          </Progress>
        </YStack>
      )}

      <YStack marginTop="$4" paddingHorizontal="$2">
        <XStack alignItems="center" gap="$2">
          <CheckboxLabel
            size="$4"
            checked={acceptTerms}
            onCheckedChange={(checked) => onAcceptTermsChange(!!checked)}
            label="Aceito os Termos de Uso"
          />
        </XStack>
      </YStack>

      <YStack marginTop="$2">
        <LoadingButton
          loading={isLoading}
          loadingText="Criando conta..."
          onPress={onSubmit}
          disabled={isLoading}
          backgroundColor="$darkBlue"
          color="$white"
          borderRadius="$10"
          height={52}
          fontSize="$4"
          fontWeight="600"
          hapticType="medium"
        >
          Cadastrar
        </LoadingButton>
      </YStack>
    </YStack>
  );
}
