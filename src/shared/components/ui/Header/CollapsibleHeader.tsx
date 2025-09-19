import React, {useCallback, useMemo, useRef} from 'react';
import {Animated, Platform, Pressable, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useRouter} from 'expo-router';
import {getToken, Text, Token, useTheme, XStack} from 'tamagui';
import {ArrowLeft} from '@tamagui/lucide-icons';
import {BlurView} from 'expo-blur';

const DEFAULT_HEADER_HEIGHT = Platform.select({
  ios: 44,
  android: 56,
  default: 56,
});

type CollapsibleHeaderProps = {
  title: string;
  onBack?: () => void;
  rightIcon?: React.ReactNode;
  onRightPress?: () => void;
  showRight?: boolean;
  backgroundColor?: string;
  scrollY: Animated.Value;
  largeTitleColor?: string;
  enableBlur?: boolean;
  blurIntensity?: number;
  blurTint?: 'light' | 'dark' | 'default';
};

const IconButton = React.memo(({
                                 onPress,
                                 children,
                                 a11yLabel,
                               }: {
  onPress?: () => void;
  children: React.ReactNode;
  a11yLabel: string;
}) => {
  const pressedStyle = useMemo(() => ({
    opacity: 0.6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 9999,
  }), []);

  const normalStyle = useMemo(() => ({
    opacity: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 9999,
  }), []);

  const getStyle = useCallback((pressed: boolean) =>
      pressed ? pressedStyle : normalStyle
    , [pressedStyle, normalStyle]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}
      hitSlop={12}
      onPress={onPress}
      style={({pressed}) => getStyle(pressed)}
    >
      {children}
    </Pressable>
  );
});

IconButton.displayName = 'IconButton';

export const CollapsibleHeader = React.memo(({
                                               title,
                                               onBack,
                                               rightIcon,
                                               onRightPress,
                                               showRight = !!rightIcon,
                                               backgroundColor,
                                               scrollY,
                                               largeTitleColor,
                                               enableBlur = true,
                                               blurIntensity = 80,
                                               blurTint = 'default',
                                             }: CollapsibleHeaderProps) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useTheme();

  const resolvedBackgroundColor = useMemo(() => {
    if (!backgroundColor) return theme.background?.val || '#ffffff';

    if (backgroundColor.startsWith('$')) {
      try {
        return getToken(backgroundColor.slice(1) as Token) || theme.background?.val || '#ffffff';
      } catch {
        return theme.background?.val || '#ffffff';
      }
    }

    return backgroundColor;
  }, [backgroundColor, theme.background]);

  const resolvedLargeTitleColor = useMemo(() => {
    if (!largeTitleColor) return theme.color?.val || '#000000';

    if (largeTitleColor.startsWith('$')) {
      try {
        return getToken(largeTitleColor.slice(1) as Token) || theme.color?.val || '#000000';
      } catch {
        return theme.color?.val || '#000000';
      }
    }

    return largeTitleColor;
  }, [largeTitleColor, theme.color]);

  const headerTitleOpacity = useMemo(() => scrollY.interpolate({
    inputRange: [60, 65],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  }), [scrollY]);

  const headerBorderOpacity = useMemo(() => scrollY.interpolate({
    inputRange: [60, 65],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  }), [scrollY]);

  const largeTitleTranslateY = useMemo(() => scrollY.interpolate({
    inputRange: [0, 65],
    outputRange: [0, -65],
    extrapolate: 'clamp',
  }), [scrollY]);

  const blurOpacity = useMemo(() => scrollY.interpolate({
    inputRange: [0, 30],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  }), [scrollY]);

  const shadowOpacityInterpolation = useMemo(() =>
    headerBorderOpacity.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.22],
      extrapolate: 'clamp',
    }), [headerBorderOpacity]);

  const elevationInterpolation = useMemo(() =>
    headerBorderOpacity.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    }), [headerBorderOpacity]);

  const containerStyle = useMemo(() => ({
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
  }), []);

  const largeTitleContainerStyle = useMemo(() => ({
    position: 'absolute' as const,
    top: insets.top + DEFAULT_HEADER_HEIGHT,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 8,
    zIndex: 1,
    backgroundColor: resolvedBackgroundColor,
  }), [insets.top, resolvedBackgroundColor]);

  const headerContainerBaseStyle = useMemo(() => ({
    paddingTop: insets.top,
    height: DEFAULT_HEADER_HEIGHT + insets.top,
    zIndex: 1000,
    backgroundColor: enableBlur ? 'transparent' : resolvedBackgroundColor,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0.5,
    },
    shadowRadius: 0.22,
  }), [resolvedBackgroundColor, insets.top, enableBlur]);

  const borderStyle = useMemo(() => ({
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    height: 0.5,
    backgroundColor: 'transparent',
  }), [theme.borderColor]);

  const leftIconContainerStyle = useMemo(() => ({
    position: 'absolute' as const,
    zIndex: 1,
    alignItems: 'center' as const,
    justifyContent: 'flex-start' as const,
  }), []);

  const rightIconContainerStyle = useMemo(() => ({
    position: 'absolute' as const,
    right: 0,
    zIndex: 1,
    alignItems: 'center' as const,
    justifyContent: 'flex-end' as const,
  }), []);

  const titleContainerStyle = useMemo(() => ({
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  }), []);

  const handleBack = useCallback(() => {
    if (onBack) return onBack();
    router.back();
  }, [onBack, router]);

  return (
    <View style={containerStyle}>
      {/* Título grande - sempre com background sólido */}
      <Animated.View
        style={[
          largeTitleContainerStyle,
          {transform: [{translateY: largeTitleTranslateY}]}
        ]}
      >
        <Text
          fontSize="$9"
          fontWeight="700"
          numberOfLines={1}
          ellipsizeMode="tail"
          color={resolvedLargeTitleColor}
        >
          {title}
        </Text>
      </Animated.View>

      {/* Header fixo - com ou sem blur */}
      {enableBlur ? (
        <Animated.View style={[headerContainerBaseStyle, {opacity: blurOpacity}]}>
          <BlurView
            intensity={blurIntensity}
            tint={blurTint}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />
          <XStack height={DEFAULT_HEADER_HEIGHT} alignItems="center">
            <XStack style={leftIconContainerStyle}>
              <IconButton onPress={handleBack} a11yLabel="Voltar">
                <ArrowLeft size={22} color="$color"/>
              </IconButton>
            </XStack>

            <Animated.View
              style={[
                titleContainerStyle,
                {opacity: headerTitleOpacity}
              ]}
            >
              <Text
                fontSize="$5"
                fontWeight="600"
                numberOfLines={1}
                ellipsizeMode="tail"
                color="$color"
              >
                {title}
              </Text>
            </Animated.View>

            <XStack style={rightIconContainerStyle}>
              {showRight && rightIcon ? (
                <IconButton onPress={onRightPress} a11yLabel="Ação do header">
                  {rightIcon}
                </IconButton>
              ) : null}
            </XStack>
          </XStack>

          <Animated.View
            style={[
              borderStyle,
              {opacity: headerBorderOpacity}
            ]}
          />
        </Animated.View>
      ) : (
        <Animated.View
          style={[
            headerContainerBaseStyle,
            {
              shadowOpacity: Platform.select({
                ios: shadowOpacityInterpolation,
                default: undefined,
              }),
              elevation: Platform.select({
                android: elevationInterpolation,
                default: undefined,
              }),
            }
          ]}
        >
          <XStack height={DEFAULT_HEADER_HEIGHT} alignItems="center">
            <XStack style={leftIconContainerStyle}>
              <IconButton onPress={handleBack} a11yLabel="Voltar">
                <ArrowLeft size={22} color="$color"/>
              </IconButton>
            </XStack>

            <Animated.View
              style={[
                titleContainerStyle,
                {opacity: headerTitleOpacity}
              ]}
            >
              <Text
                fontSize="$5"
                fontWeight="600"
                numberOfLines={1}
                ellipsizeMode="tail"
                color="$color"
              >
                {title}
              </Text>
            </Animated.View>

            <XStack style={rightIconContainerStyle}>
              {showRight && rightIcon ? (
                <IconButton onPress={onRightPress} a11yLabel="Ação do header">
                  {rightIcon}
                </IconButton>
              ) : null}
            </XStack>
          </XStack>

          <Animated.View
            style={[
              borderStyle,
              {opacity: headerBorderOpacity}
            ]}
          />
        </Animated.View>
      )}
    </View>
  );
});

CollapsibleHeader.displayName = 'CollapsibleHeader';

export function useCollapsibleHeader() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<any>(null);
  const isSnapping = useRef(false);
  const snapTimeoutRef = useRef<number | null>(null);

  const onScroll = useMemo(() => Animated.event(
    [{nativeEvent: {contentOffset: {y: scrollY}}}],
    {useNativeDriver: false}
  ), [scrollY]);

  const performSnap = useCallback((offsetY: number) => {
    if (isSnapping.current || !flatListRef.current) return;

    const targetY = offsetY > 25 ? 65 : 0;
    isSnapping.current = true;

    flatListRef.current.scrollToOffset({
      offset: targetY,
      animated: true
    });

    if (snapTimeoutRef.current) {
      clearTimeout(snapTimeoutRef.current);
    }

    snapTimeoutRef.current = setTimeout(() => {
      isSnapping.current = false;
      snapTimeoutRef.current = null;
    }, 300);
  }, []);

  const onMomentumScrollEnd = useCallback((event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY > 0 && offsetY < 50) {
      performSnap(offsetY);
    }
  }, [performSnap]);

  const onScrollEndDrag = useCallback((event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY > 0 && offsetY < 50) {
      performSnap(offsetY);
    }
  }, [performSnap]);

  const totalHeaderHeight = useMemo(() =>
      insets.top + DEFAULT_HEADER_HEIGHT + 20 + 40,
    [insets.top]
  );

  React.useEffect(() => {
    return () => {
      if (snapTimeoutRef.current) {
        clearTimeout(snapTimeoutRef.current);
      }
    };
  }, []);

  return {
    scrollY,
    onScroll,
    onScrollEndDrag,
    onMomentumScrollEnd,
    flatListRef,
    paddingTop: totalHeaderHeight,
  };
}
