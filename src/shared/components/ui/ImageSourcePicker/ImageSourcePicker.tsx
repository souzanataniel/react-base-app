import React, {
  createContext,
  forwardRef,
  JSX,
  useCallback,
  useContext,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react';
import {Dimensions, Keyboard, Platform, Pressable, StyleSheet} from 'react-native';
import {Button, Text, useTheme, YStack} from 'tamagui';
import BottomSheet, {BottomSheetBackdrop, BottomSheetView} from '@gorhom/bottom-sheet';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useHapticFeedback} from '@/shared/components/feedback/Haptic/HapticContext';

const {width: screenWidth} = Dimensions.get('window');

type ImageSourceOption = 'camera' | 'gallery' | 'remove' | 'avatar';

interface ImageSourceConfig {
  title?: string;
  subtitle?: string;
  showCamera?: boolean;
  showGallery?: boolean;
  showRemove?: boolean;
  showAvatar?: boolean;
  cameraText?: string;
  galleryText?: string;
  removeText?: string;
  avatarText?: string;
  cancelText?: string;
  onCamera?: () => void | Promise<void>;
  onGallery?: () => void | Promise<void>;
  onRemove?: () => void | Promise<void>;
  onAvatar?: () => void | Promise<void>;
  onCancel?: () => void;
  disableHaptic?: boolean;
}

interface ImageSourcePickerRef {
  show: (config?: ImageSourceConfig) => void;
  hide: () => void;
}

const ImageSourcePicker = forwardRef<ImageSourcePickerRef, {}>((_, ref) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles();
  const hapticFeedback = useHapticFeedback();

  const [config, setConfig] = useState<ImageSourceConfig>({
    title: 'Foto do Perfil',
    subtitle: 'Escolha uma opção',
    showCamera: true,
    showGallery: true,
    showRemove: true,
    showAvatar: false,
    cameraText: 'Câmera',
    galleryText: 'Galeria',
    removeText: 'Remover Foto',
    avatarText: 'Atualizar Avatar',
    cancelText: 'Cancelar',
  });

  const snapPoints = useMemo(() => {
    const baseHeight = 280;
    const buttonHeight = 60;
    let totalButtons = 1;

    if (config.showCamera) totalButtons++;
    if (config.showGallery) totalButtons++;
    if (config.showRemove) totalButtons++;
    if (config.showAvatar) totalButtons++;

    const calculatedHeight = baseHeight + (totalButtons * buttonHeight);
    const heightPercentage = Math.min((calculatedHeight / Dimensions.get('window').height) * 100, 50);

    return [`${heightPercentage}%`];
  }, [config]);

  const showPicker = useCallback((pickerConfig?: ImageSourceConfig) => {
    Keyboard.dismiss();

    if (!pickerConfig?.disableHaptic) {
      hapticFeedback.light();
    }

    if (pickerConfig) {
      setConfig(prev => ({...prev, ...pickerConfig}));
    }

    bottomSheetRef.current?.expand();
  }, [hapticFeedback]);

  const hidePicker = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  useImperativeHandle(ref, () => ({show: showPicker, hide: hidePicker}), [showPicker, hidePicker]);

  const renderBackdrop = useCallback((props: any) => (
    <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.5}/>
  ), []);

  const handleOption = useCallback(async (callback?: () => void | Promise<void>) => {
    hidePicker();

    setTimeout(async () => {
      try {
        if (callback) await callback();
      } catch (error) {
        console.error('Image source picker error:', error);
      }
    }, 200);
  }, [hidePicker]);

  const handleCancel = useCallback(() => {
    config.onCancel?.();
    hidePicker();
  }, [config, hidePicker]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      enablePanDownToClose
      onClose={handleCancel}
      backgroundStyle={styles.bottomSheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
      containerStyle={styles.bottomSheetContainer}
    >
      <BottomSheetView style={styles.contentContainer}>
        <YStack
          flex={1}
          gap="$2"
          padding="$4"
          backgroundColor="$card"
          paddingBottom={Math.max(insets.bottom || 0, 20)}
        >
          {/* Header */}
          <YStack gap="$1" marginBottom="$3" alignItems="center">
            <Text
              fontSize="$7"
              fontWeight="700"
              color="$color"
              textAlign="center"
            >
              {config.title}
            </Text>

            {config.subtitle && (
              <Text
                fontSize="$4"
                color="$colorTertiary"
                textAlign="center"
              >
                {config.subtitle}
              </Text>
            )}
          </YStack>

          {/* Options */}
          <YStack gap="$2">
            {config.showCamera && (
              <Pressable
                onPress={() => {
                  if (!config.disableHaptic) {
                    hapticFeedback.selection();
                  }
                  handleOption(config.onCamera);
                }}
                style={({pressed}) => [
                  styles.buttonPressable,
                  {
                    opacity: pressed ? 0.7 : 1,
                    transform: [{scale: pressed ? 0.98 : 1}],
                  }
                ]}
              >
                <Button
                  size="$5"
                  backgroundColor="$switch"
                  color="$color"
                  borderRadius="$10"
                  pointerEvents="none"
                  fontSize="$5"
                  fontWeight="500"
                  width="100%"
                >
                  {config.cameraText}
                </Button>
              </Pressable>
            )}

            {config.showGallery && (
              <Pressable
                onPress={() => {
                  if (!config.disableHaptic) {
                    hapticFeedback.selection();
                  }
                  handleOption(config.onGallery);
                }}
                style={({pressed}) => [
                  styles.buttonPressable,
                  {
                    opacity: pressed ? 0.7 : 1,
                    transform: [{scale: pressed ? 0.98 : 1}],
                  }
                ]}
              >
                <Button
                  size="$5"
                  backgroundColor="$switch"
                  color="$color"
                  borderRadius="$10"
                  pointerEvents="none"
                  fontSize="$5"
                  fontWeight="500"
                  width="100%"
                >
                  {config.galleryText}
                </Button>
              </Pressable>
            )}

            {config.showRemove && (
              <Pressable
                onPress={() => {
                  if (!config.disableHaptic) {
                    hapticFeedback.selection();
                  }
                  handleOption(config.onRemove);
                }}
                style={({pressed}) => [
                  styles.buttonPressable,
                  {
                    opacity: pressed ? 0.7 : 1,
                    transform: [{scale: pressed ? 0.98 : 1}],
                  }
                ]}
              >
                <Button
                  size="$5"
                  backgroundColor="$switch"
                  color="$error"
                  borderRadius="$10"
                  pointerEvents="none"
                  fontSize="$5"
                  fontWeight="500"
                  width="100%"
                >
                  {config.removeText}
                </Button>
              </Pressable>
            )}

            {config.showAvatar && (
              <Pressable
                onPress={() => {
                  if (!config.disableHaptic) {
                    hapticFeedback.selection();
                  }
                  handleOption(config.onAvatar);
                }}
                style={({pressed}) => [
                  styles.buttonPressable,
                  {
                    opacity: pressed ? 0.7 : 1,
                    transform: [{scale: pressed ? 0.98 : 1}],
                  }
                ]}
              >
                <Button
                  size="$5"
                  backgroundColor="$switch"
                  color="$color"
                  borderRadius="$10"
                  pointerEvents="none"
                  fontSize="$5"
                  fontWeight="500"
                  width="100%"
                >
                  {config.avatarText}
                </Button>
              </Pressable>
            )}

            <Pressable
              onPress={() => {
                if (!config.disableHaptic) {
                  hapticFeedback.light();
                }
                handleCancel();
              }}
              style={({pressed}) => [
                styles.buttonPressable,
                {
                  opacity: pressed ? 0.7 : 1,
                  transform: [{scale: pressed ? 0.98 : 1}],
                }
              ]}
            >
              <Button
                size="$5"
                backgroundColor="$switch"
                color="$color"
                borderRadius="$10"
                pointerEvents="none"
                fontSize="$5"
                fontWeight="500"
                width="100%"
              >
                {config.cancelText}
              </Button>
            </Pressable>
          </YStack>
        </YStack>
      </BottomSheetView>
    </BottomSheet>
  );
});

const ImageSourceContext = createContext<{
  show: (config?: ImageSourceConfig) => void;
  hide: () => void;
  ImageSourcePickerComponent: () => JSX.Element;
} | null>(null);

export const ImageSourcePickerProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
  const pickerRef = useRef<ImageSourcePickerRef>(null);

  const show = useCallback((config?: ImageSourceConfig) => {
    pickerRef.current?.show(config);
  }, []);

  const hide = useCallback(() => {
    pickerRef.current?.hide();
  }, []);

  const ImageSourcePickerComponent = useCallback(() => <ImageSourcePicker ref={pickerRef}/>, []);

  const value = useMemo(() => ({
    show,
    hide,
    ImageSourcePickerComponent
  }), [show, hide, ImageSourcePickerComponent]);

  return (
    <ImageSourceContext.Provider value={value}>
      {children}
      <ImageSourcePickerComponent/>
    </ImageSourceContext.Provider>
  );
};

export const useImageSourcePicker = () => {
  const context = useContext(ImageSourceContext);
  if (!context) throw new Error('useImageSourcePicker must be used within ImageSourcePickerProvider');
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
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
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
    bottomSheetContainer: {
      marginHorizontal: isTablet ? 16 : 8,
      marginBottom: marginBottom,
      borderRadius: 24,
      borderBottomLeftRadius: borderBottomRadius,
      borderBottomRightRadius: borderBottomRadius,
    },
    buttonPressable: {
      width: '100%',
    }
  });
};

export default ImageSourcePicker;
