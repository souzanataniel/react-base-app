import React from 'react';
import {Image, useTheme, useThemeName, View} from 'tamagui';

interface LogoProps {
  size?: number;
  variant?: 'small' | 'medium' | 'large';
  tintColor?: string;
}

const logoSizes = {
  small: 40,
  medium: 80,
  large: 120,
};

export const Logo = ({
                       size,
                       variant = 'medium',
                       tintColor,
                     }: LogoProps) => {
  const theme = useTheme();
  const themeName = useThemeName();
  const logoSize = size || logoSizes[variant];

  const getAdaptiveTintColor = () => {
    if (tintColor) return tintColor;

    if (themeName === 'dark') {
      return theme.white?.get();
    } else {
      return theme.dark?.get();
    }
  };

  return (
    <View
      width={logoSize}
      height={logoSize}
      alignItems="center"
      justifyContent="center"
    >
      <Image
        source={require('@/assets/images/logo.png')}
        width={logoSize}
        height={logoSize}
        objectFit="contain"
        tintColor={getAdaptiveTintColor()}
      />
    </View>
  );
};
