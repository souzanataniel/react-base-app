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
import {Dimensions, Keyboard, StyleSheet} from 'react-native';
import {Button, Circle, Text, useTheme, YStack} from 'tamagui';
import BottomSheet, {BottomSheetBackdrop, BottomSheetView} from '@gorhom/bottom-sheet';
import Animated, {useAnimatedStyle, useSharedValue, withSpring} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import {useHapticFeedback} from '@/shared/components/feedback/Haptic/HapticContext';

const {width: screenWidth} = Dimensions.get('window');

type AlertIconType = 'success' | 'info' | 'warning' | 'error';

interface AlertConfig {
  title: string;
  message: string;
  confirmText?: string;
  iconType?: AlertIconType;
  onConfirm?: () => void | Promise<void>;
  onClose?: () => void;
  disableHaptic?: boolean;
}

interface CustomAlertRef {
  show: (config: AlertConfig) => void;
  hide: () => void;
}

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

const CustomAlert = forwardRef<CustomAlertRef, {}>((_, ref) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles();
  const hapticFeedback = useHapticFeedback();

  const [alertData, setAlertData] = useState<AlertConfig>({
    title: '',
    message: '',
    confirmText: 'Confirm',
    iconType: 'success'
  });

  const snapPoints = useMemo(() => ['42%'], []); // Reduzido para compensar o padding inferior
  const contentOpacity = useSharedValue(0);

  const showAlert = useCallback((config: AlertConfig) => {
    Keyboard.dismiss();

    // Haptic feedback baseado no tipo de alerta (se não estiver desabilitado)
    if (!config.disableHaptic) {
      switch (config.iconType) {
        case 'success':
          hapticFeedback.success();
          break;
        case 'error':
          hapticFeedback.error();
          break;
        case 'warning':
          hapticFeedback.warning();
          break;
        case 'info':
          hapticFeedback.light();
          break;
        default:
          hapticFeedback.light();
      }
    }

    setAlertData(config);
    bottomSheetRef.current?.expand();
    contentOpacity.value = withSpring(1, {damping: 15, stiffness: 200});
  }, [hapticFeedback]);

  const hideAlert = useCallback(() => {
    contentOpacity.value = withSpring(0, {damping: 15, stiffness: 200});
    setTimeout(() => bottomSheetRef.current?.close(), 150);
  }, []);

  useImperativeHandle(ref, () => ({show: showAlert, hide: hideAlert}), [showAlert, hideAlert]);

  const renderBackdrop = useCallback((props: any) => (
    <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.5}/>
  ), []);

  const handleConfirm = useCallback(async () => {
    if (!alertData.disableHaptic) {
      hapticFeedback.selection();
    }

    try {
      if (alertData.onConfirm) await alertData.onConfirm();
    } catch (error) {
      console.error('Alert confirmation error:', error);
    } finally {
      hideAlert();
    }
  }, [alertData.onConfirm, alertData.disableHaptic, hapticFeedback, hideAlert]);

  const handleClose = useCallback(() => {
    if (!alertData.disableHaptic) {
      hapticFeedback.light();
    }

    alertData.onClose?.();
    hideAlert();
  }, [alertData.onClose, alertData.disableHaptic, hapticFeedback, hideAlert]);

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
      containerStyle={styles.bottomSheetContainer}
    >
      <BottomSheetView style={styles.contentContainer}>
        <Animated.View style={contentAnimatedStyle}>
          <YStack
            flex={1}
            alignItems="center"
            justifyContent="center"
            space="$3"
            padding="$4"
            backgroundColor="$card"
            paddingBottom={Math.max(insets.bottom || 0, 20)}
          >
            <AnimatedIcon type={alertData.iconType || 'success'}/>

            <Text
              fontSize="$8"
              fontWeight="600"
              color="$color"
              textAlign="center"
              marginBottom="$2"
            >
              {alertData.title}
            </Text>

            <Text
              fontSize="$4"
              color="$colorSecondary"
              textAlign="center"
              lineHeight="$2"
              marginBottom="$4"
              paddingHorizontal="$2"
            >
              {alertData.message}
            </Text>

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

const useCustomAlert = () => {
  const alertRef = useRef<CustomAlertRef>(null);

  const showAlert = useCallback((config: AlertConfig) => {
    alertRef.current?.show(config);
  }, []);

  const showSuccess = useCallback((
    title: string,
    message: string,
    confirmText?: string,
    onConfirm?: () => void,
    disableHaptic?: boolean
  ) => {
    showAlert({
      title,
      message,
      iconType: 'success',
      confirmText: confirmText || 'Fechar!',
      onConfirm,
      disableHaptic
    });
  }, [showAlert]);

  const showError = useCallback((
    title: string,
    message: string,
    confirmText?: string,
    onRetry?: () => void,
    disableHaptic?: boolean
  ) => {
    showAlert({
      title,
      message,
      iconType: 'error',
      confirmText: confirmText || 'Fechar!',
      onConfirm: onRetry,
      disableHaptic
    });
  }, [showAlert]);

  const showWarning = useCallback((
    title: string,
    message: string,
    confirmText?: string,
    onConfirm?: () => void,
    disableHaptic?: boolean
  ) => {
    showAlert({
      title,
      message,
      iconType: 'warning',
      confirmText: confirmText || 'Entendido!',
      onConfirm,
      disableHaptic
    });
  }, [showAlert]);

  const showInfo = useCallback((
    title: string,
    message: string,
    confirmText?: string,
    onConfirm?: () => void,
    disableHaptic?: boolean
  ) => {
    showAlert({
      title,
      message,
      iconType: 'info',
      confirmText: confirmText || 'OK!',
      onConfirm,
      disableHaptic
    });
  }, [showAlert]);

  const AlertComponent = useCallback(() => <CustomAlert ref={alertRef}/>, []);

  return {showAlert, showSuccess, showError, showWarning, showInfo, AlertComponent};
};

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

const useThemedStyles = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const isTablet = screenWidth > 768;

  return StyleSheet.create({
    bottomSheetBackground: {
      backgroundColor: theme.card?.val,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
    },
    handleIndicator: {
      backgroundColor: theme.colorQuaternary?.val,
      width: 50,
      height: 4,
      borderRadius: 2,
    },
    contentContainer: {
      flex: 1,
    },
    backdrop: {
      backgroundColor: theme.color?.val,
    },
    bottomSheetContainer: {
      marginHorizontal: isTablet ? 16 : 8,
      marginBottom: Math.max(insets.bottom - 8, 0),
      borderRadius: 16,
      borderBottomLeftRadius: 32,
      borderBottomRightRadius: 32,
    }
  });
};

export default CustomAlert;

export {useCustomAlert, type AlertConfig};
