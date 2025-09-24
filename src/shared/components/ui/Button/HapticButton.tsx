import React from 'react';
import type {ButtonProps} from 'tamagui';
import {Button} from 'tamagui';
import {COLORS} from '@/shared/constants/colors';
import {useHapticFeedback} from '@/shared/components/feedback/Haptic/HapticContext';

interface HapticButtonProps extends Omit<ButtonProps, 'pressStyle' | 'style'> {
  hapticFeedback?: boolean;
  hapticType?: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' | 'selection';
  disableHaptic?: boolean;
}

export const HapticButton = ({
                               hapticFeedback = true,
                               hapticType = 'light',
                               disableHaptic = false,
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

  const haptic = useHapticFeedback();

  const handlePress = async (event: any) => {
    if (hapticFeedback && !disableHaptic && !disabled) {
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

export const HapticPrimaryButton: React.FC<Omit<HapticButtonProps, 'hapticType'>> = (props) => (
  <HapticButton hapticType="medium" {...props} />
);

export const HapticSecondaryButton: React.FC<Omit<HapticButtonProps, 'hapticType'>> = (props) => (
  <HapticButton hapticType="light" {...props} />
);

export const HapticSuccessButton: React.FC<Omit<HapticButtonProps, 'hapticType'>> = (props) => (
  <HapticButton
    hapticType="success"
    backgroundColor="$green9"
    {...props}
  />
);

export const HapticWarningButton: React.FC<Omit<HapticButtonProps, 'hapticType'>> = (props) => (
  <HapticButton
    hapticType="warning"
    backgroundColor="$orange9"
    {...props}
  />
);

export const HapticErrorButton: React.FC<Omit<HapticButtonProps, 'hapticType'>> = (props) => (
  <HapticButton
    hapticType="error"
    backgroundColor="$red9"
    {...props}
  />
);

export const HapticDestructiveButton: React.FC<Omit<HapticButtonProps, 'hapticType'>> = (props) => (
  <HapticButton hapticType="heavy" backgroundColor="$red9" {...props} />
);

export const HapticSelectionButton: React.FC<Omit<HapticButtonProps, 'hapticType'>> = (props) => (
  <HapticButton hapticType="selection" {...props} />
);
