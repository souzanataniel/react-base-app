import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Spinner, Text, YStack } from 'tamagui';
import { BlurView } from 'expo-blur';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface GlobalLoaderProps {
  visible: boolean;
  message?: string;
  useBlur?: boolean;
  onAnimationComplete?: () => void;
}

export function BaseLoader({
                               visible,
                               message = 'Carregando...',
                               useBlur = true,
                               onAnimationComplete
                             }: GlobalLoaderProps) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  // Estado React para controlar renderização
  const [shouldRender, setShouldRender] = useState(visible);

  useEffect(() => {
    if (visible) {
      setShouldRender(true); // Mostra o componente antes da animação

      // Animações de entrada
      opacity.value = withTiming(1, { duration: 300 });
      scale.value = withTiming(1, {
        duration: 300,
      }, (finished) => {
        if (finished && onAnimationComplete) {
          runOnJS(onAnimationComplete)();
        }
      });
    } else {
      // Animações de saída
      opacity.value = withTiming(0, { duration: 200 });
      scale.value = withTiming(0.8, {
        duration: 200
      }, (finished) => {
        if (finished) {
          // Remove da tela após animação terminar
          runOnJS(setShouldRender)(false);
        }
      });
    }
  }, [visible]);

  const animatedOverlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const animatedContentStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  // ✅ CORRETO - usando estado React ao invés de SharedValue
  if (!shouldRender) return null;

  const LoaderContent = (
    <YStack
      flex={1}
      alignItems="center"
      justifyContent="center"
      gap="$4"
    >
      <Animated.View style={animatedContentStyle}>
        <YStack
          alignItems="center"
          gap="$3"
          backgroundColor="$darkGray"
          padding="$6"
          borderRadius="$6"
          shadowColor="$shadowColor"
          shadowOffset={{ width: 0, height: 4 }}
          shadowOpacity={0.3}
          shadowRadius={8}
          elevation={8}
          minWidth={200}
        >
          <Spinner size="large" color="$white" />
          {message && (
            <Text
              fontSize="$4"
              color="$white"
              textAlign="center"
              maxWidth={180}
            >
              {message}
            </Text>
          )}
        </YStack>
      </Animated.View>
    </YStack>
  );

  return (
    <Animated.View
      style={[StyleSheet.absoluteFillObject, { zIndex: 9999 }, animatedOverlayStyle]}
    >
      {useBlur ? (
        <BlurView intensity={80} style={{ flex: 1 }}>
          {LoaderContent}
        </BlurView>
      ) : (
        <YStack
          flex={1}
          backgroundColor="rgba(0, 0, 0, 0.6)"
          alignItems="center"
          justifyContent="center"
        >
          <Animated.View style={animatedContentStyle}>
            <YStack
              alignItems="center"
              gap="$3"
              backgroundColor="$darkGray"
              padding="$6"
              borderRadius="$6"
              shadowColor="$shadowColor"
              shadowOffset={{ width: 0, height: 4 }}
              shadowOpacity={0.3}
              shadowRadius={8}
              elevation={8}
              minWidth={200}
            >
              <Spinner size="large" color="$white" />
              {message && (
                <Text
                  fontSize="$4"
                  color="$white"
                  textAlign="center"
                  maxWidth={180}
                >
                  {message}
                </Text>
              )}
            </YStack>
          </Animated.View>
        </YStack>
      )}
    </Animated.View>
  );
}
