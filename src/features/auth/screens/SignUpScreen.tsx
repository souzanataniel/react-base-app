import React from 'react';
import {Text, View, XStack, YStack} from 'tamagui';
import {BackButton} from 'src/shared/components';
import {BaseScreenWrapper} from '@/shared/components/layout';
import {Link} from 'expo-router';
import {useSignUp} from '@/features/auth/hooks/useSignUp';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {SignUpForm} from '@/features/auth/components/SignUpForm';
import {Logo} from '@/shared/components/ui/Background/Logo';

export const SignUpScreen = () => {
  const {
    credentials,
    updateField,
    markFieldAsTouched,
    handleSubmit,
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
          <BackButton/>
          <Logo variant="small"/>
        </XStack>

        <YStack flex={1}>
          <YStack flex={1} padding="$3" paddingBottom="$2">
            <YStack
              gap="$4"
              backgroundColor="$white"
              borderRadius="$6"
              padding="$5"
              marginHorizontal="$2"
              shadowColor="$shadowColor"
              shadowOffset={{width: 0, height: 2}}
              shadowOpacity={0.1}
              shadowRadius={8}
              elevation={3}
            >
              <YStack gap="$2">
                <Text
                  fontSize="$6"
                  fontWeight="600"
                  color="$darkBlue"
                >
                  Cadastrar
                </Text>
                <Text
                  fontSize="$3"
                  fontWeight="400"
                  color="$mediumBlue"
                >
                  Preencha os dados para criar sua conta
                </Text>
              </YStack>

              <SignUpForm
                firstName={credentials.firstName}
                lastName={credentials.lastName}
                email={credentials.email}
                password={credentials.password}
                acceptedTerms={acceptedTerms}
                setAcceptedTerms={setAcceptedTerms}
                onFirstNameChange={handleFirstNameChange}
                onLastNameChange={handleLastNameChange}
                onEmailChange={handleEmailChange}
                onPasswordChange={handlePasswordChange}
                onBlurFirstName={() => markFieldAsTouched('firstName')}
                onBlurLastName={() => markFieldAsTouched('lastName')}
                onBlurEmail={() => markFieldAsTouched('email')}
                onBlurPassword={() => markFieldAsTouched('password')}
                canSubmit={canSubmit}
                isLoading={isLoading}
                onSubmit={onSubmit}
                error={error}
                passwordStrength={passwordStrength}
              />

              <YStack alignItems="center" gap="$3">
                <XStack alignItems="center" width="100%" paddingHorizontal="$4">
                  <View flex={1} height={1} backgroundColor="$borderColor"/>
                  <Text
                    fontSize="$3"
                    color="$mediumBlue"
                    paddingHorizontal="$3"
                    fontWeight="400"
                  >
                    ou
                  </Text>
                  <View flex={1} height={1} backgroundColor="$borderColor"/>
                </XStack>

                <Link href="/(auth)/sign-in" replace asChild>
                  <YStack alignItems="center" pressStyle={{opacity: 0.7}}>
                    <Text
                      fontSize="$3"
                      color="$mediumBlue"
                      fontWeight="400"
                      textAlign="center"
                    >
                      Já possui conta?{' '}
                      <Text
                        fontWeight="600"
                        textDecorationLine="underline"
                        color="$darkBlue"
                      >
                        Fazer login
                      </Text>
                    </Text>
                  </YStack>
                </Link>
              </YStack>
            </YStack>
          </YStack>
        </YStack>
      </View>
    </BaseScreenWrapper>
  );
}
