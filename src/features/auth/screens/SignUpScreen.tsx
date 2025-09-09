import {Progress, Text, View, XStack, YStack} from 'tamagui';
import React from 'react';
import {Link} from 'expo-router';
import {CircleCheck, LockKeyhole, Mail, User} from '@tamagui/lucide-icons';

import {LoadingButton} from '@/shared/components';
import {LabelInput} from '@/shared/components/ui/Input/FormInput';
import {LabelPasswordInput} from '@/shared/components/ui/Input/FormPasswordInput';
import {BaseScreenWrapper} from '@/shared/components/layout';
import {useSignUp} from '@/features/auth/hooks/useSignUp';
import {AuthHeader} from '@/features/auth/components/AuthHeader';

export const SignUpScreen = () => {
  const {
    credentials,
    updateField,
    markFieldAsTouched,
    handleSubmit,
    getFieldError,
    hasFieldError,
    canSubmit,
    isLoading,
    error,
    clearError,
    getPasswordStrength,
  } = useSignUp();

  const onSubmit = async () => {
    const result = await handleSubmit();
  };

  const handleEmailChange = (text: string) => {
    updateField('email', text);
    clearError();
  };

  const handlePasswordChange = (text: string) => {
    updateField('password', text);
    clearError();
  };

  const handleConfirmPasswordChange = (text: string) => {
    updateField('confirmPassword', text);
    clearError();
  };

  const handleFirstNameChange = (text: string) => {
    updateField('firstName', text);
    clearError();
  };

  const handleLastNameChange = (text: string) => {
    updateField('lastName', text);
    clearError();
  };

  // Configurações do indicador de força da senha
  const passwordStrength = getPasswordStrength();
  const strengthConfig = {
    weak: {color: '$red10', progress: 33, text: 'Fraca'},
    medium: {color: '$yellow10', progress: 66, text: 'Média'},
    strong: {color: '$green10', progress: 100, text: 'Forte'},
  };
  const currentStrength = strengthConfig[passwordStrength];

  return (
    <BaseScreenWrapper>
      <YStack flex={1}>
        <AuthHeader
          title="Cadastre-se !"
          subtitle="Preencha os dados abaixo para realizar seu cadastro."
        />

        <YStack flex={1} padding="$5">
          <YStack gap="$4" paddingTop="$8">
            {/* Nome */}
            <YStack gap="$2">
              <LabelInput
                label="Nome (opcional)"
                placeholder="Seu nome"
                value={credentials.firstName}
                onChangeText={handleFirstNameChange}
                onBlur={() => markFieldAsTouched('firstName')}
                backgroundColor="$white"
                labelColor="$oceanDark"
                borderWidth={0}
                leftIcon={<User size={20} color="$oceanDark"/>}
                autoCapitalize="words"
                showSuccessIcon
                successIcon={
                  <CircleCheck
                    size={30}
                    color="white"
                    fill="#1a2a35"
                  />
                }
                validationFn={(name) => !hasFieldError('firstName')}
              />
              {hasFieldError('firstName') && (
                <Text fontSize="$3" color="$red10" paddingLeft="$2">
                  {getFieldError('firstName')}
                </Text>
              )}
            </YStack>

            {/* Sobrenome */}
            <YStack gap="$2">
              <LabelInput
                label="Sobrenome (opcional)"
                placeholder="Seu sobrenome"
                value={credentials.lastName}
                onChangeText={handleLastNameChange}
                onBlur={() => markFieldAsTouched('lastName')}
                backgroundColor="$white"
                labelColor="$oceanDark"
                borderWidth={0}
                leftIcon={<User size={20} color="$oceanDark"/>}
                autoCapitalize="words"
                showSuccessIcon
                successIcon={
                  <CircleCheck
                    size={30}
                    color="white"
                    fill="#1a2a35"
                  />
                }
                validationFn={(name) => !hasFieldError('lastName')}
              />
              {hasFieldError('lastName') && (
                <Text fontSize="$3" color="$red10" paddingLeft="$2">
                  {getFieldError('lastName')}
                </Text>
              )}
            </YStack>

            {/* Email */}
            <YStack gap="$2">
              <LabelInput
                label="E-mail"
                placeholder="seu@email.com"
                keyboardType="email-address"
                value={credentials.email}
                onChangeText={handleEmailChange}
                onBlur={() => markFieldAsTouched('email')}
                backgroundColor="$white"
                labelColor="$oceanDark"
                borderWidth={0}
                leftIcon={<Mail size={20} color="$oceanDark"/>}
                showSuccessIcon
                successIcon={
                  <CircleCheck
                    size={30}
                    color="white"
                    fill="#1a2a35"
                  />
                }
                validationFn={(email) => !hasFieldError('email') && email.includes('@')}
              />
              {hasFieldError('email') && (
                <Text fontSize="$3" color="$red10" paddingLeft="$2">
                  {getFieldError('email')}
                </Text>
              )}
            </YStack>

            {/* Senha */}
            <YStack gap="$2">
              <LabelPasswordInput
                label="Senha"
                placeholder="Digite sua senha"
                value={credentials.password}
                onChangeText={handlePasswordChange}
                onBlur={() => markFieldAsTouched('password')}
                backgroundColor="$white"
                leftIcon={<LockKeyhole size={20} color="$oceanDark"/>}
                borderWidth={0}
              />

              {/* Indicador de força da senha */}
              {credentials.password.length > 0 && (
                <YStack gap="$2" paddingHorizontal="$2">
                  <XStack justifyContent="space-between" alignItems="center">
                    <Text fontSize="$2" color="$gray11">Força da senha:</Text>
                    <Text fontSize="$2" color={currentStrength.color} fontWeight="600">
                      {currentStrength.text}
                    </Text>
                  </XStack>
                  <Progress
                    value={currentStrength.progress}
                    backgroundColor="$gray5"
                    height={4}
                  >
                    <Progress.Indicator
                      backgroundColor={currentStrength.color}
                      animation="bouncy"
                    />
                  </Progress>
                </YStack>
              )}

              {hasFieldError('password') && (
                <Text fontSize="$3" color="$red10" paddingLeft="$2">
                  {getFieldError('password')}
                </Text>
              )}
            </YStack>

            {/* Confirmar Senha */}
            <YStack gap="$2">
              <LabelPasswordInput
                label="Confirmar Senha"
                placeholder="Confirme sua senha"
                value={credentials.confirmPassword}
                onChangeText={handleConfirmPasswordChange}
                onBlur={() => markFieldAsTouched('confirmPassword')}
                backgroundColor="$white"
                leftIcon={<LockKeyhole size={20} color="$oceanDark"/>}
                borderWidth={0}
              />
              {hasFieldError('confirmPassword') && (
                <Text fontSize="$3" color="$red10" paddingLeft="$2">
                  {getFieldError('confirmPassword')}
                </Text>
              )}
            </YStack>
          </YStack>

          {/* Erro geral */}
          {error && (
            <YStack paddingTop="$4">
              <Text fontSize="$3" color="$red10" textAlign="center" paddingHorizontal="$2">
                {error}
              </Text>
            </YStack>
          )}

          <YStack gap="$4" marginTop="$4">
            <LoadingButton
              loading={isLoading}
              loadingText="Criando conta..."
              onPress={onSubmit}
              disabled={!canSubmit}
            >
              Cadastrar
            </LoadingButton>
          </YStack>

          <View flex={1}/>

          <Link href="/(auth)/sign-in" replace asChild>
            <YStack alignItems="center" paddingBottom="$4" pressStyle={{opacity: 0.7, scale: 0.98}}>
              <Text
                fontSize="$4"
                color="$oceanDark"
                fontWeight="400"
                textAlign="center"
              >
                Já possui conta?{' '}
                <Text fontWeight="600" textDecorationLine="underline">
                  Faça o login
                </Text>
              </Text>
            </YStack>
          </Link>
        </YStack>
      </YStack>
    </BaseScreenWrapper>
  );
}
