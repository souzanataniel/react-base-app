import React from 'react';
import {Text, View, XStack, YStack} from 'tamagui';
import {BaseScreenWrapper} from '@/shared/components/layout';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Logo} from '@/shared/components/ui/Background/Logo';
import {LoadingButton} from '@/shared/components';
import {Link} from 'expo-router';
import {CheckCircle, Clock, Mail} from '@tamagui/lucide-icons';

interface Props {
  email?: string;
}

export const ForgotPasswordSentScreen = ({email = 'seu email !'}: Props) => {
  const insets = useSafeAreaInsets();
  const [countdown, setCountdown] = React.useState(60);
  const [canResend, setCanResend] = React.useState(false);

  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleResend = () => {
    setCountdown(60);
    setCanResend(false);
    // Implementar lógica de reenvio
    console.log('Reenviando email para:', email);
  };

  return (
    <BaseScreenWrapper>
      <View>
        <YStack flex={1}>
          {/* Logo Section */}
          <YStack alignItems="center" justifyContent="center" paddingTop={insets.top + 40}>
            <Logo variant="medium"/>
          </YStack>

          {/* Main Content */}
          <YStack flex={1} justifyContent="flex-start" paddingTop="$8" padding="$3">
            <YStack
              backgroundColor="$white"
              borderRadius="$6"
              padding="$6"
              marginHorizontal="$2"
              elevation={1}
              alignItems="center"
            >

              {/* Success Icon */}
              <YStack
                backgroundColor="$baseBackgroundHover"
                borderRadius="$12"
                padding="$4"
                alignItems="center"
                justifyContent="center"
                marginBottom="$5"
              >
                <CheckCircle
                  size={48}
                  color="$success"
                  strokeWidth={2}
                />
              </YStack>

              {/* Title */}
              <Text
                fontSize="$6"
                fontWeight="600"
                color="$darkBlue"
                textAlign="center"
                marginBottom="$3"
              >
                Email Enviado!
              </Text>

              {/* Description */}
              <Text
                fontSize="$4"
                fontWeight="400"
                color="$mediumBlue"
                textAlign="center"
                lineHeight="$3"
                marginBottom="$5"
                maxWidth="280px"
              >
                Enviamos um link de recuperação de senha para{' '}
                <Text fontWeight="600" color="$darkBlue">
                  {email}
                </Text>
              </Text>

              {/* Email Icon Info */}
              <XStack
                backgroundColor="$backgroundHover"
                borderRadius="$4"
                padding="$3"
                alignItems="center"
                gap="$2"
                marginBottom="$5"
                width="100%"
              >
                <Mail size={20} color="$color"/>
                <Text fontSize="$3" color="$color" flex={1}>
                  Verifique sua caixa de entrada e spam
                </Text>
              </XStack>

              {/* Countdown/Resend Section */}
              <YStack alignItems="center" gap="$3" width="100%">
                {!canResend ? (
                  <XStack alignItems="center" gap="$2">
                    <Clock size={16} color="$light"/>
                    <Text fontSize="$3" color="$light">
                      Reenviar em {countdown}s
                    </Text>
                  </XStack>
                ) : (
                  <LoadingButton
                    onPress={handleResend}
                    backgroundColor="transparent"
                    borderColor="$mediumBlue"
                    borderWidth={1}
                    color="$mediumBlue"
                    borderRadius="$4"
                    height={44}
                    fontSize="$3"
                    fontWeight="500"
                    width="100%"
                    pressStyle={{
                      backgroundColor: '$background',
                      scale: 0.98,
                    }}
                  >
                    Reenviar email
                  </LoadingButton>
                )}
              </YStack>

              {/* Primary Action */}
              <YStack width="100%" gap="$3">
                <Link href="/(auth)/sign-in" replace asChild>
                  <LoadingButton
                    backgroundColor="$darkBlue"
                    color="$white"
                    borderRadius="$10"
                    height={52}
                    fontSize="$4"
                    fontWeight="600"
                  >
                    Ir para Login
                  </LoadingButton>
                </Link>
              </YStack>
            </YStack>
          </YStack>
        </YStack>
      </View>
    </BaseScreenWrapper>
  );
}
