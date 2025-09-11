import React from 'react';
import {Image, useThemeName, View} from 'tamagui';

const LOGO_SOURCE = require('@/assets/images/logo.png');
const DARK_COLOR = '#1A2D42';
const LIGHT_COLOR = '#FFFFFF';

export const LogoSmall = React.memo(() => {
  const themeName = useThemeName();
  const tintColor = themeName === 'dark' ? LIGHT_COLOR : DARK_COLOR;

  return (
    <View width={40} height={40} alignItems="center" justifyContent="center">
      <Image
        source={LOGO_SOURCE}
        width={40}
        height={40}
        objectFit="contain"
        tintColor={tintColor}
      />
    </View>
  );
});

export const LogoMedium = React.memo(() => {
  const themeName = useThemeName();
  const tintColor = themeName === 'dark' ? LIGHT_COLOR : DARK_COLOR;

  return (
    <View width={80} height={80} alignItems="center" justifyContent="center">
      <Image
        source={LOGO_SOURCE}
        width={80}
        height={80}
        objectFit="contain"
        tintColor={tintColor}
      />
    </View>
  );
});

export const LogoLarge = React.memo(() => {
  const themeName = useThemeName();
  const tintColor = themeName === 'dark' ? LIGHT_COLOR : DARK_COLOR;

  return (
    <View width={120} height={120} alignItems="center" justifyContent="center">
      <Image
        source={LOGO_SOURCE}
        width={120}
        height={120}
        objectFit="contain"
        tintColor={tintColor}
      />
    </View>
  );
});

export const LogoSmallLight = React.memo(() => (
  <View width={40} height={40} alignItems="center" justifyContent="center">
    <Image
      source={LOGO_SOURCE}
      width={40}
      height={40}
      objectFit="contain"
      tintColor={LIGHT_COLOR}
    />
  </View>
));

export const LogoMediumLight = React.memo(() => (
  <View width={80} height={80} alignItems="center" justifyContent="center">
    <Image
      source={LOGO_SOURCE}
      width={80}
      height={80}
      objectFit="contain"
      tintColor={LIGHT_COLOR}
    />
  </View>
));

export const LogoLargeLight = React.memo(() => (
  <View width={120} height={120} alignItems="center" justifyContent="center">
    <Image
      source={LOGO_SOURCE}
      width={120}
      height={120}
      objectFit="contain"
      tintColor={LIGHT_COLOR}
    />
  </View>
));

export const LogoSmallDark = React.memo(() => (
  <View width={40} height={40} alignItems="center" justifyContent="center">
    <Image
      source={LOGO_SOURCE}
      width={40}
      height={40}
      objectFit="contain"
      tintColor={DARK_COLOR}
    />
  </View>
));

export const LogoMediumDark = React.memo(() => (
  <View width={80} height={80} alignItems="center" justifyContent="center">
    <Image
      source={LOGO_SOURCE}
      width={80}
      height={80}
      objectFit="contain"
      tintColor={DARK_COLOR}
    />
  </View>
));

export const LogoLargeDark = React.memo(() => (
  <View width={120} height={120} alignItems="center" justifyContent="center">
    <Image
      source={LOGO_SOURCE}
      width={120}
      height={120}
      objectFit="contain"
      tintColor={DARK_COLOR}
    />
  </View>
));

LogoSmall.displayName = 'LogoSmall';
LogoMedium.displayName = 'LogoMedium';
LogoLarge.displayName = 'LogoLarge';
LogoSmallLight.displayName = 'LogoSmallLight';
LogoMediumLight.displayName = 'LogoMediumLight';
LogoLargeLight.displayName = 'LogoLargeLight';
LogoSmallDark.displayName = 'LogoSmallDark';
LogoMediumDark.displayName = 'LogoMediumDark';
LogoLargeDark.displayName = 'LogoLargeDark';
