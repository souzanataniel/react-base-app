import React from 'react';
import {YStack} from 'tamagui';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Keyboard, Platform, ScrollView, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {BasicHeader} from '@/shared/components/ui/Header/BasicHeader';
import {useTabBarHeight} from '@/shared/components/ui/AnimatedTabBar/hooks/useTabBarHeight';

const DEFAULT_HEADER_HEIGHT = Platform.select({ios: 44, android: 56, default: 56});

interface ScreenWithBlurHeaderProps {
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
  enableBlur?: boolean;
  blurIntensity?: number;
  blurTint?: 'light' | 'dark' | 'default';

  // Scroll props
  scrollEnabled?: boolean;
  hasKeyboardInputs?: boolean;
  contentContainerStyle?: object;
  showsVerticalScrollIndicator?: boolean;
  keyboardShouldPersistTaps?: 'always' | 'never' | 'handled';

  // Tab bar
  hasTabBar?: boolean;
}

export const ScreenWithBlurHeader: React.FC<ScreenWithBlurHeaderProps> = ({
                                                                            children,
                                                                            title,
                                                                            leftIcon,
                                                                            onLeftPress,
                                                                            onBack,
                                                                            rightIcon,
                                                                            onRightPress,
                                                                            showRight,
                                                                            hideBackButton,
                                                                            enableBlur = true,
                                                                            blurIntensity = 80,
                                                                            blurTint,
                                                                            scrollEnabled = true,
                                                                            hasKeyboardInputs = false,
                                                                            contentContainerStyle,
                                                                            showsVerticalScrollIndicator = false,
                                                                            keyboardShouldPersistTaps = 'handled',
                                                                            hasTabBar = true,
                                                                          }) => {
  const insets = useSafeAreaInsets();
  const {tabBarHeight} = useTabBarHeight();
  const headerHeight = insets.top + DEFAULT_HEADER_HEIGHT;

  const bottomPadding = hasTabBar ? tabBarHeight + 16 : (insets.bottom || 0);

  return (
    <YStack flex={1} backgroundColor="$background">
      {hasKeyboardInputs ? (
        <KeyboardAwareScrollView
          enableAutomaticScroll={true}
          enableOnAndroid={true}
          extraScrollHeight={0}
          extraHeight={0}
          keyboardShouldPersistTaps={keyboardShouldPersistTaps}
          scrollEnabled={scrollEnabled}
          showsVerticalScrollIndicator={showsVerticalScrollIndicator}
          scrollEventThrottle={16}
          style={styles.scrollView}
          contentContainerStyle={[
            {
              paddingTop: headerHeight,
              paddingBottom: bottomPadding,
            },
            contentContainerStyle,
          ]}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <YStack flex={1}>
              {children}
            </YStack>
          </TouchableWithoutFeedback>
        </KeyboardAwareScrollView>
      ) : (
        <ScrollView
          scrollEnabled={scrollEnabled}
          showsVerticalScrollIndicator={showsVerticalScrollIndicator}
          bounces={Platform.OS === 'ios'}
          scrollEventThrottle={16}
          decelerationRate="fast"
          style={styles.scrollView}
          contentContainerStyle={[
            {
              paddingTop: headerHeight,
              paddingBottom: bottomPadding,
            },
            contentContainerStyle,
          ]}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <YStack flex={1}>
              {children}
            </YStack>
          </TouchableWithoutFeedback>
        </ScrollView>
      )}

      {/* Header fixo no topo */}
      <YStack
        position="absolute"
        top={0}
        left={0}
        right={0}
        zIndex={999}
      >
        <BasicHeader
          title={title}
          leftIcon={leftIcon}
          onLeftPress={onLeftPress}
          onBack={onBack}
          rightIcon={rightIcon}
          onRightPress={onRightPress}
          showRight={showRight}
          hideBackButton={hideBackButton}
          enableBlur={enableBlur}
          blurIntensity={blurIntensity}
          blurTint={blurTint}
        />
      </YStack>
    </YStack>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
});
