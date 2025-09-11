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
                                backgroundColor = '$dark',
                                color = 'white',
                                size = '$5',
                                borderRadius = '$6',
                                fontWeight = '600',
                                pressStyle = {
                                  scale: 0.98,
                                  backgroundColor: '$dark'
                                },
                                marginTop = '$4',
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
        // Ignora erro se haptic não estiver disponível
        console.log('Haptic feedback not available');
      }
    }

    // Chama o onPress original
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
      fontWeight={fontWeight}
      pressStyle={pressStyle}
      marginTop={marginTop}
      disabled={disabled || loading}
      opacity={loading ? 0.8 : 1}
      onPress={handlePress}
      {...props}
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

// Versão alternativa mais simples (apenas vibração básica)
export const LoadingButtonSimple = ({
                                      loading = false,
                                      children,
                                      loadingText,
                                      loadingColor = '$white',
                                      spinnerSize = 'small',
                                      disabled,
                                      backgroundColor = '$dark',
                                      color = 'white',
                                      size = '$5',
                                      borderRadius = '$6',
                                      fontWeight = '600',
                                      pressStyle = {
                                        scale: 0.98,
                                        backgroundColor: '$dark'
                                      },
                                      marginTop = '$4',
                                      onPress,
                                      ...props
                                    }: LoadingButtonProps) => {

  const handlePress = async (event: any) => {
    // Vibração simples ao clicar
    if (!disabled && !loading) {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (error) {
        // Ignora se não disponível
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
      fontWeight={fontWeight}
      pressStyle={pressStyle}
      marginTop={marginTop}
      disabled={disabled || loading}
      opacity={loading ? 0.8 : 1}
      onPress={handlePress}
      {...props}
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
