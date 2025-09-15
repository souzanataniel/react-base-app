import React, {useEffect, useRef, useState} from 'react';
import {Animated, StyleSheet, Text, View} from 'react-native';
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
  animationSize?: { width: number; height: number };
  spacing?: number;
}

export const LottieSplash: React.FC<LottieSplashProps> = ({
                                                            onComplete,
                                                            animationSource,
                                                            duration = 3000,
                                                            backgroundColor = '#FFFFFF',
                                                            loop = false,
                                                            text = 'Carregando...',
                                                            textColor = '#666666',
                                                            textSize = 16,
                                                            animationSize = {width: 200, height: 200},
                                                            spacing = 24
                                                          }) => {
  const animationRef = useRef<LottieView>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const textFadeAnim = useRef(new Animated.Value(0)).current;
  const [animationCompleted, setAnimationCompleted] = useState(false);

  useEffect(() => {
    console.log('🎬 Lottie splash iniciado');

    animationRef.current?.play();
    console.log('▶️ Animação Lottie iniciada');

    setTimeout(() => {
      console.log('📝 Fade in do texto iniciado');
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

  return (
    <Animated.View
      style={[
        styles.container,
        {backgroundColor, opacity: fadeAnim}
      ]}
    >
      <View style={styles.content}>
        <LottieView
          ref={animationRef}
          source={animationSource}
          style={[styles.animation, animationSize]}
          autoPlay={true}
          loop={loop}
          resizeMode="contain"
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
                marginTop: spacing,
                opacity: textFadeAnim
              }
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
  animation: {
    width: 250,
    height: 250,
  },
  textContainer: {
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
