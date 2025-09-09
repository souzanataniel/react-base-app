import React from 'react';
import {Text, View, XStack, YStack} from 'tamagui';
import {CircleCheck, LockKeyhole, Mail} from '@tamagui/lucide-icons';
import {CheckboxLabel, LoadingButton} from 'src/shared/components';
import {BaseScreenWrapper} from '@/shared/components/layout';
import {LabelInput} from '@/shared/components/ui/Input/FormInput';
import {LabelPasswordInput} from '@/shared/components/ui/Input/FormPasswordInput';
import {Link} from 'expo-router';
import {useSignIn} from '@/features/auth/hooks/useSignIn';
import {AuthHeader} from '@/features/auth/components/AuthHeader';

export const SignInScreen = () => {
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
  } = useSignIn();

  const [rememberMe, setRememberMe] = React.useState(false);

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

  return (
    <BaseScreenWrapper>
      <YStack flex={1}>
        <AuthHeader
          title="Bem Vindo !"
          subtitle="Preencha os dados abaixo para realizar seu login."
        />

        <YStack flex={1} padding="$5">
          {/* Inputs */}
          <YStack gap="$4" paddingTop="$8">
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
                // Passa validação customizada se necessário
                validationFn={(email) => !hasFieldError('email') && email.includes('@')}
              />
              {hasFieldError('email') && (
                <Text fontSize="$3" color="$red10" paddingLeft="$2">
                  {getFieldError('email')}
                </Text>
              )}
            </YStack>

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
              {hasFieldError('password') && (
                <Text fontSize="$3" color="$red10" paddingLeft="$2">
                  {getFieldError('password')}
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

          {/* Área de ações */}
          <YStack gap="$4" marginTop="$4">
            <XStack
              justifyContent="space-between"
              alignItems="center"
              paddingHorizontal="$2"
              minHeight={50}
            >
              <XStack alignItems="center" gap="$2" flex={1}>
                <CheckboxLabel
                  size="$4"
                  label="Lembrar-me"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(!!checked)}
                />
              </XStack>

              <Text
                fontSize="$3"
                color="$oceanDark"
                textDecorationLine="underline"
                fontWeight="500"
                lineHeight={20}
                pressStyle={{opacity: 0.7, scale: 0.98}}
              >
                Esqueceu sua senha?
              </Text>
            </XStack>

            <LoadingButton
              loading={isLoading}
              loadingText="Realizando Login..."
              onPress={onSubmit}
              disabled={!canSubmit}
            >
              Entrar
            </LoadingButton>
          </YStack>

          {/* Spacer para empurrar conteúdo para baixo */}
          <View flex={1}/>

          {/* Rodapé - Link de cadastro */}
          <Link href="/(auth)/sign-up" replace asChild>
            <YStack alignItems="center" paddingBottom="$4" pressStyle={{opacity: 0.7, scale: 0.98}}>
              <Text
                fontSize="$4"
                color="$oceanDark"
                fontWeight="400"
                textAlign="center"
              >
                Não possui conta?{' '}
                <Text
                  fontWeight="600"
                  textDecorationLine="underline"
                >
                  Cadastre-se
                </Text>
              </Text>
            </YStack>
          </Link>
        </YStack>
      </YStack>
    </BaseScreenWrapper>
  );
}
