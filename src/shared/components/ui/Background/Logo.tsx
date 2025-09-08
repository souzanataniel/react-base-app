import React from 'react';
import {Image, View} from 'tamagui';

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

export const Logo = ({
                       size,
                       tintColor = 'white',
                       variant = 'default',
                       showBackground = false,
                     }: LogoProps) => {
  const logoSize = size || logoSizes[variant];

  const content = (
    <Image
      source={require('@/assets/images/logo.png')}
      width={logoSize}
      height={logoSize}
      objectFit="contain"
      tintColor={tintColor}
    />
  );

  if (showBackground) {
    return (
      <View
        width={logoSize + 20}
        height={logoSize + 20}
        borderRadius="$10"
        alignItems="center"
        justifyContent="center"
      >
        {content}
      </View>
    );
  }

  return (
    <View
      width={logoSize}
      height={logoSize}
      alignItems="center"
      justifyContent="center"
    >
      {content}
    </View>
  );
};
