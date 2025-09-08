import React from 'react';
import {ScrollView, ScrollViewProps, View, ViewStyle} from 'react-native';
import {useTabBarHeight} from '@/shared/components/ui/AnimatedTabBar/hooks/useTabBarHeight';

interface ScreenProps {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  scrollViewProps?: Partial<ScrollViewProps>;
}

export const BaseScreen: React.FC<ScreenProps> = ({
                                                    children,
                                                    scrollable = false,
                                                    style,
                                                    contentContainerStyle,
                                                    scrollViewProps
                                                  }) => {
  const {tabBarHeight} = useTabBarHeight();

  const containerStyle: ViewStyle = {
    flex: 1,
    ...style,
  };

  if (scrollable) {
    return (
      <ScrollView
        style={containerStyle}
        contentContainerStyle={{
          paddingBottom: tabBarHeight,
          ...contentContainerStyle,
        }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
        {...scrollViewProps}
      >
        {children}
      </ScrollView>
    );
  }

  return (
    <View style={[containerStyle, {paddingBottom: tabBarHeight}]}>
      {children}
    </View>
  );
};
