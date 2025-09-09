import React from 'react';
import {Text, View, XStack, YStack} from 'tamagui';
import {CircleCheck, LockKeyhole, Mail} from '@tamagui/lucide-icons';
import {BackButtonInline, CheckboxLabel, LoadingButton} from 'src/shared/components';
import {BaseScreenWrapper} from '@/shared/components/layout';
import {LabelInput} from '@/shared/components/ui/Input/FormInput';
import {LabelPasswordInput} from '@/shared/components/ui/Input/FormPasswordInput';
import {Link} from 'expo-router';
import {useSignIn} from '@/features/auth/hooks/useSignIn';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {COLORS} from '@/shared/constants/colors';
import {Logo} from '@/shared/components/ui/Background/Logo';

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
        </XStack>

        <YStack flex={1}>
          {/* Logo Section */}
          <YStack alignItems="center" justifyContent="center">
            <Logo tintColor={COLORS.LIGHTEST} size={100}/>
          </YStack>

          {/* Form Section */}
          <YStack flex={0.6} padding="$5" paddingTop="$4">
            {/* Sign In Title */}
            <YStack gap="$1" marginBottom="$6">
              <Text
                fontSize="$6"
                fontWeight="600"
                color="$dark"
              >
                Entrar
              </Text>
              <Text
                fontSize="$3"
                fontWeight="400"
                color="$medium"
              >
                Insira seus dados para continuar
              </Text>
            </YStack>

            {/* Inputs */}
            <YStack gap="$2">
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
                showSuccessIcon
                rightIcon={
                  <CircleCheck
                    size={20}
                    color="$dark"
                  />
                }
              />

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
            </YStack>

            {/* Remember Me e Forgot Password */}
            <XStack
              justifyContent="space-between"
              alignItems="center"
              paddingHorizontal="$2"
              marginTop="$2"
              minHeight={40}
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
                color="$medium"
                textDecorationLine="underline"
                fontWeight="500"
                pressStyle={{opacity: 0.7}}
              >
                Esqueceu sua senha?
              </Text>
            </XStack>

            {/* Sign In Button */}
            <YStack marginTop="$6">
              <LoadingButton
                loading={isLoading}
                loadingText="Entrando..."
                onPress={onSubmit}
                disabled={!canSubmit}
                backgroundColor="$dark"
                color="$white"
                borderRadius="$10"
                height={52}
                fontSize="$4"
                fontWeight="600"
              >
                Entrar
              </LoadingButton>
            </YStack>

            {/* Spacer */}
            <View flex={1}/>

            {/* Footer - Sign up link */}
            <Link href="/(auth)/sign-up" replace asChild>
              <YStack alignItems="center" paddingTop="$4" pressStyle={{opacity: 0.7}}>
                <Text
                  fontSize="$4"
                  color="$light"
                  fontWeight="400"
                  textAlign="center"
                >
                  Não possui conta?{' '}
                  <Text
                    fontWeight="600"
                    textDecorationLine="underline"
                    color="$dark"
                  >
                    Cadastre-se
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
