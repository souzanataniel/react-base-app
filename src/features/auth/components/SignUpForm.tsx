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
  password: string;
  acceptedTerms: boolean;
  setAcceptedTerms: (v: boolean) => void;
  onFirstNameChange: (v: string) => void;
  onLastNameChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onBlurFirstName: () => void;
  onBlurLastName: () => void;
  onBlurEmail: () => void;
  onBlurPassword: () => void;
  canSubmit: boolean;
  isLoading: boolean;
  onSubmit: () => void;
  error?: string;
  passwordStrength: 'weak' | 'medium' | 'strong';
};

export function SignUpForm({
                             firstName, lastName, email, password,
                             acceptedTerms, setAcceptedTerms,
                             onFirstNameChange, onLastNameChange, onEmailChange, onPasswordChange,
                             onBlurFirstName, onBlurLastName, onBlurEmail, onBlurPassword,
                             canSubmit, isLoading, onSubmit, error, passwordStrength
                           }: Props) {

  const strengthConfig = {
    weak: {color: '$error', progress: 33, text: 'Fraca'},
    medium: {color: '$warning', progress: 66, text: 'Média'},
    strong: {color: '$success', progress: 100, text: 'Forte'},
  };

  const currentStrength = strengthConfig[passwordStrength];
  const canSubmitForm = canSubmit && acceptedTerms;

  return (
    <YStack gap="$2">
      {/* Nome */}
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
      />

      <PhoneInput
        label="Celular"
        backgroundColor="$baseBackground"
        labelColor="$darkBlue"
        leftIcon={<Phone size={20} color="$mediumBlue"/>}
        showSuccessIcon={true}
        successIcon={<CircleCheck size={25} color="$baseBackground" fill={COLORS.DARK}/>}
        onChangeText={(text) => console.log(text)}
      />

      {/* Email */}
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
        rightIcon={<CircleCheck size={25} color="$baseBackground" fill={COLORS.DARK}/>}
      />

      {/* Senha */}
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

      {/* Indicador de força da senha */}
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

      {/* Termos de Consentimento */}
      <YStack marginTop="$4" paddingHorizontal="$2">
        <XStack alignItems="center" gap="$2">
          <CheckboxLabel
            size="$4"
            checked={acceptedTerms}
            onCheckedChange={(checked) => setAcceptedTerms(!!checked)}
            label="Aceito os Termos de Uso"
          />
        </XStack>
      </YStack>

      {/* Sign Up Button */}
      <YStack marginTop="$0">
        <LoadingButton
          loading={isLoading}
          loadingText="Criando conta..."
          onPress={onSubmit}
          disabled={!canSubmitForm}
          backgroundColor="$darkBlue"
          color="$white"
          borderRadius="$10"
          height={52}
          fontSize="$4"
          fontWeight="600"
        >
          Cadastrar
        </LoadingButton>
      </YStack>
    </YStack>
  );
}
