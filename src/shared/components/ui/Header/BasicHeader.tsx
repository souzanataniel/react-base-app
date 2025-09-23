import React, {useCallback} from 'react';
import {Platform, Pressable, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useRouter} from 'expo-router';
import {ArrowLeft} from '@tamagui/lucide-icons';
import {BlurView} from 'expo-blur';
import {Text, useTheme, XStack, YStack} from 'tamagui';
import {useThemeManager} from '@/shared/hooks/useTheme';

const DEFAULT_HEADER_HEIGHT = Platform.select({ios: 44, android: 56, default: 56});
const SIDE_WIDTH = 56;
const HIT_SLOP = {top: 8, bottom: 8, left: 8, right: 8};

type BasicHeaderProps = {
  title: string;
  leftIcon?: React.ReactNode;
  onLeftPress?: () => void;
  onBack?: () => void;
  rightIcon?: React.ReactNode;
  onRightPress?: () => void;
  showRight?: boolean;
  hideBackButton?: boolean; // Nova prop adicionada
  backgroundColor?: string;
  enableBlur?: boolean;
  blurIntensity?: number;
  blurTint?: 'light' | 'dark' | 'default';
  statusBarTranslucent?: boolean;
  statusBarStyle?: 'light' | 'dark';
  testID?: string;
};

const IconButton = React.memo(function IconButton({
                                                    onPress,
                                                    children,
                                                    a11yLabel,
                                                  }: {
  onPress?: () => void;
  children: React.ReactNode;
  a11yLabel: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}
      hitSlop={HIT_SLOP}
      onPress={onPress}
      style={({pressed}) => [
        styles.iconButton,
        pressed && {opacity: 0.6},
      ]}
    >
      {children}
    </Pressable>
  );
});

export const BasicHeader = React.memo(function BasicHeader({
                                                             title,
                                                             leftIcon,
                                                             onLeftPress,
                                                             onBack,
                                                             rightIcon,
                                                             onRightPress,
                                                             showRight = !!rightIcon,
                                                             hideBackButton = false, // Valor padrão false
                                                             enableBlur = true,
                                                             blurIntensity = 80,
                                                             blurTint,
                                                             testID,
                                                           }: BasicHeaderProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const router = useRouter();
  const {currentTheme} = useThemeManager();

  const handleLeft = useCallback(() => {
    if (onLeftPress) return onLeftPress();
    if (onBack) return onBack();
    router.back();
  }, [onLeftPress, onBack, router]);

  const totalHeight = insets.top + DEFAULT_HEADER_HEIGHT;
  const shouldUseBlur = enableBlur && Platform.OS === 'ios';
  const effectiveBlurTint = blurTint && blurTint !== 'default' ? blurTint : currentTheme;
  const finalBackgroundColor = shouldUseBlur ? 'transparent' : theme.background?.get();

  return (
    <YStack
      testID={testID}
      position="relative"
      height={totalHeight}
      paddingTop={insets.top}
      backgroundColor={finalBackgroundColor}
      {...(Platform.OS === 'android' ? {elevation: 1} : {})}
      style={styles.shadow}
    >
      {shouldUseBlur && (
        <BlurView
          intensity={blurIntensity}
          tint={effectiveBlurTint}
          style={styles.blurFill}
        />
      )}

      <XStack height={DEFAULT_HEADER_HEIGHT} alignItems="center">
        <XStack width={SIDE_WIDTH} alignItems="center" justifyContent="flex-start" paddingLeft="$1">
          {!hideBackButton && (
            <IconButton a11yLabel={`Voltar${title ? ` para ${title}` : ''}`} onPress={handleLeft}>
              {leftIcon ?? <ArrowLeft size={22} color={theme.color?.val ?? '#000'}/>}
            </IconButton>
          )}
        </XStack>

        <XStack flex={1} alignItems="center" justifyContent="center" paddingHorizontal="$2">
          <Text
            fontSize="$5"
            fontWeight="600"
            numberOfLines={1}
            ellipsizeMode="tail"
            color="$color"
          >
            {title}
          </Text>
        </XStack>

        <XStack width={SIDE_WIDTH} alignItems="center" justifyContent="flex-end" paddingRight="$1">
          {showRight && rightIcon ? (
            <IconButton a11yLabel="Ação do header" onPress={onRightPress}>
              {rightIcon}
            </IconButton>
          ) : null}
        </XStack>
      </XStack>
    </YStack>
  );
});

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0.5},
    shadowOpacity: 0.22,
    shadowRadius: 0.22,
  },
  blurFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  iconButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 9999,
  },
});

export const useHeaderTheme = () => {
  const {currentTheme} = useThemeManager();
  const theme = useTheme();

  return {
    blurTint: currentTheme,
    backgroundColor: theme.background?.get(),
    textColor: theme.color?.get(),
    iconColor: theme.color?.get(),
  };
};
