import React, {useState} from 'react';
import {Progress, Text, XStack, YStack} from 'tamagui';
import {CircleCheck, LockKeyhole, Mail, Phone, User} from '@tamagui/lucide-icons';
import {LabelInput} from '@/shared/components/ui/Input/FormInput';
import {LabelPasswordInput} from '@/shared/components/ui/Input/FormPasswordInput';
import {CheckboxLabel, HapticButton, LoadingButton} from '@/shared/components';
import {PhoneInput} from '@/shared/components/ui/Input/BasePhoneInput';
import {FormStepper} from '@/shared/components/layout/FormStepper';

type StepperSignUpFormProps = {
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

export function SignUpForm(props: StepperSignUpFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;

  const {
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
    passwordStrength,
  } = props;

  const strengthConfig = {
    weak: {color: '$error', progress: 33, text: 'Fraca'},
    medium: {color: '$warning', progress: 66, text: 'Média'},
    strong: {color: '$success', progress: 100, text: 'Forte'},
  };

  const currentStrength = strengthConfig[passwordStrength];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <YStack gap="$2" animation="quick" enterStyle={{opacity: 0, x: 20}} exitStyle={{opacity: 0, x: -20}}>
            <LabelInput
              label="Nome"
              placeholder="Seu nome"
              value={firstName}
              onChangeText={onFirstNameChange}
              onBlur={onBlurFirstName}
              leftIcon={<User size={20} color="$defaultSecondaryLabel"/>}
              autoCapitalize="words"
              showSuccessIcon
              rightIcon={<CircleCheck size={25} color="$defaultPrimary"/>}
            />

            <LabelInput
              label="Sobrenome"
              placeholder="Seu sobrenome"
              value={lastName}
              onChangeText={onLastNameChange}
              onBlur={onBlurLastName}
              leftIcon={<User size={20} color="$defaultSecondaryLabel"/>}
              autoCapitalize="words"
              showSuccessIcon={true}
              rightIcon={<CircleCheck size={25} color="$defaultPrimary"/>}
            />

            <PhoneInput
              label="Celular"
              leftIcon={<Phone size={20} color="$defaultSecondaryLabel"/>}
              showSuccessIcon={true}
              successIcon={<CircleCheck size={25} color="$defaultPrimary" />}
              onChangeText={onPhoneChange}
              onBlur={onBlurPhone}
              value={phone}
            />
          </YStack>
        );

      case 2:
        return (
          <YStack gap="$2" animation="quick" enterStyle={{opacity: 0, x: 20}} exitStyle={{opacity: 0, x: -20}}>
            <LabelInput
              label="Email"
              placeholder="exemplo@gmail.com"
              keyboardType="email-address"
              value={email}
              onChangeText={onEmailChange}
              onBlur={onBlurEmail}
              leftIcon={<Mail size={20} color="$defaultSecondaryLabel"/>}
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
              textContentType="emailAddress"
              autoComplete="email"
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
            />

            {password.length > 0 && (
              <YStack gap="$2" paddingHorizontal="$2" marginTop="$1">
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

            <XStack alignItems="center" padding="$2">
              <CheckboxLabel
                size="$4"
                checked={acceptTerms}
                onCheckedChange={(checked) => onAcceptTermsChange(!!checked)}
                label="Aceito os termos e condições de uso."
              />
            </XStack>

            <LoadingButton
              marginTop="$2"
              loading={isLoading}
              loadingText="Criando conta..."
              onPress={onSubmit}
              disabled={isLoading}
              height={52}
              fontSize="$4"
              fontWeight="600"
              hapticType="medium"
            >
              Cadastrar
            </LoadingButton>
          </YStack>
        );
      default:
        return null;
    }
  };

  return (
    <YStack gap="$4">
      <FormStepper
        currentStep={currentStep}
        totalSteps={totalSteps}
      />

      <YStack justifyContent="flex-start">
        {renderStepContent()}
      </YStack>

      <YStack gap="$4">
        {currentStep < totalSteps && (
          <HapticButton
            onPress={handleNext}
            hapticType="light"
          >
            Próximo
          </HapticButton>
        )}

        {currentStep > 1 && (
          <HapticButton
            onPress={handlePrevious}
            hapticType="light"
            backgroundColor="transparent"
            borderColor="$defaultPrimary"
            borderWidth={2}
            color="$defaultPrimary"
          >
            Voltar
          </HapticButton>
        )}
      </YStack>
    </YStack>
  );
}
