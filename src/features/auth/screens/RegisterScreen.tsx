import {Text, View, YStack} from 'tamagui';
import React from 'react';
import {Link} from 'expo-router';
import {CircleCheck, LockKeyhole, Mail} from '@tamagui/lucide-icons';

import {LoadingButton} from '@/shared/components';
import {useLoginForm} from '@/features/auth/hooks/useLoginForm';
import {LabelInput} from '@/shared/components/ui/Input/FormInput';
import {LabelPasswordInput} from '@/shared/components/ui/Input/FormPasswordInput';
import {BaseScreenWrapper} from '@/shared/components/layout';
import {AuthHeader} from '@/features/auth';

export const RegisterScreen = () => {

  const {
    loading,
    handleLogin,
  } = useLoginForm();

  return (
    <BaseScreenWrapper>
      <YStack flex={1}>
        <AuthHeader
          title="Cadastre-se !"
          subtitle="Preencha os dados abaixo para realizar seu cadastro."
        />

        <YStack flex={1} padding="$5">

          <YStack gap="$4" paddingTop="$8">
            <LabelInput
              label="E-mail"
              placeholder="seu@email.com"
              keyboardType="email-address"
              backgroundColor="$white"
              labelColor="$oceanDark"
              borderWidth={0}
              leftIcon={<Mail size={20} color="$oceanDark"/>}
              validationFn={(email) => email.includes('@')}
              showSuccessIcon
              successIcon={
                <CircleCheck
                  size={30}
                  color="white"
                  fill="#1a2a35"
                />
              }/>

            <LabelPasswordInput
              label="Senha"
              placeholder="Digite sua senha"
              backgroundColor="$white"
              leftIcon={<LockKeyhole size={20} color="$oceanDark"/>}
              borderWidth={0}
            />
          </YStack>

          <YStack gap="$4" marginTop="$4">
            <LoadingButton
              loading={loading}
              loadingText="Realizando Login..."
              onPress={handleLogin}
            >
              Cadastrar
            </LoadingButton>
          </YStack>

          <View flex={1}/>

          <Link href="/(auth)/login" replace asChild>
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
