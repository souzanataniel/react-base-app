import React from 'react';
import {ScrollView, ScrollViewProps, View, ViewStyle} from 'react-native';
import {StatusBar, StatusBarStyle} from 'expo-status-bar';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTabBarHeight} from '@/shared/components/ui/AnimatedTabBar/hooks/useTabBarHeight';

interface BaseScreenProps {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  scrollViewProps?: Partial<ScrollViewProps>;

  // Novas props para melhorar o componente
  backgroundColor?: string;
  statusBarStyle?: StatusBarStyle;
  includeSafeArea?: boolean;
  showsVerticalScrollIndicator?: boolean;
  showsHorizontalScrollIndicator?: boolean;
}

export const BaseScreen: React.FC<BaseScreenProps> = ({
                                                        children,
                                                        scrollable = false,
                                                        style,
                                                        contentContainerStyle,
                                                        scrollViewProps,
                                                        backgroundColor = '#FFFFFF', // ou use sua cor padrão
                                                        statusBarStyle = 'auto',
                                                        includeSafeArea = true,
                                                        showsVerticalScrollIndicator = false,
                                                        showsHorizontalScrollIndicator = false,
                                                      }) => {
  const {tabBarHeight} = useTabBarHeight();
  const insets = useSafeAreaInsets();

  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor,
    ...(includeSafeArea && {paddingTop: insets.top}),
    ...style,
  };

  const bottomPadding = tabBarHeight + (includeSafeArea ? insets.bottom : 0);

  if (scrollable) {
    return (
      <>
        <StatusBar style={statusBarStyle}/>
        <ScrollView
          style={containerStyle}
          contentContainerStyle={{
            paddingBottom: bottomPadding,
            flexGrow: 1,
            ...contentContainerStyle,
          }}
          showsVerticalScrollIndicator={showsVerticalScrollIndicator}
          showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
          keyboardShouldPersistTaps="handled"
          contentInsetAdjustmentBehavior="automatic"
          {...scrollViewProps}
        >
          {children}
        </ScrollView>
      </>
    );
  }

  return (
    <>
      <StatusBar style={statusBarStyle}/>
      <View style={[containerStyle, {paddingBottom: bottomPadding}]}>
        {children}
      </View>
    </>
  );
};
