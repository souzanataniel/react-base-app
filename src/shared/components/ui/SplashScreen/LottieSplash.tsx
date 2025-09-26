import React, {useEffect, useRef, useState} from 'react';
import {Animated, Dimensions, StyleSheet, Text, View} from 'react-native';
import LottieView from 'lottie-react-native';

interface LottieSplashProps {
  onComplete: () => void;
  animationSource: any;
  duration?: number;
  backgroundColor?: string;
  loop?: boolean;
  text?: string;
  textColor?: string;
  textSize?: number;
  animationSize?: { width: number; height: number } | 'fullscreen';
  spacing?: number;
  fillMode?: 'contain' | 'cover' | 'stretch';
}

export const LottieSplash: React.FC<LottieSplashProps> = ({
                                                            onComplete,
                                                            animationSource,
                                                            duration = 3000,
                                                            backgroundColor = '#2873FF',
                                                            loop = false,
                                                            text = 'Carregando...',
                                                            textColor = '#FFFFFF',
                                                            textSize = 16,
                                                            animationSize = 'fullscreen',
                                                            spacing = 24,
                                                            fillMode = 'contain'
                                                          }) => {
  const animationRef = useRef<LottieView>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const textFadeAnim = useRef(new Animated.Value(0)).current;
  const [animationCompleted, setAnimationCompleted] = useState(false);

  const screenDimensions = Dimensions.get('window');
  const screenWidth = screenDimensions.width;
  const screenHeight = screenDimensions.height;

  const getAnimationSize = () => {
    if (animationSize === 'fullscreen') {
      switch (fillMode) {
        case 'contain':
          return {
            width: screenWidth,
            height: screenHeight,
          };
        case 'cover':
          return {
            width: screenWidth,
            height: screenHeight,
          };
        case 'stretch':
          return {
            width: screenWidth,
            height: screenHeight,
          };
        default:
          return {
            width: screenWidth,
            height: screenHeight,
          };
      }
    }
    return animationSize;
  };

  const calculatedAnimationSize = getAnimationSize();

  useEffect(() => {
    console.log('🎬 Lottie splash iniciado');
    console.log(`📱 Dimensões da tela: ${screenWidth}x${screenHeight}`);
    console.log(`🎭 Tamanho da animação: ${calculatedAnimationSize.width}x${calculatedAnimationSize.height}`);

    animationRef.current?.play();
    console.log('▶️ Animação Lottie iniciada');

    setTimeout(() => {
      console.log('🔤 Fade in do texto iniciado');
      Animated.timing(textFadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 300);

    const timer = setTimeout(() => {
      if (!animationCompleted) {
        console.log('⏰ Timer fallback triggered após', duration, 'ms');
        handleComplete();
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, animationCompleted, textFadeAnim]);

  const handleComplete = () => {
    if (animationCompleted) {
      console.log('⚠️ handleComplete chamado novamente - ignorando');
      return;
    }

    console.log('✅ Splash completion signal received');
    setAnimationCompleted(true);

    console.log('🎭 Iniciando fade out do splash');

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(textFadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start(() => {
      console.log('🏁 Fade out completo - chamando onComplete callback');
      onComplete();
    });
  };

  const getResizeMode = (): 'contain' | 'cover' | 'center' => {
    switch (fillMode) {
      case 'contain':
        return 'contain';
      case 'cover':
        return 'cover';
      case 'stretch':
        return 'cover';
      default:
        return 'contain';
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {backgroundColor, opacity: fadeAnim}
      ]}
    >
      <View style={[
        styles.content,
        animationSize === 'fullscreen' && styles.fullscreenContent
      ]}>
        <LottieView
          ref={animationRef}
          source={animationSource}
          style={[
            styles.animation,
            calculatedAnimationSize,
            animationSize === 'fullscreen' && styles.fullscreenAnimation
          ]}
          autoPlay={true}
          loop={loop}
          resizeMode={getResizeMode()}
          onAnimationFinish={() => {
            console.log('🎬 Lottie animation finished naturalmente');
            handleComplete();
          }}
        />

        {text && (
          <Animated.View
            style={[
              styles.textContainer,
              {
                marginTop: animationSize === 'fullscreen' ? 0 : spacing,
                opacity: textFadeAnim
              },
              animationSize === 'fullscreen' && styles.fullscreenTextContainer
            ]}
          >
            <Text
              style={[
                styles.text,
                {
                  color: textColor,
                  fontSize: textSize
                }
              ]}
            >
              {text}
            </Text>
          </Animated.View>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullscreenContent: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  animation: {
    width: 250,
    height: 250,
  },
  fullscreenAnimation: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  fullscreenTextContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
  },
});

export default LottieSplash;
