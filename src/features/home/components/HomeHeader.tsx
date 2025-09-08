// 📁 components/HomeHeader.tsx
import React from 'react';
import {StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Bell, ChevronRight, Search, User} from '@tamagui/lucide-icons';
import Animated, {runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming,} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface HomeHeaderProps {
  title?: string;
  onUserPress?: () => void;
  onSearchPress?: () => void;
  onNotificationPress?: () => void;
}

// Componentes animados
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

// Configurações de animação
const ANIMATION_CONFIG = {
  press: {damping: 15, stiffness: 400},
  bounce: {damping: 12, stiffness: 300},
  timing: {duration: 150},
};

// Hook para animação de botão
const useButtonAnimation = () => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
    opacity: opacity.value,
  }));

  const onPressIn = () => {
    scale.value = withSpring(0.92, ANIMATION_CONFIG.press);
    opacity.value = withTiming(0.8, ANIMATION_CONFIG.timing);
  };

  const onPressOut = () => {
    scale.value = withSpring(1, ANIMATION_CONFIG.bounce);
    opacity.value = withTiming(1, ANIMATION_CONFIG.timing);
  };

  const onPress = (callback?: () => void) => {
    // Feedback háptico
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Animação de "bounce"
    scale.value = withSpring(0.88, {damping: 10, stiffness: 500}, () => {
      scale.value = withSpring(1, ANIMATION_CONFIG.bounce);
    });

    // Executar callback
    if (callback) {
      runOnJS(callback)();
    }
  };

  return {
    animatedStyle,
    onPressIn,
    onPressOut,
    onPress,
  };
};

export const HomeHeader: React.FC<HomeHeaderProps> = ({
                                                        title = 'Trump',
                                                        onUserPress,
                                                        onSearchPress,
                                                        onNotificationPress,
                                                      }) => {
  const insets = useSafeAreaInsets();

  // Animações para cada botão
  const userButtonAnim = useButtonAnimation();
  const searchButtonAnim = useButtonAnimation();
  const notificationButtonAnim = useButtonAnimation();
  const titleAnim = useButtonAnimation();

  const handleUserPress = () => {
    if (onUserPress) {
      onUserPress();
    } else {
      console.log('User pressed');
    }
  };

  const handleSearch = () => {
    if (onSearchPress) {
      onSearchPress();
    } else {
      console.log('Search pressed');
    }
  };

  const handleNotifications = () => {
    if (onNotificationPress) {
      onNotificationPress();
    } else {
      console.log('Notifications pressed');
    }
  };

  return (
    <>
      {/* Status Bar */}
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />

      {/* Header Container com Safe Area Apple Guidelines */}
      <View style={[
        styles.safeArea,
        {
          paddingTop: insets.top + 16, // Apple: 16px após safe area
          paddingBottom: 12, // Apple: padding inferior padrão
          paddingHorizontal: 16, // Apple: margens laterais padrão
        }
      ]}>
        <View style={styles.container}>

          {/* Left Section - User Icon + Name + Chevron */}
          <View style={styles.leftSection}>
            <AnimatedTouchableOpacity
              style={[styles.userButton, userButtonAnim.animatedStyle]}
              onPress={() => userButtonAnim.onPress(handleUserPress)}
              onPressIn={userButtonAnim.onPressIn}
              onPressOut={userButtonAnim.onPressOut}
              activeOpacity={1} // Desabilita opacity padrão
            >
              <User
                size={20}
                color="#000000"
              />
            </AnimatedTouchableOpacity>

            <View style={styles.titleContainer}>
              <AnimatedTouchableOpacity
                style={[styles.titleRow, titleAnim.animatedStyle]}
                onPress={() => titleAnim.onPress(handleUserPress)}
                onPressIn={titleAnim.onPressIn}
                onPressOut={titleAnim.onPressOut}
                activeOpacity={1}
              >
                <Text style={styles.title} numberOfLines={1}>
                  {String(title)}
                </Text>
                <ChevronRight
                  size={16}
                  color="#000000"
                  style={styles.chevron}
                />
              </AnimatedTouchableOpacity>
            </View>
          </View>

          {/* Right Section - Action Buttons */}
          <View style={styles.rightSection}>
            <AnimatedTouchableOpacity
              style={[styles.actionButton, searchButtonAnim.animatedStyle]}
              onPress={() => searchButtonAnim.onPress(handleSearch)}
              onPressIn={searchButtonAnim.onPressIn}
              onPressOut={searchButtonAnim.onPressOut}
              activeOpacity={1}
            >
              <Search size={20} color="#000000" strokeWidth={2}/>
            </AnimatedTouchableOpacity>

            <AnimatedTouchableOpacity
              style={[styles.actionButton, notificationButtonAnim.animatedStyle]}
              onPress={() => notificationButtonAnim.onPress(handleNotifications)}
              onPressIn={notificationButtonAnim.onPressIn}
              onPressOut={notificationButtonAnim.onPressOut}
              activeOpacity={1}
            >
              <Bell size={20} color="#000000" strokeWidth={2}/>
            </AnimatedTouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'transparent',
    width: '100%',
    zIndex: 10,
  },
  container: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44, // Apple: touch target mínimo
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 16, // Evita colisão com botões da direita
  },
  userButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8, // Apple: 8px entre ícone e texto
    backgroundColor: '#D1D5DB',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 0,
    borderRadius: 8,
  },
  title: {
    fontSize: 17, // Apple: 17px para títulos de navegação
    fontWeight: '600',
    color: '#000000',
    lineHeight: 20,
  },
  chevron: {
    marginLeft: 4, // Apple: 4px após texto
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // Apple: 8px entre botões
  },
  actionButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#D1D5DB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
