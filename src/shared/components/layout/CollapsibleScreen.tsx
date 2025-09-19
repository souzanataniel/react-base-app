import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {Animated} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {getToken, Token, useTheme} from 'tamagui';
import {useFocusEffect} from '@react-navigation/native';
import {CollapsibleHeader} from '@/shared/components/ui/Header/CollapsibleHeader';

type CollapsibleScreenProps = {
  title: string;
  onBack?: () => void;
  rightIcon?: React.ReactNode;
  onRightPress?: () => void;
  showRight?: boolean;
  backgroundColor?: string;
  largeTitleColor?: string;
  children: React.ReactNode;
  showsVerticalScrollIndicator?: boolean;
  contentContainerStyle?: any;
  resetOnFocus?: boolean;
  enableSnap?: boolean;
};

export const CollapsibleScreen = ({
                                    title,
                                    onBack,
                                    rightIcon,
                                    onRightPress,
                                    showRight,
                                    backgroundColor,
                                    largeTitleColor,
                                    children,
                                    showsVerticalScrollIndicator = false,
                                    contentContainerStyle,
                                    resetOnFocus = true,
                                    enableSnap = true,
                                  }: CollapsibleScreenProps) => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<any>(null);
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const isSnapping = useRef(false);
  const snapTimeoutRef = useRef<number | null>(null);

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

  const onScroll = useMemo(() => Animated.event(
    [{nativeEvent: {contentOffset: {y: scrollY}}}],
    {useNativeDriver: false}
  ), [scrollY]);

  const paddingTop = useMemo(() =>
      insets.top + 44 + 60,
    [insets.top]
  );

  const mergedContentContainerStyle = useMemo(() => ({
    paddingTop,
    ...contentContainerStyle,
  }), [paddingTop, contentContainerStyle]);

  const performSnap = useCallback((offsetY: number) => {
    if (!enableSnap || isSnapping.current || !scrollViewRef.current) return;

    const targetY = offsetY > 25 ? 65 : 0;
    isSnapping.current = true;

    scrollViewRef.current.scrollTo({
      y: targetY,
      animated: true
    });

    if (snapTimeoutRef.current) {
      clearTimeout(snapTimeoutRef.current);
    }

    snapTimeoutRef.current = setTimeout(() => {
      isSnapping.current = false;
      snapTimeoutRef.current = null;
    }, 300);
  }, [enableSnap]);

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

  useFocusEffect(
    React.useCallback(() => {
      if (resetOnFocus) {
        scrollY.setValue(0);

        setTimeout(() => {
          if (scrollViewRef.current && scrollViewRef.current.scrollTo) {
            scrollViewRef.current.scrollTo({y: 0, animated: false});
          }
        }, 0);
      }
    }, [scrollY, resetOnFocus])
  );

  useEffect(() => {
    if (resetOnFocus) {
      scrollY.setValue(0);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (snapTimeoutRef.current) {
        clearTimeout(snapTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <CollapsibleHeader
        title={title}
        onBack={onBack}
        rightIcon={rightIcon}
        onRightPress={onRightPress}
        showRight={showRight}
        backgroundColor={resolvedBackgroundColor}
        scrollY={scrollY}
        largeTitleColor={resolvedLargeTitleColor}
        enableBlur={true}
        blurIntensity={80}
        blurTint="default"
      />

      <Animated.ScrollView
        ref={scrollViewRef}
        onScroll={onScroll}
        onMomentumScrollEnd={onMomentumScrollEnd}
        onScrollEndDrag={onScrollEndDrag}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        contentContainerStyle={mergedContentContainerStyle}
      >
        {children}
      </Animated.ScrollView>
    </>
  );
};
