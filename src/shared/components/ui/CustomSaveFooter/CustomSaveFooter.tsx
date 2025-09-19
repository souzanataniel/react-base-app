import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Pressable} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {Stack, Text, useTheme, XStack, YStack} from 'tamagui';
import {Check} from '@tamagui/lucide-icons';

const AnimatedStack = Animated.createAnimatedComponent(YStack);
const AnimatedXStack = Animated.createAnimatedComponent(XStack);

interface CustomSaveFooterProps {
  onSave: () => Promise<void> | void;
  isLoading?: boolean;
  disabled?: boolean;
  loadingText?: string;
  saveText?: string;
  visible?: boolean;
  onError?: (error: Error) => void;
  hapticFeedback?: boolean;
}

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
}

const LoadingSpinner = React.memo<LoadingSpinnerProps>(({size = 18, color = 'white'}) => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(withTiming(360, {duration: 1000}), -1, false);
    return () => {
      rotation.value = 0;
    };
  }, []);

  const spinnerStyle = useAnimatedStyle(() => ({
    transform: [{rotate: `${rotation.value}deg`}],
  }));

  return (
    <AnimatedStack
      width={size}
      height={size}
      borderRadius={size / 2}
      borderWidth={2}
      borderColor={color}
      borderTopColor="transparent"
      style={spinnerStyle}
    />
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';

export const CustomSaveFooter = React.memo(({
                                              onSave,
                                              isLoading = false,
                                              disabled = false,
                                              loadingText = 'Salvando...',
                                              saveText = 'Salvar alterações',
                                              visible = true,
                                              onError,
                                              hapticFeedback = true,
                                            }: CustomSaveFooterProps) => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [isProcessing, setIsProcessing] = useState(false);

  const slideY = useSharedValue(visible ? 0 : 100);
  const scale = useSharedValue(1);
  const shakeX = useSharedValue(0);
  const buttonY = useSharedValue(0);

  const isButtonDisabled = useMemo(
    () => disabled || isLoading || isProcessing,
    [disabled, isLoading, isProcessing]
  );

  const activeColor = useMemo(
    () => theme.button?.get() || '#007AFF',
    [theme]
  );

  const inactiveColor = useMemo(
    () => theme.button?.get() || '#8E8E93',
    [theme]
  );

  const buttonText = useMemo(
    () => (isLoading || isProcessing ? loadingText : saveText),
    [isLoading, isProcessing, loadingText, saveText]
  );

  useEffect(() => {
    slideY.value = withTiming(visible ? 0 : 100, {duration: 150});
  }, [visible]);

  const footerStyle = useAnimatedStyle(() => ({
    transform: [{translateY: slideY.value}],
    shadowOpacity: 0.2,
    shadowRadius: 1
  }));

  const buttonContainerStyle = useAnimatedStyle(() => ({
    transform: [
      {scale: scale.value},
      {translateX: shakeX.value},
      {translateY: buttonY.value},
    ],
  }));

  const buttonBgStyle = useAnimatedStyle(() => ({
    backgroundColor: withTiming(
      isButtonDisabled ? inactiveColor : activeColor,
      {duration: 200}
    ),
  }));

  const triggerHaptic = useCallback((type: 'press' | 'success' | 'error') => {
    if (!hapticFeedback) return;

    switch (type) {
      case 'press':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'success':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case 'error':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
    }
  }, [hapticFeedback]);

  // Handlers
  const handlePress = useCallback(async () => {
    if (isButtonDisabled) return;

    setIsProcessing(true);
    triggerHaptic('press');

    buttonY.value = withSpring(-1, {damping: 15, stiffness: 400}, (finished) => {
      if (finished) {
        buttonY.value = withSpring(0, {damping: 15, stiffness: 350});
      }
    });

    try {
      await onSave();
      triggerHaptic('success');
    } catch (err) {
      const error = err as Error;
      onError?.(error);
      triggerHaptic('error');

      shakeX.value = withSequence(
        withTiming(-8, {duration: 80}),
        withRepeat(withTiming(8, {duration: 80}), 3, true),
        withTiming(0, {duration: 80})
      );
    } finally {
      setIsProcessing(false);
    }
  }, [isButtonDisabled, onSave, onError, triggerHaptic]);

  const handlePressIn = useCallback(() => {
    if (isButtonDisabled) return;
    scale.value = withSpring(0.96, {damping: 20, stiffness: 500});
  }, [isButtonDisabled]);

  const handlePressOut = useCallback(() => {
    if (isButtonDisabled) return;
    scale.value = withSpring(1, {damping: 20, stiffness: 500});
  }, [isButtonDisabled]);

  return (
    <AnimatedStack
      backgroundColor="$card"
      style={footerStyle}
    >
      <XStack
        justifyContent="center"
        alignItems="center"
        paddingHorizontal="$4"
        paddingTop="$3"
        paddingBottom={insets.bottom || 12}
      >
        <Stack
          width="100%"
          maxWidth={380}
          alignSelf="center"
        >
          <Pressable
            onPress={handlePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={isButtonDisabled}
            accessibilityRole="button"
            accessibilityLabel={buttonText}
            accessibilityState={{busy: isLoading || isProcessing, disabled: isButtonDisabled}}
            style={{opacity: isButtonDisabled ? 0.6 : 1}}
          >
            <AnimatedXStack
              alignItems="center"
              justifyContent="center"
              style={buttonContainerStyle}
            >
              <AnimatedXStack
                alignItems="center"
                justifyContent="center"
                gap="$2"
                borderRadius="$10"
                paddingHorizontal="$8"
                paddingVertical="$3"
                height={48}
                style={buttonBgStyle}
              >
                {isLoading || isProcessing ? (
                  <LoadingSpinner/>
                ) : (
                  <Check size={18} color="white"/>
                )}

                <Text
                  color="white"
                  fontSize="$4"
                  fontWeight="600"
                >
                  {buttonText}
                </Text>
              </AnimatedXStack>
            </AnimatedXStack>
          </Pressable>
        </Stack>
      </XStack>
    </AnimatedStack>
  );
});

CustomSaveFooter.displayName = 'CustomSaveFooter';
