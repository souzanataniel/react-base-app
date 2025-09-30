import React, {useMemo} from 'react';
import {YStack} from 'tamagui';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Keyboard, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {BasicHeader} from '@/shared/components/ui/Header/BasicHeader';
import {useTabBarHeight} from '@/shared/components/ui/AnimatedTabBar/hooks/useTabBarHeight';

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
  hideBackButton?: boolean;
  scrollEnabled?: boolean;
  hasKeyboardInputs?: boolean;
  contentContainerStyle?: object;
  showsVerticalScrollIndicator?: boolean;
  keyboardShouldPersistTaps?: 'always' | 'never' | 'handled';
  hasTabBar?: boolean;
}

export const ScreenWithHeader: React.FC<ScreenWithBlurHeaderProps> = ({
                                                                            children,
                                                                            title,
                                                                            leftIcon,
                                                                            onLeftPress,
                                                                            onBack,
                                                                            rightIcon,
                                                                            onRightPress,
                                                                            showRight,
                                                                            hideBackButton,
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

  const contentStyle = useMemo(() => [
    {
      flexGrow: 1,
      paddingTop: headerHeight,
      paddingBottom: bottomPadding,
    },
    contentContainerStyle,
  ], [headerHeight, bottomPadding, contentContainerStyle]);

  const renderContent = () => (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{flex: 1}}>
        {children}
      </View>
    </TouchableWithoutFeedback>
  );

  const scrollViewProps = {
    scrollEnabled,
    showsVerticalScrollIndicator,
    scrollEventThrottle: 16,
    contentContainerStyle: contentStyle,
    style: {flex: 1, backgroundColor: 'transparent'},
  };

  const renderScrollView = () => {
    if (hasKeyboardInputs) {
      return (
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          <KeyboardAwareScrollView
            {...scrollViewProps}
            enableAutomaticScroll={true}
            enableOnAndroid={Platform.OS === 'android'}
            extraScrollHeight={Platform.select({ios: 20, android: 30})}
            extraHeight={Platform.select({ios: 40, android: 50})}
            keyboardShouldPersistTaps={keyboardShouldPersistTaps}
            bounces={Platform.OS === 'ios'}
            overScrollMode={Platform.OS === 'android' ? 'never' : undefined}
          >
            {renderContent()}
          </KeyboardAwareScrollView>
        </KeyboardAvoidingView>
      );
    }

    return (
      <ScrollView
        {...scrollViewProps}
        bounces={Platform.OS === 'ios'}
        decelerationRate={Platform.OS === 'ios' ? 'fast' : 'normal'}
        overScrollMode={Platform.OS === 'android' ? 'never' : undefined}
        nestedScrollEnabled={Platform.OS === 'android'}
      >
        {renderContent()}
      </ScrollView>
    );
  };

  return (
    <YStack flex={1} backgroundColor="$background">
      {renderScrollView()}
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
        />
      </YStack>
    </YStack>
  );
};
