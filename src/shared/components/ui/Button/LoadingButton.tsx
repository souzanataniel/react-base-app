import React from 'react';
import type {ButtonProps} from 'tamagui';
import {Button, Spinner, Text, XStack} from 'tamagui';
import {useHapticFeedback} from '@/shared/components/feedback/Haptic/HapticContext';

interface LoadingButtonProps extends Omit<ButtonProps, 'children'> {
  loading?: boolean;
  children: string;
  loadingText?: string;
  loadingColor?: string;
  spinnerSize?: 'small' | 'large';
  hapticFeedback?: boolean;
  hapticType?: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' | 'selection';
  disableHaptic?: boolean;
}

export const LoadingButton = ({
                                loading = false,
                                children,
                                loadingText,
                                loadingColor = '$defaultWhite',
                                spinnerSize = 'small',
                                disabled,
                                backgroundColor = '$primary',
                                color = 'white',
                                size = '$5',
                                borderRadius = '$4',
                                fontWeight = '600',
                                hapticFeedback = true,
                                hapticType = 'light',
                                disableHaptic = false,
                                onPress,
                                ...props
                              }: LoadingButtonProps) => {

  const haptic = useHapticFeedback();

  const handlePress = async (event: any) => {
    if (hapticFeedback && !disableHaptic && !disabled && !loading) {
      try {
        switch (hapticType) {
          case 'light':
            haptic.light();
            break;
          case 'medium':
            haptic.medium();
            break;
          case 'heavy':
            haptic.heavy();
            break;
          case 'success':
            haptic.success();
            break;
          case 'warning':
            haptic.warning();
            break;
          case 'error':
            haptic.error();
            break;
          case 'selection':
            haptic.selection();
            break;
          default:
            haptic.light();
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

export const LoadingPrimaryButton: React.FC<Omit<LoadingButtonProps, 'hapticType'>> = (props) => (
  <LoadingButton hapticType="medium" {...props} />
);

export const LoadingSuccessButton: React.FC<Omit<LoadingButtonProps, 'hapticType'>> = (props) => (
  <LoadingButton
    hapticType="success"
    backgroundColor="$green9"
    {...props}
  />
);

export const LoadingWarningButton: React.FC<Omit<LoadingButtonProps, 'hapticType'>> = (props) => (
  <LoadingButton
    hapticType="warning"
    backgroundColor="$orange9"
    {...props}
  />
);

export const LoadingErrorButton: React.FC<Omit<LoadingButtonProps, 'hapticType'>> = (props) => (
  <LoadingButton
    hapticType="error"
    backgroundColor="$red9"
    {...props}
  />
);
