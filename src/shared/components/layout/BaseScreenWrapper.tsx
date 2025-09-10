import React from 'react';
import {YStack} from 'tamagui';
import {Keyboard, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback} from 'react-native';

interface BaseScreenWrapperProps {
  children: React.ReactNode;
}

export const BaseScreenWrapper: React.FC<BaseScreenWrapperProps> = ({children}) => {
  return (
    <YStack flex={1} backgroundColor="$background">
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
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
