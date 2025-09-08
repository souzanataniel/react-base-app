import React from 'react';
import {Text, View, XStack, YStack} from 'tamagui';
import {CircleCheck, LockKeyhole, Mail} from '@tamagui/lucide-icons';
import {CheckboxLabel, LoadingButton} from 'src/shared/components';
import {useLoginForm} from '@/features/auth/hooks/useLoginForm';
import {BaseScreenWrapper} from '@/shared/components/layout';
import {LabelInput} from '@/shared/components/ui/Input/FormInput';
import {LabelPasswordInput} from '@/shared/components/ui/Input/FormPasswordInput';
import {Link} from 'expo-router';
import {AuthHeader} from '@/features/auth';

export const LoginScreen = () => {

  const {
    formData,
    errors,
    loading,
    updateField,
    validateField,
    handleLogin,
    canSubmit,
  } = useLoginForm();

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
                value={formData.email}
                onChangeText={(text) => updateField('email', text)}
                onBlur={() => validateField('email')}
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
              />
              {errors.email && (
                <Text fontSize="$3" color="$red10" paddingLeft="$2">
                  {errors.email}
                </Text>
              )}
            </YStack>
            <YStack gap="$2">

              <LabelPasswordInput
                label="Senha"
                placeholder="Digite sua senha"
                value={formData.password}
                onChangeText={(text) => updateField('password', text)}
                onBlur={() => validateField('password')}
                backgroundColor="$white"
                leftIcon={<LockKeyhole size={20} color="$oceanDark"/>}
                borderWidth={0}
              />
              {errors.password && (
                <Text fontSize="$3" color="$red10" paddingLeft="$2">
                  {errors.password}
                </Text>
              )}
            </YStack>
          </YStack>

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
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) => updateField('rememberMe', !!checked)}
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
              loading={loading}
              loadingText="Realizando Login..."
              onPress={handleLogin}

            >
              Entrar
            </LoadingButton>
          </YStack>

          {/* Spacer para empurrar conteúdo para baixo */}
          <View flex={1}/>

          {/* Rodapé - Link de cadastro */}
          <Link href="/(auth)/register" replace asChild>
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
