import React from 'react';
import {Button, Text, View, XStack, YStack} from 'tamagui';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {BackgroundImage} from '@/shared/components/ui/Background/BackgroundImage';
import {Link, router} from 'expo-router';
import {LogoLargeLight} from '@/shared/components/ui/Background/Logo';
import {HapticButton} from '@/shared/components';

export const HomeAuthScreen = () => {
  const insets = useSafeAreaInsets()

  return (
    <BackgroundImage
      lightSource={require('assets/images/bg.png')}
      darkSource={require('assets/images/bg.png')}
      overlayOpacity={0.6}
      fallbackOpacity={0.25}
    >
      <View position="absolute" top={insets.top + 20} left={0} right={0} zIndex={10}>
        <YStack alignItems="center">
          <LogoLargeLight/>

          <Text
            color="white"
            fontSize="$10"
            fontWeight="600"
            opacity={0.9}
          >
            BASE
          </Text>
        </YStack>
      </View>

      <View
        position="absolute"
        top="50%"
        left={24}
        right={24}
        zIndex={10}
      >
        <Text
          fontSize="$9"
          fontWeight="bold"
          color="white"
          lineHeight="$8"
          textAlign="center"
        >
          Comece uma nova{'\n'}aventura social.
        </Text>
      </View>

      <View
        position="absolute"
        bottom={200 + insets.bottom}
        left={0}
        right={0}
        zIndex={10}
      >
        <XStack justifyContent="center" gap="$2">
          <View
            width={8}
            height={8}
            borderRadius="$10"
            backgroundColor="white"
          />
          <View
            width={8}
            height={8}
            borderRadius="$10"
            backgroundColor="rgba(255,255,255,0.4)"
          />
          <View
            width={8}
            height={8}
            borderRadius="$10"
            backgroundColor="rgba(255,255,255,0.4)"
          />
        </XStack>
      </View>

      <View
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        zIndex={10}
        paddingHorizontal="$5"
        paddingBottom={insets.bottom + 40}
        paddingTop="$6"
      >
        <YStack gap="$4" justifyContent="center">
          <Link href="/(auth)/sign-in" asChild>
            <HapticButton
              hapticType="light"
              backgroundColor="$defaultWhite"
              borderColor="$defaultWhite"
              borderWidth={0}
              borderRadius="$10"
              color="$defaultBlack"
            >
              Fazer Login
            </HapticButton>
          </Link>

          <Link href="/(auth)/sign-up" asChild>
            <HapticButton
              hapticType="light"
              backgroundColor="transparent"
              borderColor="$defaultWhite"
              borderWidth={2}
              borderRadius="$10"
              color="$defaultWhite"
            >
              Realizar Cadastro
            </HapticButton>
          </Link>

          <YStack alignItems="center" marginTop="$4">
            <Text fontSize="$4" color="rgba(255,255,255,0.8)" fontWeight="300">
              Precisa de ajuda?
            </Text>
          </YStack>
        </YStack>
      </View>
    </BackgroundImage>
  );
}
