import React from 'react';
import {Image, View} from 'tamagui';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface LogoProps {
  size?: number;
  tintColor?: string;
  variant?: 'default' | 'header' | 'splash';
  showBackground?: boolean;
  backgroundColor?: string;
}

const logoSizes = {
  default: 120,
  header: 40,
  splash: 150,
};

export const LogoFloating = ({
                       size,
                       tintColor = 'white',
                       variant = 'default',
                       showBackground = false,
                     }: LogoProps) => {
  const logoSize = size || logoSizes[variant];
  const insets = useSafeAreaInsets()

  const content = (
    <Image
      source={require('@/assets/images/logo.png')}
      width={logoSize}
      height={logoSize}
      objectFit="contain"
      tintColor={tintColor}
    />
  );

  return (
    <View
      position="absolute"
      style={{
        top: insets.top + 10,
        right: 16,
      }}
      right="16"
      zIndex="1000"
      padding="$2"
    >
      <View
        width={logoSize}
        height={logoSize}
        alignItems="center"
        justifyContent="center"
      >
        {content}
      </View>
    </View>
  );
};
