import React, {useEffect, useRef} from 'react';
import {YStack} from 'tamagui';
import {Animated, Easing, Keyboard, Platform, TouchableWithoutFeedback,} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

interface BaseScreenWrapperProps {
  children: React.ReactNode;
  extraScrollHeight?: number;
  keyboardOpeningTime?: number;
  enableAutomaticScroll?: boolean;
  scrollEnabled?: boolean;
  contentContainerStyle?: object;
  keyboardShouldPersistTaps?: 'always' | 'never' | 'handled';
  enableKeyboardAnimation?: boolean;
  animationDuration?: number;
}

export const BaseScreenWrapper: React.FC<BaseScreenWrapperProps> = ({
                                                                      children,
                                                                      extraScrollHeight = 20,
                                                                      keyboardOpeningTime = 250,
                                                                      enableAutomaticScroll = true,
                                                                      scrollEnabled = true,
                                                                      contentContainerStyle,
                                                                      keyboardShouldPersistTaps = 'handled',
                                                                      enableKeyboardAnimation = true,
                                                                      animationDuration = 300,
                                                                    }) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!enableKeyboardAnimation) return;

    const keyboardWillShow = () => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0.95,
          duration: keyboardOpeningTime,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.98,
          duration: keyboardOpeningTime,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    };

    const keyboardWillHide = () => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: animationDuration,
          easing: Easing.out(Easing.back(1.1)),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: animationDuration,
          easing: Easing.out(Easing.back(1.1)),
          useNativeDriver: true,
        }),
      ]).start();
    };

    const listeners = [
      Keyboard.addListener(
        Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
        Platform.OS === 'ios' ? keyboardWillShow : keyboardWillShow
      ),
      Keyboard.addListener(
        Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
        Platform.OS === 'ios' ? keyboardWillHide : keyboardWillHide
      ),
    ];

    return () => {
      listeners.forEach(listener => listener?.remove());
    };
  }, [fadeAnim, scaleAnim, keyboardOpeningTime, animationDuration, enableKeyboardAnimation]);

  return (
    <YStack flex={1} backgroundColor="$baseBackground">
      <Animated.View
        style={{
          flex: 1,
          opacity: enableKeyboardAnimation ? fadeAnim : 1,
          transform: enableKeyboardAnimation
            ? [{scale: scaleAnim}]
            : undefined,
        }}
      >
        <KeyboardAwareScrollView
          contentContainerStyle={[
            {flexGrow: 1},
            contentContainerStyle,
          ]}

          extraScrollHeight={extraScrollHeight}
          keyboardOpeningTime={keyboardOpeningTime}
          enableAutomaticScroll={enableAutomaticScroll}
          enableOnAndroid={true}
          enableResetScrollToCoords={false}
          keyboardShouldPersistTaps={keyboardShouldPersistTaps}

          scrollEnabled={scrollEnabled}
          showsVerticalScrollIndicator={false}
          bounces={Platform.OS === 'ios'}
          bouncesZoom={false}
          alwaysBounceVertical={false}
          alwaysBounceHorizontal={false}
          overScrollMode="never"
          decelerationRate="fast"
          scrollEventThrottle={16}

          automaticallyAdjustContentInsets={false}
          contentInsetAdjustmentBehavior="never"
          viewIsInsideTabBar={false}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <YStack flex={1}>
              {children}
            </YStack>
          </TouchableWithoutFeedback>
        </KeyboardAwareScrollView>
      </Animated.View>
    </YStack>
  );
};
