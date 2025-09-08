import React from 'react';
import {Text, View, XStack, YStack} from 'tamagui';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {BackButtonInline} from 'src/shared/components';
import {LogoFloating} from '@/shared/components/ui/Background/LogoFloating';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
  backgroundColor?: string;
  showBackButton?: boolean;
  showLogo?: boolean;
  logoSize?: number;
  logoTintColor?: string;
}

export const AuthHeader = ({
                             title,
                             subtitle,
                             backgroundColor = '$oceanDark',
                             showBackButton = true,
                             showLogo = true,
                             logoSize = 50,
                             logoTintColor = 'white'
                           }: AuthHeaderProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      backgroundColor={backgroundColor}
      borderBottomLeftRadius="$12"
      paddingBottom="$6"
    >
      <XStack
        justifyContent="space-between"
        alignItems="center"
        paddingTop={insets.top + 10}
        paddingHorizontal="$4"
        marginBottom="$4"
      >
        {showBackButton ? <BackButtonInline/> : <View/>}

        {showLogo && (
          <LogoFloating size={logoSize} tintColor={logoTintColor}/>
        )}
      </XStack>

      <YStack gap="$2" paddingHorizontal="$4">
        <Text fontSize="$9" color="$white" fontWeight="bold">
          {title}
        </Text>

        <Text fontSize="$4" color="$white" fontWeight="400">
          {subtitle}
        </Text>
      </YStack>
    </View>
  );
};
