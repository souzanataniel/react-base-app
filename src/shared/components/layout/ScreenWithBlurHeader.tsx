import React from 'react';
import {YStack} from 'tamagui';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Keyboard, Platform, ScrollView, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {BasicHeader} from '@/shared/components/ui/Header/BasicHeader';

const DEFAULT_HEADER_HEIGHT = Platform.select({ios: 44, android: 56, default: 56});

interface ScreenWithBlurHeaderProps {
  children: React.ReactNode;
  title: string;

  leftIcon?: React.ReactNode;
  onLeftPress?: () => void;
  onBack?: () => void;
  rightIcon?: React.ReactNode;
  onRightPress?: () => void;
  showRight?: boolean;
  enableBlur?: boolean;
  blurIntensity?: number;
  blurTint?: 'light' | 'dark' | 'default';

  scrollEnabled?: boolean;
  hasKeyboardInputs?: boolean;
  contentContainerStyle?: object;
  showsVerticalScrollIndicator?: boolean;
  keyboardShouldPersistTaps?: 'always' | 'never' | 'handled';

  footer?: React.ReactNode;
  footerHeight?: number;
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
                                                                            enableBlur = true,
                                                                            blurIntensity = 80,
                                                                            blurTint = 'default',
                                                                            scrollEnabled = true,
                                                                            hasKeyboardInputs = false,
                                                                            contentContainerStyle,
                                                                            showsVerticalScrollIndicator = false,
                                                                            keyboardShouldPersistTaps = 'handled',
                                                                            footer,
                                                                            footerHeight = 100,
                                                                          }) => {
  const insets = useSafeAreaInsets();
  const headerHeight = insets.top + DEFAULT_HEADER_HEIGHT;

  // Calcular padding bottom considerando safe area
  const bottomPadding = footer
    ? footerHeight + (Platform.OS === 'android' ? Math.max(insets.bottom || 0, 16) : (insets.bottom || 0))
    : Platform.OS === 'android' ? Math.max(insets.bottom || 0, 16) : (insets.bottom || 0);

  const scrollContent = (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <YStack flex={1} paddingTop={headerHeight} paddingBottom={bottomPadding}>
        {children}
      </YStack>
    </TouchableWithoutFeedback>
  );

  // Estilo base para o scroll - removendo flexGrow no Android
  const baseScrollStyle = [
    Platform.OS === 'android' ? {} : styles.scrollContent,
    {
      paddingTop: headerHeight,
      paddingBottom: bottomPadding,
    },
    contentContainerStyle,
  ];

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
        >
          {scrollContent}
        </KeyboardAwareScrollView>
      ) : (
        <ScrollView
          scrollEnabled={scrollEnabled}
          showsVerticalScrollIndicator={showsVerticalScrollIndicator}
          bounces={Platform.OS === 'ios'}
          scrollEventThrottle={16}
          decelerationRate="fast"
          style={styles.scrollView}
        >
          {scrollContent}
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
          enableBlur={enableBlur}
          blurIntensity={blurIntensity}
          blurTint={blurTint}
        />
      </YStack>

      {/* Footer fixo no fundo */}
      {footer && (
        <YStack
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          zIndex={998}
        >
          {footer}
        </YStack>
      )}
    </YStack>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  scrollView: {
    flex: 1,
  },
});
