import React from 'react';
import type {ButtonProps} from 'tamagui';
import {Button, Spinner, Text, XStack} from 'tamagui';
import * as Haptics from 'expo-haptics';

interface LoadingButtonProps extends Omit<ButtonProps, 'children'> {
  loading?: boolean;
  children: string;
  loadingText?: string;
  loadingColor?: string;
  spinnerSize?: 'small' | 'large';
  hapticFeedback?: boolean;
  hapticType?: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';
}

export const LoadingButton = ({
                                loading = false,
                                children,
                                loadingText,
                                loadingColor = '$white',
                                spinnerSize = 'small',
                                disabled,
                                backgroundColor = '$primary',
                                color = 'white',
                                size = '$5',
                                borderRadius = '$4',
                                fontWeight = '600',
                                hapticFeedback = true,
                                hapticType = 'light',
                                onPress,
                                ...props
                              }: LoadingButtonProps) => {

  const handlePress = async (event: any) => {
    // Feedback tátil ao clicar
    if (hapticFeedback && !disabled && !loading) {
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

    if (onPress && !disabled && !loading) {
      onPress(event);
    }
  };

  return (
    <Button
      backgroundColor={backgroundColor}
      color={color}
      size={size}
      borderRadius={borderRadius}
      borderWidth={0}
      fontWeight={fontWeight}
      disabled={disabled || loading}
      opacity={loading ? 0.8 : 1}
      onPress={handlePress}
      {...props}
      pressStyle={{
        scale: 0.98,
        backgroundColor: backgroundColor
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
      {loading ? (
        <XStack alignItems="center" gap="$2">
          <Spinner size={spinnerSize} color={loadingColor}/>
          <Text color={loadingColor} lineHeight={20}>
            {loadingText || children}
          </Text>
        </XStack>
      ) : (
        <Text color={color} fontWeight="bold" lineHeight={20}>
          {children}
        </Text>
      )}
    </Button>
  );
};

