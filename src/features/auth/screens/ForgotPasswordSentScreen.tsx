import React from 'react';
import {Text, View, XStack, YStack} from 'tamagui';
import {BaseScreenWrapper} from '@/shared/components/layout';
import {HapticButton} from '@/shared/components';
import {router} from 'expo-router';
import {Mail} from '@tamagui/lucide-icons';
import {LogoSmallDark} from '@/shared/components/ui/Background/Logo';
import LottieView from 'lottie-react-native';
import {useGradient} from '@/shared/components/ui/GradientBox/GradientBox';
import {LinearGradient} from 'expo-linear-gradient';

interface Props {
  email?: string;
}

export const ForgotPasswordSentScreen = ({email = 'seu email !'}: Props) => {
  const heroGradient = useGradient('medium');

  return (
    <BaseScreenWrapper>
      <LinearGradient colors={heroGradient} style={{flex: 1}}>
        <View flex={1} justifyContent="center">
          <YStack padding="$2">
            <YStack
              backgroundColor="$white"
              borderRadius="$6"
              padding="$5"
              marginHorizontal="$2"
              shadowColor="#000"
              shadowOpacity={0.15}
              shadowOffset={{width: 0, height: 1}}
              shadowRadius={3}
              alignItems="center"
            >
              <YStack alignItems="center">
                <LogoSmallDark/>
              </YStack>


              <LottieView
                source={require('@/assets/lottie/email.json')}
                autoPlay
                loop={true}
                style={{
                  width: 172,
                  height: 172,
                }}
              />

              {/* Title */}
              <Text
                fontSize="$6"
                fontWeight="600"
                color="$absoluteTextPrimary"
                textAlign="center"
                marginBottom="$3"
              >
                Email Enviado!
              </Text>

              {/* Description */}
              <Text
                fontSize="$4"
                fontWeight="400"
                color="$absoluteTextSecondary"
                textAlign="center"
                lineHeight="$3"
                marginBottom="$5"
                maxWidth="280px"
              >
                Enviamos um link de recuperação de senha para{' '}
                <Text fontWeight="600" color="$absoluteTextPrimary">
                  {email}
                </Text>
              </Text>

              {/* Email Icon Info */}
              <XStack
                backgroundColor="$absoluteBorderDark"
                borderRadius="$4"
                padding="$3"
                alignItems="center"
                gap="$2"
                marginBottom="$5"
                width="100%"
              >
                <Mail size={20} color="$absoluteWhite"/>
                <Text fontSize="$3" color="$absoluteWhite" flex={1}>
                  Verifique sua caixa de entrada e spam
                </Text>
              </XStack>

              <YStack alignItems="center" gap="$3" width="100%">
                <HapticButton
                  height={52}
                  fontSize="$4"
                  fontWeight="600"
                  hapticType="light"
                  onPress={() => router.replace('/(auth)/sign-in')}
                >
                  Voltar para Login
                </HapticButton>
              </YStack>
            </YStack>
          </YStack>
        </View>
      </LinearGradient>
    </BaseScreenWrapper>
  );
}
