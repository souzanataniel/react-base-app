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
      overlayOpacity={0.7}
      fallbackOpacity={0.3}
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
            Base App
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
          Start a new{'\n'}social adventure.
        </Text>
      </View>

      <View
        position="absolute"
        bottom={270 + insets.bottom}
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
        backgroundColor="$cream"
        borderTopRightRadius="$12"
        padding="$5"
        style={{
          height: 250 + insets.bottom,
          paddingBottom: insets.bottom,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -5,
          },
          shadowOpacity: 0.1,
          shadowRadius: 15,
          elevation: 10,
        }}
      >
        <YStack gap="$4" justifyContent="center" flex={1}>
          <Link href="/(auth)/login" asChild>
            <Button
              backgroundColor="$oceanDark"
              color="white"
              size="$5"
              borderRadius="$6"
              fontWeight="600"
              pressStyle={{
                scale: 0.98,
                backgroundColor: '$ocean'
              }}
            >
              <Text color="$white" fontWeight="$8" lineHeight={20}>Fazer Login</Text>
            </Button>
          </Link>
          <Link href="/(auth)/register" asChild>
            <Button
              backgroundColor="transparent"
              borderColor="$oceanDark"
              borderWidth={2}
              color="$oceanDark"
              size="$5"
              borderRadius="$6"
              fontWeight="600"
              pressStyle={{
                scale: 0.98,
                backgroundColor: '$cream',
                borderColor: '$ocean'
              }}
            >
              <Text color="$oceanDark" fontWeight="$5">
                Realizar Cadastro
              </Text>
            </Button>
          </Link>

          <YStack alignItems="center" marginTop="$2">
            <Text fontSize="$4" color="$color11" fontWeight="300" marginTop="$5">
              Precisa de ajuda ?
            </Text>
          </YStack>
        </YStack>
      </View>
    </BackgroundImage>
  );
}
