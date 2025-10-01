
import React, {
  createContext,
  forwardRef,
  JSX,
  ReactNode,
  useCallback,
  useContext,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react';
import {Dimensions, Keyboard, Platform, StyleSheet} from 'react-native';
import {useTheme, YStack} from 'tamagui';
import BottomSheet, {BottomSheetBackdrop, BottomSheetView} from '@gorhom/bottom-sheet';
import Animated, {useAnimatedStyle, useSharedValue, withSpring} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useHapticFeedback} from '@/shared/components/feedback/Haptic/HapticContext';

const {width: screenWidth} = Dimensions.get('window');

interface ModalConfig {
  content: ReactNode;
  snapPoints?: string[];
  enablePanDownToClose?: boolean;
  disableHaptic?: boolean;
  onClose?: () => void;
}

interface BaseModalRef {
  show: (config: ModalConfig) => void;
  hide: () => void;
}

const BaseModal = forwardRef<BaseModalRef, {}>((_, ref) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles();
  const hapticFeedback = useHapticFeedback();

  const [modalData, setModalData] = useState<ModalConfig>({
    content: null,
    snapPoints: ['50%'],
    enablePanDownToClose: true,
  });

  const contentOpacity = useSharedValue(0);

  const showModal = useCallback((config: ModalConfig) => {
    Keyboard.dismiss();

    if (!config.disableHaptic) {
      hapticFeedback.light();
    }

    setModalData({
      ...config,
      snapPoints: config.snapPoints || ['50%'],
      enablePanDownToClose: config.enablePanDownToClose ?? true,
    });

    bottomSheetRef.current?.expand();
    contentOpacity.value = withSpring(1, {damping: 15, stiffness: 200});
  }, [hapticFeedback]);

  const hideModal = useCallback(() => {
    contentOpacity.value = withSpring(0, {damping: 15, stiffness: 200});
    setTimeout(() => bottomSheetRef.current?.close(), 150);
  }, []);

  useImperativeHandle(ref, () => ({show: showModal, hide: hideModal}), [showModal, hideModal]);

  const renderBackdrop = useCallback((props: any) => (
    <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.5}/>
  ), []);

  const handleClose = useCallback(() => {
    if (!modalData.disableHaptic) {
      hapticFeedback.light();
    }

    modalData.onClose?.();
    hideModal();
  }, [modalData.onClose, modalData.disableHaptic, hapticFeedback, hideModal]);

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={modalData.snapPoints}
      backdropComponent={renderBackdrop}
      enablePanDownToClose={modalData.enablePanDownToClose}
      onClose={handleClose}
      backgroundStyle={styles.bottomSheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
      containerStyle={styles.bottomSheetContainer}
    >
      <BottomSheetView style={styles.contentContainer}>
        <Animated.View style={contentAnimatedStyle}>
          <YStack
            flex={1}
            backgroundColor="$card"
            paddingBottom={Math.max(insets.bottom || 0, 20)}
          >
            {modalData.content}
          </YStack>
        </Animated.View>
      </BottomSheetView>
    </BottomSheet>
  );
});

const ModalContext = createContext<{
  showModal: (config: ModalConfig) => void;
  hideModal: () => void;
  ModalComponent: () => JSX.Element;
} | null>(null);

export const BaseModalProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
  const modalRef = useRef<BaseModalRef>(null);

  const showModal = useCallback((config: ModalConfig) => {
    modalRef.current?.show(config);
  }, []);

  const hideModal = useCallback(() => {
    modalRef.current?.hide();
  }, []);

  const ModalComponent = useCallback(() => <BaseModal ref={modalRef}/>, []);

  const value = useMemo(() => ({
    showModal,
    hideModal,
    ModalComponent
  }), [showModal, hideModal, ModalComponent]);

  return (
    <ModalContext.Provider value={value}>
      {children}
      <ModalComponent/>
    </ModalContext.Provider>
  );
};

export const useGlobalModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error('useGlobalModal must be used within ModalProvider');
  return context;
};

const useThemedStyles = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const isTablet = screenWidth > 768;
  const marginBottom = Platform.OS === 'ios' ? Math.max(insets.bottom - 8, 0) : Math.max(insets.bottom + 8, 0);
  const borderBottomRadius = Platform.OS === 'ios' ? 32 : 16;

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
      marginBottom: marginBottom,
      borderRadius: 16,
      borderBottomLeftRadius: borderBottomRadius,
      borderBottomRightRadius: borderBottomRadius,
    }
  });
};

export default BaseModal;
