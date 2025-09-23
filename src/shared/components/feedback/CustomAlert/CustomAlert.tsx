// src/components/CustomAlert.tsx
import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react';
import {StyleSheet} from 'react-native';
// ===== TAMAGUI THEME INTEGRATION =====
import {Button, Circle, Text, useTheme, YStack} from 'tamagui';
import BottomSheet, {BottomSheetBackdrop, BottomSheetView} from '@gorhom/bottom-sheet';
import Animated, {useAnimatedStyle, useSharedValue, withSpring} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';

// ===== TYPES =====
type AlertIconType = 'success' | 'info' | 'warning' | 'error';

interface AlertConfig {
  title: string;
  message: string;
  confirmText?: string;
  iconType?: AlertIconType;
  onConfirm?: () => void | Promise<void>;
  onClose?: () => void;
}

interface CustomAlertRef {
  show: (config: AlertConfig) => void;
  hide: () => void;
}

// ===== ICON COMPONENT =====
const AnimatedIcon: React.FC<{ type: AlertIconType }> = ({type}) => {
  const scale = useSharedValue(0);

  React.useEffect(() => {
    scale.value = withSpring(1, {damping: 12, stiffness: 200});
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}]
  }));

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <Circle size={100} backgroundColor="transparent" marginBottom="$4">
            <LottieView
              source={require('@/assets/lottie/success.json')}
              autoPlay
              loop={true}
              style={{
                width: 172,
                height: 172,
              }}
            />
          </Circle>
        );
      case 'error':
        return (
          <Circle size={100} backgroundColor="transparent" marginBottom="$4">
            <LottieView
              source={require('@/assets/lottie/error.json')}
              autoPlay
              loop={true}
              style={{
                width: 150,
                height: 150,
              }}
            />
          </Circle>
        );
      case 'warning':
        return (
          <Circle size={100} backgroundColor="transparent" marginBottom="$4">
            <LottieView
              source={require('@/assets/lottie/warning.json')}
              autoPlay
              loop={true}
              style={{
                width: 120,
                height: 120,
              }}
            />
          </Circle>
        );
      case 'info':
        return (
          <Circle size={100} backgroundColor="transparent" marginBottom="$4">
            <LottieView
              source={require('@/assets/lottie/info.json')}
              autoPlay
              loop={true}
              style={{
                width: 120,
                height: 120,
              }}
            />
          </Circle>
        );
    }
  };

  return (
    <Animated.View style={animatedStyle}>
      {getIcon()}
    </Animated.View>
  );
};

// ===== MAIN COMPONENT =====
const CustomAlert = forwardRef<CustomAlertRef, {}>((_, ref) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(); // Usar estilos com tema

  const [alertData, setAlertData] = useState<AlertConfig>({
    title: '',
    message: '',
    confirmText: 'Confirm',
    iconType: 'success'
  });

  const snapPoints = useMemo(() => ['45%'], []);
  const contentOpacity = useSharedValue(0);

  const showAlert = useCallback((config: AlertConfig) => {
    setAlertData(config);
    bottomSheetRef.current?.expand();
    contentOpacity.value = withSpring(1, {damping: 15, stiffness: 200});
  }, []);

  const hideAlert = useCallback(() => {
    contentOpacity.value = withSpring(0, {damping: 15, stiffness: 200});
    setTimeout(() => bottomSheetRef.current?.close(), 150);
  }, []);

  useImperativeHandle(ref, () => ({show: showAlert, hide: hideAlert}), [showAlert, hideAlert]);

  const renderBackdrop = useCallback((props: any) => (
    <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.5}/>
  ), []);

  const handleConfirm = useCallback(async () => {
    try {
      if (alertData.onConfirm) await alertData.onConfirm();
    } catch (error) {
      console.error('Alert confirmation error:', error);
    } finally {
      hideAlert();
    }
  }, [alertData.onConfirm, hideAlert]);

  const handleClose = useCallback(() => {
    alertData.onClose?.();
    hideAlert();
  }, [alertData.onClose, hideAlert]);

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      enablePanDownToClose
      onClose={handleClose}
      backgroundStyle={styles.bottomSheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
    >
      <BottomSheetView style={styles.contentContainer}>
        <Animated.View style={contentAnimatedStyle}>
          <YStack
            flex={1}
            alignItems="center"
            justifyContent="center"
            space="$3"
            padding="$4"
            backgroundColor="$card" // Usar token do tema
            paddingBottom={Math.max(insets.bottom || 0, 20)}
          >
            {/* Icon */}
            <AnimatedIcon type={alertData.iconType || 'success'}/>

            {/* Title */}
            <Text
              fontSize="$8"
              fontWeight="600"
              color="$color" // Token do tema para texto principal
              textAlign="center"
              marginBottom="$2"
            >
              {alertData.title}
            </Text>

            {/* Message */}
            <Text
              fontSize="$4"
              color="$colorSecondary" // Token do tema para texto secundário
              textAlign="center"
              lineHeight="$2"
              marginBottom="$4"
              paddingHorizontal="$2"
            >
              {alertData.message}
            </Text>

            {/* Confirm Button */}
            <Button
              size="$4"
              backgroundColor="$button"
              color="$buttonLabel"
              borderRadius="$10"
              width="100%"
              maxWidth={300}
              pressStyle={{
                backgroundColor: '$button',
                scale: 0.98,
              }}
              onPress={handleConfirm}
              fontWeight="600"
            >
              {alertData.confirmText || 'Confirm'}
            </Button>
          </YStack>
        </Animated.View>
      </BottomSheetView>
    </BottomSheet>
  );
});

// ===== HOOK =====
const useCustomAlert = () => {
  const alertRef = useRef<CustomAlertRef>(null);

  const showAlert = useCallback((config: AlertConfig) => {
    alertRef.current?.show(config);
  }, []);

  const showSuccess = useCallback((title: string, message: string, confirmText?: string, onConfirm?: () => void) => {
    showAlert({title, message, iconType: 'success', confirmText: confirmText || 'Fechar!', onConfirm});
  }, [showAlert]);

  const showError = useCallback((title: string, message: string, confirmText?: string, onRetry?: () => void) => {
    showAlert({title, message, iconType: 'error', confirmText: confirmText || 'Fechar!', onConfirm: onRetry});
  }, [showAlert]);

  const showWarning = useCallback((title: string, message: string, confirmText?: string, onConfirm?: () => void) => {
    showAlert({title, message, iconType: 'warning', confirmText: confirmText || 'Entendido!', onConfirm});
  }, [showAlert]);

  const showInfo = useCallback((title: string, message: string, confirmText?: string, onConfirm?: () => void) => {
    showAlert({title, message, iconType: 'info', confirmText: confirmText || 'OK!', onConfirm});
  }, [showAlert]);

  const AlertComponent = useCallback(() => <CustomAlert ref={alertRef}/>, []);

  return {showAlert, showSuccess, showError, showWarning, showInfo, AlertComponent};
};

// ===== CONTEXT =====
const AlertContext = createContext<ReturnType<typeof useCustomAlert> | null>(null);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
  const alertMethods = useCustomAlert();
  return (
    <AlertContext.Provider value={alertMethods}>
      {children}
      <alertMethods.AlertComponent/>
    </AlertContext.Provider>
  );
};

export const useGlobalAlert = () => {
  const context = useContext(AlertContext);
  if (!context) throw new Error('useGlobalAlert must be used within AlertProvider');
  return context;
};

// Hook para estilos com tema
const useThemedStyles = () => {
  const theme = useTheme();

  return StyleSheet.create({
    bottomSheetBackground: {
      backgroundColor: theme.card?.val, // Usa token do tema
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
    },
    handleIndicator: {
      backgroundColor: theme.borderColor?.val, // Usa token do tema
      width: 50,
      height: 4,
    },
    contentContainer: {
      flex: 1,
    },
    backdrop: {
      backgroundColor: theme.color?.val, // Para overlay
    }
  });
};

export default CustomAlert;

export {useCustomAlert, type AlertConfig};
