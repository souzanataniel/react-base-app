import React, {memo} from 'react';
import {View} from 'tamagui';
import {LinearGradient} from 'expo-linear-gradient';
import {Image} from 'expo-image';
import {useColorScheme} from 'react-native';

interface BackgroundImageProps {
  children?: React.ReactNode;
  overlayOpacity?: number;
  fallbackOpacity?: number;
  lightSource?: number;
  darkSource?: number;
  source?: number;
}

const DEFAULT_LIGHT = require('@/assets/images/bg.png');
const DEFAULT_DARK = require('@/assets/images/bg.png');

export const BackgroundImage = memo(
  ({
     children,
     overlayOpacity = 0.7,
     fallbackOpacity = 0.3,
     lightSource,
     darkSource,
     source,
   }: BackgroundImageProps) => {
    const scheme = useColorScheme();
    const localSource =
      source ??
      (scheme === 'dark'
        ? (darkSource ?? DEFAULT_DARK)
        : (lightSource ?? DEFAULT_LIGHT));

    return (
      <View flex={1} position="relative">
        <Image
          source={localSource}
          style={{position: 'absolute', inset: 0}}
          contentFit="cover"
          transition={250}
        />

        <LinearGradient
          colors={['#2a4d5a', '#1a2a35', '#0f1419']}
          style={{position: 'absolute', inset: 0, opacity: fallbackOpacity}}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
        />

        <LinearGradient
          colors={['transparent', `rgba(0,0,0,${overlayOpacity})`, `rgba(0,0,0,${overlayOpacity + 0.2})`]}
          style={{position: 'absolute', inset: 0}}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
        />

        {children}
      </View>
    );
  }
);
