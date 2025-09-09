import React from 'react';
import {Button, Text, View, XStack, YStack} from 'tamagui';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {BackgroundImage} from '@/shared/components/ui/Background/BackgroundImage';
import {Link} from 'expo-router';
import {Logo} from '@/shared/components/ui/Background/Logo';

export const HomeAuthScreen = () => {
  const insets = useSafeAreaInsets()

  return (
    <BackgroundImage
      imageUrl="https://images.pexels.com/photos/3602154/pexels-photo-3602154.jpeg?cs=srgb&dl=pexels-josh-hild-1270765-3602154.jpg&fm=jpg"
      overlayOpacity={0.8}
      fallbackOpacity={0.4}
    >
      <View position="absolute" top={insets.top + 20} left={0} right={0} zIndex={10}>
        <YStack alignItems="center">
          <Logo variant="default" showBackground tintColor="white"/>

          <Text
            color="white"
            fontSize="$10"
            fontWeight="600"
            opacity={0.9}
          >
            PUBA
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
            <Button
              backgroundColor="$white"
              color="$dark"
              size="$5"
              borderRadius="$10"
              fontWeight="600"
              pressStyle={{
                scale: 0.98,
                backgroundColor: '$lightest'
              }}
              style={{
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 4,
                },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              <Text color="$dark" fontWeight="600" lineHeight={20}>Fazer Login</Text>
            </Button>
          </Link>

          <Link href="/(auth)/sign-up" asChild>
            <Button
              backgroundColor="transparent"
              borderColor="white"
              borderWidth={2}
              color="white"
              size="$5"
              borderRadius="$10"
              fontWeight="600"
              pressStyle={{
                scale: 0.98,
                backgroundColor: 'rgba(255,255,255,0.1)'
              }}
              style={{
                backdropFilter: 'blur(10px)',
              }}
            >
              <Text color="white" fontWeight="500">
                Realizar Cadastro
              </Text>
            </Button>
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
