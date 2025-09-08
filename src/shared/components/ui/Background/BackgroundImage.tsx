import React from 'react';
import {View} from 'tamagui';
import {LinearGradient} from 'expo-linear-gradient';
import {ImageBackground} from 'react-native';

interface BackgroundImageProps {
  imageUrl?: string;
  children?: React.ReactNode;
  overlayOpacity?: number;
  fallbackOpacity?: number;
}

export const BackgroundImage = ({
                                  imageUrl,
                                  children,
                                  overlayOpacity = 0.7,
                                  fallbackOpacity = 0.3
                                }: BackgroundImageProps) => {
  return (
    <View flex={1} position="relative">
      {imageUrl ? (
        <ImageBackground
          source={{uri: imageUrl}}
          style={{flex: 1}}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['#2a4d5a', '#1a2a35', '#0f1419']}
            style={{flex: 1, opacity: fallbackOpacity}}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
          />
        </ImageBackground>
      ) : (
        <LinearGradient
          colors={['#2a4d5a', '#1a2a35', '#0f1419']}
          style={{flex: 1}}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
        />
      )}

      <LinearGradient
        colors={['transparent', `rgba(0,0,0,${overlayOpacity})`, `rgba(0,0,0,${overlayOpacity + 0.2})`]}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
      />

      {children}
    </View>
  );
};
