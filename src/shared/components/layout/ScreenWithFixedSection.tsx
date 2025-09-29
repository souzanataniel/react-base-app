import React, {useMemo} from 'react';
import {YStack, View, XStack, Text} from 'tamagui';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Platform, Pressable, StyleSheet} from 'react-native';
import {ArrowLeft} from '@tamagui/lucide-icons';
import {useRouter} from 'expo-router';
import {useTabBarHeight} from '@/shared/components/ui/AnimatedTabBar/hooks/useTabBarHeight';

const DEFAULT_HEADER_HEIGHT = Platform.select({ios: 44, android: 56, default: 56});
const SIDE_WIDTH = 56;
const HIT_SLOP = {top: 8, bottom: 8, left: 8, right: 8};

interface ScreenWithFixedSectionProps {
  children: React.ReactNode;
  title: string;

  // Header props
  leftIcon?: React.ReactNode;
  onLeftPress?: () => void;
  onBack?: () => void;
  rightIcon?: React.ReactNode;
  onRightPress?: () => void;
  showRight?: boolean;
  hideBackButton?: boolean;

  // Fixed section props
  fixedContent?: React.ReactNode;
  fixedContentHeight?: number;

  hasTabBar?: boolean;
  customBottomPadding?: number;
}

/**
 * Componente de tela com header fixo e seção fixa opcional abaixo.
 *
 * @example
 * <ScreenWithFixedSection
 *   title="Notificações"
 *   onBack={() => router.back()}
 *   fixedContent={<TabSelector />}
 *   fixedContentHeight={70}
 * >
 *   <FlatList data={items} renderItem={...} />
 * </ScreenWithFixedSection>
 */
export const ScreenWithFixedSection: React.FC<ScreenWithFixedSectionProps> = ({
                                                                                children,
                                                                                title,
                                                                                leftIcon,
                                                                                onLeftPress,
                                                                                onBack,
                                                                                rightIcon,
                                                                                onRightPress,
                                                                                showRight = !!rightIcon,
                                                                                hideBackButton = false,
                                                                                fixedContent,
                                                                                fixedContentHeight = 0,
                                                                                hasTabBar = true,
                                                                                customBottomPadding,
                                                                              }) => {
  const insets = useSafeAreaInsets();
  const {tabBarHeight} = useTabBarHeight();
  const router = useRouter();

  const headerHeight = insets.top + DEFAULT_HEADER_HEIGHT;
  const totalTopSpace = headerHeight + fixedContentHeight;

  const bottomPadding = useMemo(() => {
    // Se há padding customizado, use ele
    if (customBottomPadding !== undefined) {
      return customBottomPadding;
    }

    if (!hasTabBar) {
      return Platform.select({
        ios: insets.bottom || 0,
        android: Math.max(insets.bottom || 0, 20),
      });
    }

    if (Platform.OS === 'ios') {
      return tabBarHeight + 16;
    } else {
      const androidMinimum = 90;
      const calculatedPadding = tabBarHeight + 40;
      return Math.max(calculatedPadding, androidMinimum);
    }
  }, [hasTabBar, tabBarHeight, insets.bottom, customBottomPadding]);

  const handleLeft = () => {
    if (onLeftPress) return onLeftPress();
    if (onBack) return onBack();
    router.back();
  };

  return (
    <YStack flex={1} backgroundColor="$background">
      {/* Conteúdo principal */}
      <View
        flex={1}
        paddingTop={totalTopSpace}
        paddingBottom={bottomPadding}
      >
        {children}
      </View>

      {/* Header fixo */}
      <YStack
        position="absolute"
        top={0}
        left={0}
        right={0}
        zIndex={999}
        height={headerHeight}
        paddingTop={insets.top}
        backgroundColor="$card"
        style={styles.shadow}
      >
        <XStack height={DEFAULT_HEADER_HEIGHT} alignItems="center">
          <XStack width={SIDE_WIDTH} alignItems="center" justifyContent="flex-start" paddingLeft="$1">
            {!hideBackButton && (
              <Pressable
                hitSlop={HIT_SLOP}
                onPress={handleLeft}
                style={({pressed}) => [
                  styles.iconButton,
                  pressed && {opacity: 0.6},
                ]}
              >
                {leftIcon ?? <ArrowLeft size={22} color="$color"/>}
              </Pressable>
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
            {showRight && rightIcon && (
              <Pressable
                hitSlop={HIT_SLOP}
                onPress={onRightPress}
                style={({pressed}) => [
                  styles.iconButton,
                  pressed && {opacity: 0.6},
                ]}
              >
                {rightIcon}
              </Pressable>
            )}
          </XStack>
        </XStack>
      </YStack>

      {/* Fixed content abaixo do header */}
      {fixedContent && (
        <View
          position="absolute"
          top={headerHeight}
          left={0}
          right={0}
          zIndex={998}
          backgroundColor="$card"
        >
          {fixedContent}
        </View>
      )}
    </YStack>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0.5},
    shadowOpacity: 0.22,
    shadowRadius: 0.22,
    elevation: 1,
  },
  iconButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 9999,
  },
});
