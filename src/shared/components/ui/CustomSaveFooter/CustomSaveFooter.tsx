import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { styled, Text, View, XStack } from 'tamagui';
import { CheckIcon } from 'react-native-heroicons/outline';
import { useTabBarHeight } from '@/shared/components/ui/AnimatedTabBar/hooks/useTabBarHeight';

interface ButtonStyleConfig {
  height: number;
  fontSize: number;
  fontWeight: string;
  paddingHorizontal: number;
  paddingVertical: number;
  borderRadius: number;
  iconSize: number;
}

interface FooterConfig {
  hapticFeedback: boolean;
  showLoadingSpinner: boolean;
  enableErrorShake: boolean;
  buttonStyle: ButtonStyleConfig;
}

interface CustomSaveFooterProps {
  onSave: () => Promise<void> | void;
  isLoading: boolean;
  disabled?: boolean;
  loadingText?: string;
  saveText?: string;
  visible?: boolean;
  config?: Partial<FooterConfig>;
}

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedText = Animated.createAnimatedComponent(Text);

const FooterContent = styled(XStack, {
  justifyContent: 'center',
  alignItems: 'center',
});

const SaveButtonContainer = styled(View, {
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
  maxWidth: 380,
});

const defaultFooterConfig: FooterConfig = {
  hapticFeedback: true,
  showLoadingSpinner: true,
  enableErrorShake: true,
  buttonStyle: {
    height: 44,
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 80,
    paddingVertical: 8,
    borderRadius: 22,
    iconSize: 18,
  },
};

const useFooterAnimation = (visible: boolean, tabBarHeight: number, config: any) => {
  const slideTranslateY = useSharedValue(tabBarHeight);

  useEffect(() => {
    if (visible) {
      slideTranslateY.value = withTiming(0, { duration: config.animation.hideShow.duration });
    } else {
      slideTranslateY.value = withTiming(tabBarHeight, { duration: config.animation.hideShow.duration });
    }
  }, [visible, tabBarHeight, slideTranslateY, config.animation.hideShow]);

  useEffect(() => {
    return () => {
      cancelAnimation(slideTranslateY);
    };
  }, [slideTranslateY]);

  const animatedFooterStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: slideTranslateY.value }],
  }));

  return { animatedFooterStyle };
};

const useSaveButton = (
  onSave: () => Promise<void> | void,
  isLoading: boolean,
  disabled: boolean,
  footerConfig: FooterConfig
) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const buttonAnimations = useSharedValue({
    scale: 1,
    translateY: 0,
    translateX: 0,
  });

  const triggerHapticFeedback = useCallback((type: 'press' | 'error') => {
    if (!footerConfig.hapticFeedback) return;

    if (type === 'press') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }, [footerConfig.hapticFeedback]);

  const handlePress = useCallback(async () => {
    if (disabled || isLoading || isProcessing) return;

    setIsProcessing(true);
    triggerHapticFeedback('press');

    buttonAnimations.value = {
      ...buttonAnimations.value,
      translateY: withSpring(-1, { damping: 15, stiffness: 400 }, () => {
        buttonAnimations.value = {
          ...buttonAnimations.value,
          translateY: withSpring(0, { damping: 15, stiffness: 350 })
        };
      })
    };

    try {
      await onSave();
    } catch (error) {
      triggerHapticFeedback('error');

      if (footerConfig.enableErrorShake) {
        buttonAnimations.value = {
          ...buttonAnimations.value,
          translateX: withSequence(
            withTiming(-8, { duration: 80 }),
            withRepeat(withTiming(8, { duration: 80 }), 3, true),
            withTiming(0, { duration: 80 })
          )
        };
      }
    } finally {
      setIsProcessing(false);
    }
  }, [disabled, isLoading, isProcessing, onSave, triggerHapticFeedback, buttonAnimations, footerConfig.enableErrorShake]);

  const handlePressIn = useCallback(() => {
    if (disabled || isLoading || isProcessing) return;

    buttonAnimations.value = {
      ...buttonAnimations.value,
      scale: withSpring(0.96, { damping: 20, stiffness: 500 })
    };
  }, [disabled, isLoading, isProcessing, buttonAnimations]);

  const handlePressOut = useCallback(() => {
    if (disabled || isLoading || isProcessing) return;

    buttonAnimations.value = {
      ...buttonAnimations.value,
      scale: withSpring(1, { damping: 20, stiffness: 500 })
    };
  }, [disabled, isLoading, isProcessing, buttonAnimations]);

  return {
    handlePress,
    handlePressIn,
    handlePressOut,
    buttonAnimations,
    isProcessing,
  };
};

const LoadingSpinner = React.memo<{ size: number }>(({ size }) => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 1000 }),
      -1,
      false
    );

    return () => cancelAnimation(rotation);
  }, [rotation]);

  const animatedSpinnerStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <AnimatedView
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 2,
          borderColor: 'white',
          borderTopColor: 'transparent',
        },
        animatedSpinnerStyle,
      ]}
    />
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';

const SaveButton = React.memo<{
  onPress: () => Promise<void>;
  isLoading: boolean;
  disabled: boolean;
  loadingText: string;
  saveText: string;
  config: any;
  footerConfig: FooterConfig;
}>(({
      onPress,
      isLoading,
      disabled,
      loadingText,
      saveText,
      config,
      footerConfig,
    }) => {
  const {
    handlePress,
    handlePressIn,
    handlePressOut,
    buttonAnimations,
    isProcessing,
  } = useSaveButton(onPress, isLoading, disabled, footerConfig);

  const { buttonStyle } = footerConfig;
  const isButtonDisabled = disabled || isLoading || isProcessing;

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: buttonAnimations.value.scale },
      { translateY: buttonAnimations.value.translateY },
      { translateX: buttonAnimations.value.translateX },
    ],
  }));

  const animatedButtonStyle = useAnimatedStyle(() => ({
    backgroundColor: withTiming(
      isButtonDisabled ? config.colors.inactive : config.colors.active,
      { duration: 200 }
    ),
    borderRadius: buttonStyle.borderRadius,
    paddingHorizontal: buttonStyle.paddingHorizontal,
    paddingVertical: buttonStyle.paddingVertical,
    height: buttonStyle.height,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  }));

  const buttonText = isLoading || isProcessing ? loadingText : saveText;

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isButtonDisabled}
      accessibilityRole="button"
      accessibilityLabel={buttonText}
      accessibilityState={{
        busy: isLoading || isProcessing,
        disabled: isButtonDisabled,
      }}
      style={{
        flex: 1,
        opacity: isButtonDisabled ? 0.6 : 1,
      }}
    >
      <AnimatedView style={animatedContainerStyle}>
        <AnimatedView style={animatedButtonStyle}>
          {(isLoading || isProcessing) && footerConfig.showLoadingSpinner ? (
            <LoadingSpinner size={buttonStyle.iconSize} />
          ) : (
            <CheckIcon size={buttonStyle.iconSize} color="white" />
          )}

          <AnimatedText
            style={{
              color: 'white',
              fontSize: buttonStyle.fontSize,
              fontWeight: buttonStyle.fontWeight,
            }}
          >
            {buttonText}
          </AnimatedText>
        </AnimatedView>
      </AnimatedView>
    </Pressable>
  );
});

SaveButton.displayName = 'SaveButton';

export const CustomSaveFooter = React.memo<CustomSaveFooterProps>(({
                                                                     onSave,
                                                                     isLoading = false,
                                                                     disabled = false,
                                                                     loadingText = 'Salvando...',
                                                                     saveText = 'Salvar alterações',
                                                                     visible = true,
                                                                     config: userConfig = {},
                                                                   }) => {
  const insets = useSafeAreaInsets();
  const { tabBarHeight, config } = useTabBarHeight();

  const footerConfig = useMemo(() => ({
    ...defaultFooterConfig,
    ...userConfig,
    buttonStyle: {
      ...defaultFooterConfig.buttonStyle,
      ...userConfig.buttonStyle,
    },
  }), [userConfig]);

  const { animatedFooterStyle } = useFooterAnimation(visible, tabBarHeight, config);

  const handleSave = useCallback(async () => {
    await onSave();
  }, [onSave]);

  return (
    <AnimatedView
      style={[
        {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: config.colors.background,
          borderTopLeftRadius: config.spacing.borderRadius,
          borderTopRightRadius: config.spacing.borderRadius,
          shadowColor: config.colors.shadow,
          shadowOpacity: 0.2,
          shadowRadius: 1,
          elevation: 8,
        },
        animatedFooterStyle,
      ]}
    >
      <FooterContent
        paddingHorizontal={config.spacing.paddingHorizontal + 12}
        paddingTop={config.spacing.paddingTop + 8}
        paddingBottom={Math.max(insets.bottom, 4)}
      >
        <SaveButtonContainer>
          <SaveButton
            onPress={handleSave}
            isLoading={isLoading}
            disabled={disabled}
            loadingText={loadingText}
            saveText={saveText}
            config={config}
            footerConfig={footerConfig}
          />
        </SaveButtonContainer>
      </FooterContent>
    </AnimatedView>
  );
});

CustomSaveFooter.displayName = 'CustomSaveFooter';
