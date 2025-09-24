import React, {useCallback, useMemo, useState} from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {Button, Spinner} from 'tamagui';
import {Check} from '@tamagui/lucide-icons';
import {useHapticFeedback} from '@/shared/components/feedback/Haptic/HapticContext';

const AnimatedButton = Animated.createAnimatedComponent(Button);

interface AnimatedSaveButtonProps {
  onSave: () => Promise<void> | void;
  isLoading?: boolean;
  disabled?: boolean;
  loadingText?: string;
  saveText?: string;
  onError?: (error: Error) => void;
  hapticFeedback?: boolean;
  disableHaptic?: boolean;
  backgroundColor?: string;
  color?: string;
  icon?: React.ReactNode;
  size?: '$1' | '$2' | '$3' | '$4' | '$5' | '$6';
  width?: number | string;
  maxWidth?: number;
  height?: number;
  borderRadius?: number | string;
  style?: any;
}

export const AnimatedSaveButton = React.memo<AnimatedSaveButtonProps>(({
                                                                         onSave,
                                                                         isLoading = false,
                                                                         disabled = false,
                                                                         loadingText = 'Salvando...',
                                                                         saveText = 'Salvar Alterações',
                                                                         onError,
                                                                         hapticFeedback = true,
                                                                         disableHaptic = false,
                                                                         backgroundColor = '$button',
                                                                         color = '$buttonLabel',
                                                                         size = '$4',
                                                                         width = '100%',
                                                                         maxWidth = 380,
                                                                         height = 48,
                                                                         borderRadius = '$10',
                                                                         style,
                                                                       }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const haptic = useHapticFeedback();

  const shakeX = useSharedValue(0);
  const scale = useSharedValue(1);

  const isButtonDisabled = useMemo(
    () => disabled || isLoading || isProcessing,
    [disabled, isLoading, isProcessing]
  );

  const buttonText = useMemo(
    () => (isLoading || isProcessing ? loadingText : saveText),
    [isLoading, isProcessing, loadingText, saveText]
  );

  const displayIcon = useMemo(() => {
    if (isLoading || isProcessing) {
      return <Spinner size="small" color={color}/>;
    }
    return <Check size={18} color={color}/>;
  }, [isLoading, isProcessing, color]);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [
      {scale: scale.value},
      {translateX: shakeX.value},
    ],
  }));

  const triggerHaptic = useCallback((type: 'press' | 'success' | 'error') => {
    if (!hapticFeedback || disableHaptic) return;

    // Usar o sistema global - só executa se estiver habilitado
    switch (type) {
      case 'press':
        haptic.medium();
        break;
      case 'success':
        haptic.success();
        break;
      case 'error':
        haptic.error();
        break;
    }
  }, [hapticFeedback, disableHaptic, haptic]);

  const handlePress = useCallback(async () => {
    if (isButtonDisabled) return;

    setIsProcessing(true);
    triggerHaptic('press');

    scale.value = withSequence(
      withSpring(0.96, {damping: 20, stiffness: 500}),
      withSpring(1, {damping: 20, stiffness: 350})
    );

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
  }, [isButtonDisabled, onSave, onError, triggerHaptic, scale, shakeX]);

  return (
    <AnimatedButton
      size={size}
      backgroundColor={backgroundColor}
      color={color}
      fontWeight="$6"
      borderRadius={borderRadius}
      disabled={isButtonDisabled}
      opacity={isButtonDisabled ? 0.6 : 1}
      onPress={handlePress}
      icon={displayIcon}
      width={width}
      maxWidth={maxWidth}
      height={height}
      style={[buttonStyle, style]}
    >
      {buttonText}
    </AnimatedButton>
  );
});

AnimatedSaveButton.displayName = 'AnimatedSaveButton';

export const AnimatedPrimarySaveButton: React.FC<Omit<AnimatedSaveButtonProps, 'backgroundColor' | 'color'>> = (props) => (
  <AnimatedSaveButton
    backgroundColor="$blue9"
    color="white"
    {...props}
  />
);

export const AnimatedSuccessSaveButton: React.FC<Omit<AnimatedSaveButtonProps, 'backgroundColor' | 'color'>> = (props) => (
  <AnimatedSaveButton
    backgroundColor="$green9"
    color="white"
    saveText="Confirmar Alterações"
    {...props}
  />
);

export const AnimatedDangerSaveButton: React.FC<Omit<AnimatedSaveButtonProps, 'backgroundColor' | 'color'>> = (props) => (
  <AnimatedSaveButton
    backgroundColor="$red9"
    color="white"
    saveText="Salvar e Aplicar"
    {...props}
  />
);
