import React from 'react';
import {Text, View, XStack, YStack} from 'tamagui';
import {BackButton} from 'src/shared/components';
import {BaseScreenWrapper} from '@/shared/components/layout';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Logo} from '@/shared/components/ui/Background/Logo';
import {ForgotPasswordForm} from '@/features/auth/components/ForgotPasswordForm';

export const ForgotPasswordScreen = () => {
  const [email, setEmail] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isEmailTouched, setIsEmailTouched] = React.useState(false);
  const insets = useSafeAreaInsets();

  const canSubmit = email.length > 0 && email.includes('@');

  const onSubmit = async () => {
    if (!canSubmit) return;

    setIsLoading(true);
    try {
      // Aqui você implementa a lógica de recuperação de senha
      console.log('Enviando email de recuperação para:', email);

      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Navegar para tela de confirmação ou mostrar toast
      // router.push('/(auth)/forgot-password-sent');

    } catch (error) {
      console.error('Erro ao enviar email de recuperação:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
  };

  const handleEmailBlur = () => {
    setIsEmailTouched(true);
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
            <Logo variant="medium"/>
          </YStack>

          {/* Form Section */}
          <YStack flex={0.6} padding="$3" paddingTop="$10">
            <YStack
              backgroundColor="$white"
              borderRadius="$6"
              padding="$5"
              marginHorizontal="$2"
              elevation={1}
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
                onEmailChange={handleEmailChange}
                onBlurEmail={handleEmailBlur}
                canSubmit={canSubmit}
                isLoading={isLoading}
                onSubmit={onSubmit}
              />
            </YStack>
          </YStack>
        </YStack>
      </View>
    </BaseScreenWrapper>
  );
}
