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

  // NOVO: Props para footer
  footer?: React.ReactNode;
  footerHeight?: number; // Altura estimada do footer para calcular padding
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

                                                                            // NOVO
                                                                            footer,
                                                                            footerHeight = 100, // Altura padrão do footer + padding
                                                                          }) => {
  const insets = useSafeAreaInsets();
  const headerHeight = insets.top + DEFAULT_HEADER_HEIGHT;

  // Calcular padding bottom se houver footer
  const bottomPadding = footer ? footerHeight : 0;

  const scrollContent = (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <YStack flex={1}>
        {children}
      </YStack>
    </TouchableWithoutFeedback>
  );

  return (
    <YStack flex={1} backgroundColor="$background">
      {hasKeyboardInputs ? (
        <KeyboardAwareScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: headerHeight,
              paddingBottom: bottomPadding, // NOVO
            },
            contentContainerStyle,
          ]}
          enableAutomaticScroll={true}
          enableOnAndroid={true}
          extraScrollHeight={footer ? footerHeight + 20 : 20} // MODIFICADO
          keyboardShouldPersistTaps={keyboardShouldPersistTaps}
          scrollEnabled={scrollEnabled}
          showsVerticalScrollIndicator={showsVerticalScrollIndicator}
          scrollEventThrottle={16}
        >
          {scrollContent}
        </KeyboardAwareScrollView>
      ) : (
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: headerHeight,
              paddingBottom: bottomPadding, // NOVO
            },
            contentContainerStyle,
          ]}
          scrollEnabled={scrollEnabled}
          showsVerticalScrollIndicator={showsVerticalScrollIndicator}
          bounces={Platform.OS === 'ios'}
          scrollEventThrottle={16}
          decelerationRate="fast"
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
});
