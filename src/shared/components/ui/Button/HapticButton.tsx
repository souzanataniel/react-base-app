import React from 'react';
import type {ButtonProps} from 'tamagui';
import {Button} from 'tamagui';
import * as Haptics from 'expo-haptics';
import {COLORS} from '@/shared/constants/colors';

interface HapticButtonProps extends Omit<ButtonProps, 'pressStyle' | 'style'> {
  hapticFeedback?: boolean;
  hapticType?: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';
}

export const HapticButton = ({
                               hapticFeedback = true,
                               hapticType = 'light',
                               disabled,
                               onPress,
                               backgroundColor = '$primary',
                               color = '$defaultWhite',
                               borderRadius = '$4',
                               height = 48,
                               width = '100%',
                               fontSize = '$4',
                               fontWeight = '600',
                               ...props
                             }: HapticButtonProps) => {

  const handlePress = async (event: any) => {
    if (hapticFeedback && !disabled) {
      try {
        switch (hapticType) {
          case 'light':
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            break;
          case 'medium':
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            break;
          case 'heavy':
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            break;
          case 'success':
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            break;
          case 'warning':
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            break;
          case 'error':
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            break;
        }
      } catch (error) {
        console.log('Haptic feedback not available');
      }
    }

    if (onPress && !disabled) {
      onPress(event);
    }
  };

  return (
    <Button
      backgroundColor={backgroundColor}
      color={color}
      borderRadius={borderRadius}
      borderWidth={0}
      height={height}
      width={width}
      fontSize={fontSize}
      fontWeight={fontWeight}
      disabled={disabled}
      onPress={handlePress}
      {...props}
      pressStyle={{
        scale: 0.95,
        backgroundColor: backgroundColor,
        borderColor: COLORS.PRIMARY
      }}
    />
  );
};
