import React, {useMemo} from 'react';
import {YStack} from 'tamagui';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {BasicHeader} from '@/shared/components/ui/Header/BasicHeader';
import {useTabBarHeight} from '@/shared/components/ui/AnimatedTabBar/hooks/useTabBarHeight';

const DEFAULT_HEADER_HEIGHT = Platform.select({ios: 44, android: 44, default: 44});

interface ScreenWithBlurHeaderProps {
  children: React.ReactNode;
  title: string;

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

  scrollEnabled?: boolean;
  hasKeyboardInputs?: boolean;
  contentContainerStyle?: object;
  showsVerticalScrollIndicator?: boolean;
  keyboardShouldPersistTaps?: 'always' | 'never' | 'handled';

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

  const bottomPadding = useMemo(() => {
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
  }, [hasTabBar, tabBarHeight, insets.bottom]);

  const additionalPadding = Platform.select({
    ios: 0,
    android: hasTabBar ? 24 : 0,
    default: 0
  });

  const scrollViewStyle = useMemo(() => ({
    flex: 1,
    backgroundColor: 'transparent',
  }), []);

  const contentStyle = useMemo(() => {
    const totalBottomSpace = (bottomPadding ?? 0) + additionalPadding;

    return [
      {
        flexGrow: 1,
        paddingTop: headerHeight,
        paddingBottom: Platform.select({
          ios: totalBottomSpace,
          android: hasTabBar
            ? totalBottomSpace + 20
            : totalBottomSpace,
        }),
      },
      contentContainerStyle,
    ];
  }, [headerHeight, bottomPadding, additionalPadding, hasTabBar, contentContainerStyle]);

  const renderContentWithSpacer = () => (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{flex: 1}}>
        {children}
        {Platform.OS === 'android' && hasTabBar && (
          <View style={{
            height: 40,
            backgroundColor: 'transparent'
          }}/>
        )}
      </View>
    </TouchableWithoutFeedback>
  );

  const renderIOS = () => {
    if (hasKeyboardInputs) {
      return (
        <KeyboardAwareScrollView
          enableAutomaticScroll={true}
          enableOnAndroid={false}
          extraScrollHeight={20}
          extraHeight={Platform.select({ios: 40, default: 0})}
          keyboardShouldPersistTaps={keyboardShouldPersistTaps}
          scrollEnabled={scrollEnabled}
          showsVerticalScrollIndicator={showsVerticalScrollIndicator}
          scrollEventThrottle={16}
          style={scrollViewStyle}
          contentContainerStyle={contentStyle}
          bounces={true}
        >
          {renderContentWithSpacer()}
        </KeyboardAwareScrollView>
      );
    }

    return (
      <ScrollView
        scrollEnabled={scrollEnabled}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        bounces={true}
        scrollEventThrottle={16}
        decelerationRate="fast"
        style={scrollViewStyle}
        contentContainerStyle={contentStyle}
      >
        {renderContentWithSpacer()}
      </ScrollView>
    );
  };

  const renderAndroid = () => {
    const androidScrollProps = {
      scrollEnabled,
      showsVerticalScrollIndicator,
      scrollEventThrottle: 16,
      style: [scrollViewStyle, {paddingBottom: 0}],
      contentContainerStyle: contentStyle,
      nestedScrollEnabled: true,
      overScrollMode: 'never' as const,
      bounces: false,
      endFillColor: 'transparent',
      fadingEdgeLength: 0,
    };

    const contentWithExtraSpace = (
      <View style={{flex: 1}}>
        {renderContentWithSpacer()}
        {hasTabBar && (
          <View style={{height: 30, backgroundColor: 'transparent'}}/>
        )}
      </View>
    );

    if (hasKeyboardInputs) {
      return (
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior="padding"
          keyboardVerticalOffset={0}
        >
          <KeyboardAwareScrollView
            {...androidScrollProps}
            enableAutomaticScroll={true}
            enableOnAndroid={true}
            extraScrollHeight={30}
            extraHeight={50}
            keyboardShouldPersistTaps={keyboardShouldPersistTaps}
          >
            {contentWithExtraSpace}
          </KeyboardAwareScrollView>
        </KeyboardAvoidingView>
      );
    }

    return (
      <ScrollView
        {...androidScrollProps}
        contentInset={{bottom: 0}}
        scrollIndicatorInsets={{bottom: 0}}
      >
        {contentWithExtraSpace}
      </ScrollView>
    );
  };

  return (
    <YStack flex={1} backgroundColor="$background">
      {Platform.OS === 'ios' ? renderIOS() : renderAndroid()}
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
