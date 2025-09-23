import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Dimensions, StatusBar } from 'react-native';
import { useAuthStore } from '@/features/auth/stores/authStore';
import LottieSplash from '@/shared/components/ui/SplashScreen/LottieSplash';

// Animação de sucesso - você pode usar outra se quiser
import successAnimation from '@/assets/animations/loader.json';

const { width, height } = Dimensions.get('window');

interface TransitionOverlayProps {
  onComplete?: () => void;
}

export const TransitionOverlay: React.FC<TransitionOverlayProps> = ({ onComplete }) => {
  const { user, setRedirecting } = useAuthStore();
  const fadeOpacity = useRef(new Animated.Value(0)).current;
  const contentScale = useRef(new Animated.Value(0.9)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sequência de animações
    const sequence = Animated.sequence([
      // 1. Fade in suave
      Animated.parallel([
        Animated.timing(fadeOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(contentScale, {
          toValue: 1,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),

      // 2. Aguarda um pouco
      Animated.delay(300),

      // 3. Anima barra de progresso
      Animated.timing(progressWidth, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: false,
      }),

      // 4. Aguarda finalizar
      Animated.delay(500),

      // 5. Fade out suave
      Animated.parallel([
        Animated.timing(fadeOpacity, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(contentScale, {
          toValue: 1.05,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]);

    sequence.start(() => {
      // Finaliza a transição
      setRedirecting(false);
      onComplete?.();
    });

    // Cleanup se o componente desmontar
    return () => sequence.stop();
  }, [fadeOpacity, contentScale, progressWidth, setRedirecting, onComplete]);

  const getWelcomeMessage = () => {
    if (user?.firstName) {
      return `Bem-vindo de volta, ${user.firstName}!`;
    }
    return 'Bem-vindo de volta!';
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#2873FF', // Azul principal
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <StatusBar barStyle="light-content" backgroundColor="#2873FF" />

      <Animated.View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          opacity: fadeOpacity,
          transform: [{ scale: contentScale }],
        }}
      >
        {/* Animação de sucesso */}
        <View style={{ width: 120, height: 120, marginBottom: 40 }}>
          <LottieSplash
            animationSource={successAnimation}
            onComplete={() => {}} // Não faz nada, a sequência controla
            duration={2000}
            text=""
            animationSize="fullscreen"
          />
        </View>

        {/* Mensagem de boas-vindas */}
        <Text
          style={{
            fontSize: 28,
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
            marginBottom: 12,
            fontFamily: 'Inter-Bold',
          }}
        >
          {getWelcomeMessage()}
        </Text>

        <Text
          style={{
            fontSize: 18,
            color: 'rgba(255, 255, 255, 0.9)',
            textAlign: 'center',
            marginBottom: 50,
            fontFamily: 'Inter',
          }}
        >
          Preparando sua experiência...
        </Text>

        {/* Barra de progresso animada */}
        <View
          style={{
            width: 250,
            height: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <Animated.View
            style={{
              height: '100%',
              backgroundColor: 'white',
              borderRadius: 2,
              width: progressWidth.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            }}
          />
        </View>

        {/* Pontos de progresso */}
        <View
          style={{
            flexDirection: 'row',
            marginTop: 20,
            justifyContent: 'center',
          }}
        >
          {[1, 2, 3].map((dot, index) => (
            <Animated.View
              key={dot}
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: 'white',
                marginHorizontal: 4,
                opacity: progressWidth.interpolate({
                  inputRange: [0, 0.33 * (index + 1)],
                  outputRange: [0.3, 1],
                  extrapolate: 'clamp',
                }),
              }}
            />
          ))}
        </View>
      </Animated.View>
    </View>
  );
};
