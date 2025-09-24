import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Platform} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {Button, Spinner, Stack, useTheme, XStack} from 'tamagui';
import {Check} from '@tamagui/lucide-icons';
import {useHapticFeedback} from '@/shared/components/feedback/Haptic/HapticContext';

const AnimatedStack = Animated.createAnimatedComponent(Stack);
const AnimatedButton = Animated.createAnimatedComponent(Button);

interface CustomSaveFooterProps {
  onSave: () => Promise<void> | void;
  isLoading?: boolean;
  disabled?: boolean;
  loadingText?: string;
  saveText?: string;
  visible?: boolean;
  onError?: (error: Error) => void;
  hapticFeedback?: boolean;
  disableHaptic?: boolean; // Nova prop para controle individual
  backgroundColor?: string;
  color?: string;
  fontWeight?: string | number;
  icon?: React.ReactNode;
}

export const CustomSaveFooter = React.memo<CustomSaveFooterProps>(({
                                                                     onSave,
                                                                     isLoading = false,
                                                                     disabled = false,
                                                                     loadingText = 'Salvando...',
                                                                     saveText = 'Salvar alterações',
                                                                     visible = true,
                                                                     onError,
                                                                     hapticFeedback = true,
                                                                     disableHaptic = false,
                                                                     backgroundColor = '$button',
                                                                     color = '$buttonLabel',
                                                                   }) => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const haptic = useHapticFeedback();
  const [isProcessing, setIsProcessing] = useState(false);

  // Animações simplificadas
  const slideY = useSharedValue(visible ? 0 : 100);
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

  // Calcula padding bottom adequado para cada plataforma
  const bottomPadding = useMemo(() => {
    if (Platform.OS === 'android') {
      // Android: insets.bottom (para evitar botões do sistema) + padding extra
      return (insets.bottom || 0) + 12;
    }
    // iOS: manter comportamento original
    return insets.bottom || 12;
  }, [insets.bottom]);

  // Efeito de slide do footer
  useEffect(() => {
    slideY.value = withTiming(visible ? 0 : 100, {duration: 250});
  }, [visible, slideY]);

  // Styles animados
  const footerStyle = useAnimatedStyle(() => ({
    transform: [{translateY: slideY.value}],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [
      {scale: scale.value},
      {translateX: shakeX.value},
    ],
  }));

  // Haptic feedback usando sistema global
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

  // Handlers
  const handlePress = useCallback(async () => {
    if (isButtonDisabled) return;

    setIsProcessing(true);
    triggerHaptic('press');

    // Animação de press
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

      // Animação de shake para erro
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
    <AnimatedStack
      backgroundColor="$card"
      style={footerStyle}
    >
      <XStack
        justifyContent="center"
        alignItems="center"
        paddingHorizontal="$4"
        paddingTop="$3"
        paddingBottom={bottomPadding}
      >
        <AnimatedButton
          size="$4"
          backgroundColor={backgroundColor}
          color={color}
          fontWeight="$6"
          disabled={isButtonDisabled}
          opacity={isButtonDisabled ? 0.6 : 1}
          onPress={handlePress}
          icon={displayIcon}
          width="100%"
          maxWidth={380}
          height={48}
          style={buttonStyle}
        >
          {buttonText}
        </AnimatedButton>
      </XStack>
    </AnimatedStack>
  );
});

CustomSaveFooter.displayName = 'CustomSaveFooter';

// Variantes pré-configuradas
export const CustomPrimarySaveFooter: React.FC<Omit<CustomSaveFooterProps, 'backgroundColor' | 'color'>> = (props) => (
  <CustomSaveFooter
    backgroundColor="$blue9"
    color="white"
    {...props}
  />
);

export const CustomSuccessSaveFooter: React.FC<Omit<CustomSaveFooterProps, 'backgroundColor' | 'color'>> = (props) => (
  <CustomSaveFooter
    backgroundColor="$green9"
    color="white"
    saveText="Confirmar Alterações"
    {...props}
  />
);

export const CustomDangerSaveFooter: React.FC<Omit<CustomSaveFooterProps, 'backgroundColor' | 'color'>> = (props) => (
  <CustomSaveFooter
    backgroundColor="$red9"
    color="white"
    saveText="Aplicar Alterações"
    {...props}
  />
);
