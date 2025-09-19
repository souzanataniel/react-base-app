import React from 'react';
import {YStack} from 'tamagui';
import {Keyboard, TouchableWithoutFeedback} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

interface BaseScreenWrapperProps {
  children: React.ReactNode;
  extraScrollHeight?: number;
  scrollEnabled?: boolean;
  contentContainerStyle?: object;
  keyboardShouldPersistTaps?: 'always' | 'never' | 'handled';
}

export const BaseScreenWrapper: React.FC<BaseScreenWrapperProps> = ({
                                                                      children,
                                                                      extraScrollHeight = 20,
                                                                      scrollEnabled = true,
                                                                      contentContainerStyle,
                                                                      keyboardShouldPersistTaps = 'handled',
                                                                    }) => {
  return (
    <YStack flex={1} backgroundColor="$background">
      <KeyboardAwareScrollView
        contentContainerStyle={[{flexGrow: 1}, contentContainerStyle]}
        extraScrollHeight={extraScrollHeight}
        enableAutomaticScroll={true}
        enableOnAndroid={true}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        scrollEnabled={scrollEnabled}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <YStack flex={1}>
            {children}
          </YStack>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    </YStack>
  );
};
