import React from 'react';
import {Button, ButtonProps} from 'tamagui';
import {useHaptic} from '@/shared/components/feedback/Haptic/HapticContext';
import {HapticType} from '@/shared/components/feedback/Haptic/haptic';
import {useAnimatedStyle, useSharedValue, withTiming, withSequence} from 'react-native-reanimated';
import Animated from 'react-native-reanimated';

interface HapticButtonProps extends ButtonProps {
  hapticType?: HapticType;
  disableHaptic?: boolean;
}

export const HapticButton: React.FC<HapticButtonProps> = ({
                                                            hapticType = 'light',
                                                            disableHaptic = false,
                                                            onPress,
                                                            pressStyle,
                                                            ...props
                                                          }) => {
  const {triggerHaptic} = useHaptic();

  const shakeX = useSharedValue(0);
  const scale = useSharedValue(1);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [
      {scale: scale.value},
      {translateX: shakeX.value},
    ],
  }));

  const handlePress = (event: any) => {
    scale.value = withSequence(
      withTiming(0.92, { duration: 100 }),
      withTiming(1, { duration: 150 })
    );

    if (!disableHaptic) {
      triggerHaptic(hapticType);
    }

    if (onPress) {
      onPress(event);
    }
  };

  const mergedPressStyle = {
    backgroundColor: props.backgroundColor || 'transparent',
    ...pressStyle,
  };

  return (
    <Animated.View style={buttonStyle}>
      <Button
        {...props}
        onPress={handlePress}
        pressStyle={mergedPressStyle}
      />
    </Animated.View>
  );
};
