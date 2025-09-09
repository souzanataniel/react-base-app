import React from 'react';
import {Progress, Text, View, XStack, YStack} from 'tamagui';
import {LockKeyhole, Mail, User} from '@tamagui/lucide-icons';
import {BackButtonInline, CheckboxLabel, LoadingButton} from 'src/shared/components';
import {BaseScreenWrapper} from '@/shared/components/layout';
import {LabelInput} from '@/shared/components/ui/Input/FormInput';
import {LabelPasswordInput} from '@/shared/components/ui/Input/FormPasswordInput';
import {Link} from 'expo-router';
import {useSignUp} from '@/features/auth/hooks/useSignUp';
import {LogoFloating} from '@/shared/components/ui/Background/LogoFloating';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {COLORS} from '@/shared/constants/colors';

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

  const [acceptedTerms, setAcceptedTerms] = React.useState(false);
  const insets = useSafeAreaInsets();

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
    weak: {color: '$error', progress: 33, text: 'Fraca'},
    medium: {color: '$warning', progress: 66, text: 'Média'},
    strong: {color: '$success', progress: 100, text: 'Forte'},
  };
  const currentStrength = strengthConfig[passwordStrength];

  // Verifica se pode submeter (incluindo aceitar termos)
  const canSubmitForm = canSubmit && acceptedTerms;

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
          <BackButtonInline buttonColor="$dark" iconColor="$white"/>
          <LogoFloating tintColor={COLORS.LIGHTEST}/>
        </XStack>

        <YStack flex={1}>

          {/* Form Section */}
          <YStack flex={0.7} padding="$5" paddingTop="$4">
            {/* Sign Up Title */}
            <YStack gap="$1" marginBottom="$6">
              <Text
                fontSize="$6"
                fontWeight="600"
                color="$dark"
              >
                Cadastrar
              </Text>
              <Text
                fontSize="$3"
                fontWeight="400"
                color="$medium"
              >
                Preencha os dados para criar sua conta
              </Text>
            </YStack>

            {/* Inputs */}
            <YStack gap="$2">
              {/* Nome */}
              <LabelInput
                label="Nome"
                placeholder="Seu nome"
                value={credentials.firstName}
                onChangeText={handleFirstNameChange}
                onBlur={() => markFieldAsTouched('firstName')}
                backgroundColor="$white"
                labelColor="$medium"
                borderWidth={0}
                borderRadius="$4"
                leftIcon={<User size={20} color="$medium"/>}
                autoCapitalize="words"
              />

              {/* Sobrenome */}
              <LabelInput
                label="Sobrenome"
                placeholder="Seu sobrenome"
                value={credentials.lastName}
                onChangeText={handleLastNameChange}
                onBlur={() => markFieldAsTouched('lastName')}
                backgroundColor="$white"
                labelColor="$medium"
                borderWidth={0}
                borderRadius="$4"
                leftIcon={<User size={20} color="$medium"/>}
                autoCapitalize="words"
              />

              {/* Email */}
              <LabelInput
                label="Email"
                placeholder="exemplo@gmail.com"
                keyboardType="email-address"
                value={credentials.email}
                onChangeText={handleEmailChange}
                onBlur={() => markFieldAsTouched('email')}
                backgroundColor="$white"
                labelColor="$medium"
                borderWidth={0}
                borderRadius="$4"
                leftIcon={<Mail size={20} color="$medium"/>}
              />

              {/* Senha */}
              <LabelPasswordInput
                label="Senha"
                placeholder="••••••••"
                value={credentials.password}
                onChangeText={handlePasswordChange}
                onBlur={() => markFieldAsTouched('password')}
                backgroundColor="$white"
                labelColor="$medium"
                leftIcon={<LockKeyhole size={20} color="$medium"/>}
                borderWidth={0}
                borderRadius="$4"
              />

              {/* Indicador de força da senha */}
              {credentials.password.length > 0 && (
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
            </YStack>

            {/* Termos de Consentimento */}
            <YStack marginTop="$4" paddingHorizontal="$2">
              <XStack alignItems="flex-start" gap="$2">
                <CheckboxLabel
                  size="$4"
                  checked={acceptedTerms}
                  onCheckedChange={(checked) => setAcceptedTerms(!!checked)}
                  label="Aceito os Termos de Uso"
                />
              </XStack>
            </YStack>

            {/* Erro geral */}
            {error && (
              <YStack paddingTop="$4">
                <Text fontSize="$3" color="$error" textAlign="center" paddingHorizontal="$2">
                  {error}
                </Text>
              </YStack>
            )}

            {/* Sign Up Button */}
            <YStack marginTop="$6">
              <LoadingButton
                loading={isLoading}
                loadingText="Criando conta..."
                onPress={onSubmit}
                disabled={!canSubmitForm}
                backgroundColor="$dark"
                color="$white"
                borderRadius="$4"
                height={52}
                fontSize="$4"
                fontWeight="600"
              >
                Cadastrar
              </LoadingButton>
            </YStack>

            {/* Spacer */}
            <View flex={1}/>

            {/* Footer - Sign in link */}
            <Link href="/(auth)/sign-in" replace asChild>
              <YStack alignItems="center" paddingTop="$4" pressStyle={{opacity: 0.7}}>
                <Text
                  fontSize="$4"
                  color="$light"
                  fontWeight="400"
                  textAlign="center"
                >
                  Já possui conta?{' '}
                  <Text
                    fontWeight="600"
                    textDecorationLine="underline"
                    color="$dark"
                  >
                    Fazer login
                  </Text>
                </Text>
              </YStack>
            </Link>
          </YStack>
        </YStack>
      </View>
    </BaseScreenWrapper>
  );
}
