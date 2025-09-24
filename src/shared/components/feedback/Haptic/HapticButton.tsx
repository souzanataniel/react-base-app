import React from 'react';
import {Button, ButtonProps} from 'tamagui';
import {useHaptic} from '@/shared/components/feedback/Haptic/HapticContext';
import {HapticType} from '@/shared/components/feedback/Haptic/haptic';

interface HapticButtonProps extends ButtonProps {
  hapticType?: HapticType;
  disableHaptic?: boolean;
}

export const HapticButton: React.FC<HapticButtonProps> = ({
                                                            hapticType = 'light',
                                                            disableHaptic = false,
                                                            onPress,
                                                            ...props
                                                          }) => {
  const {triggerHaptic} = useHaptic();

  const handlePress = (event: any) => {
    if (!disableHaptic) {
      triggerHaptic(hapticType);
    }

    if (onPress) {
      onPress(event);
    }
  };

  return (
    <Button
      {...props}
      onPress={handlePress}
    />
  );
};

export const HapticPrimaryButton: React.FC<Omit<HapticButtonProps, 'hapticType'>> = (props) => (
  <HapticButton hapticType="medium" {...props} />
);

export const HapticSecondaryButton: React.FC<Omit<HapticButtonProps, 'hapticType'>> = (props) => (
  <HapticButton hapticType="light" {...props} />
);

export const HapticDestructiveButton: React.FC<Omit<HapticButtonProps, 'hapticType'>> = (props) => (
  <HapticButton hapticType="heavy" {...props} />
);

export const HapticSelectionButton: React.FC<Omit<HapticButtonProps, 'hapticType'>> = (props) => (
  <HapticButton hapticType="selection" {...props} />
);
