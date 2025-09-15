import React, {useEffect, useRef} from 'react';
import {YStack} from 'tamagui';
import {
  Animated,
  Easing,
  Keyboard,
  KeyboardAvoidingView,
  KeyboardEvent,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface BaseScreenWrapperProps {
  children: React.ReactNode;
  behavior?: 'padding' | 'height' | 'position';
  keyboardVerticalOffset?: number;
  enableKeyboardAnimation?: boolean;
}

export const BaseScreenWrapper: React.FC<BaseScreenWrapperProps> = ({
                                                                      children,
                                                                      behavior = Platform.OS === 'ios' ? 'padding' : 'height',
                                                                      keyboardVerticalOffset,
                                                                      enableKeyboardAnimation = true,
                                                                    }) => {
  const insets = useSafeAreaInsets();
  const keyboardHeight = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  const defaultOffset = Platform.OS === 'ios'
    ? insets.top + 20
    : 0;

  const finalOffset = keyboardVerticalOffset ?? defaultOffset;

  useEffect(() => {
    if (!enableKeyboardAnimation) return;

    const keyboardWillShow = (event: KeyboardEvent) => {
      const duration = Platform.OS === 'ios' ? event.duration || 250 : 250;

      Animated.timing(keyboardHeight, {
        duration,
        toValue: event.endCoordinates.height,
        easing: Easing.bezier(0.17, 0.59, 0.4, 0.77),
        useNativeDriver: false,
      }).start();
    };

    const keyboardWillHide = (event: KeyboardEvent) => {
      const duration = Platform.OS === 'ios' ? event.duration || 250 : 250;

      Animated.timing(keyboardHeight, {
        duration,
        toValue: 0,
        easing: Easing.bezier(0.17, 0.59, 0.4, 0.77),
        useNativeDriver: false,
      }).start();
    };

    const keyboardDidShow = (event: KeyboardEvent) => {
      if (Platform.OS === 'android') {
        Animated.timing(keyboardHeight, {
          duration: 250,
          toValue: event.endCoordinates.height,
          easing: Easing.bezier(0.17, 0.59, 0.4, 0.77),
          useNativeDriver: false,
        }).start();
      }
    };

    const keyboardDidHide = () => {
      if (Platform.OS === 'android') {
        Animated.timing(keyboardHeight, {
          duration: 250,
          toValue: 0,
          easing: Easing.bezier(0.17, 0.59, 0.4, 0.77),
          useNativeDriver: false,
        }).start();
      }
    };

    const listeners = [
      Keyboard.addListener(
        Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
        Platform.OS === 'ios' ? keyboardWillShow : keyboardDidShow
      ),
      Keyboard.addListener(
        Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
        Platform.OS === 'ios' ? keyboardWillHide : keyboardDidHide
      ),
    ];

    return () => {
      listeners.forEach(listener => listener?.remove());
    };
  }, [keyboardHeight, enableKeyboardAnimation]);

  if (enableKeyboardAnimation) {
    return (
      <YStack flex={1} backgroundColor="$baseBackgroundHover">
        <Animated.View
          style={{
            flex: 1,
            paddingBottom: keyboardHeight,
          }}
        >
          <ScrollView
            ref={scrollViewRef}
            style={{flex: 1}}
            contentContainerStyle={{flexGrow: 1}}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            scrollEnabled={true}
            bounces={false}
            bouncesZoom={false}
            alwaysBounceVertical={false}
            alwaysBounceHorizontal={false}
            overScrollMode="never"
            decelerationRate="fast"
            scrollEventThrottle={16}
            automaticallyAdjustContentInsets={false}
            contentInsetAdjustmentBehavior="never"
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              {children}
            </TouchableWithoutFeedback>
          </ScrollView>
        </Animated.View>
      </YStack>
    );
  }

  return (
    <YStack flex={1} backgroundColor="$baseBackgroundHover">
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={behavior}
        keyboardVerticalOffset={finalOffset}
      >
        <ScrollView
          ref={scrollViewRef}
          style={{flex: 1}}
          contentContainerStyle={{flexGrow: 1}}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
          bounces={false}
          bouncesZoom={false}
          alwaysBounceVertical={false}
          alwaysBounceHorizontal={false}
          overScrollMode="never"
          decelerationRate="fast"
          scrollEventThrottle={16}
          automaticallyAdjustContentInsets={false}
          contentInsetAdjustmentBehavior="never"
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            {children}
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    </YStack>
  );
};
