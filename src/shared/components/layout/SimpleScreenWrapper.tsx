import React from 'react';
import {YStack} from 'tamagui';
import {Platform, ScrollView, StyleSheet} from 'react-native';

interface SimpleScreenWrapperProps {
  children: React.ReactNode;
  scrollEnabled?: boolean;
  contentContainerStyle?: object;
  showsVerticalScrollIndicator?: boolean;
}

export const SimpleScreenWrapper: React.FC<SimpleScreenWrapperProps> = ({
                                                                          children,
                                                                          scrollEnabled = true,
                                                                          contentContainerStyle,
                                                                          showsVerticalScrollIndicator = false,
                                                                        }) => {
  return (
    <YStack flex={1} backgroundColor="$background">
      {scrollEnabled ? (
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            contentContainerStyle,
          ]}
          showsVerticalScrollIndicator={showsVerticalScrollIndicator}
          bounces={Platform.OS === 'ios'}
          scrollEventThrottle={16}
          decelerationRate="fast"
        >
          <YStack flex={1}>
            {children}
          </YStack>
        </ScrollView>
      ) : (
        <YStack flex={1}>
          {children}
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
