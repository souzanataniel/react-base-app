import React from 'react';
import { Tabs } from 'expo-router';
import { useAuth, useAuthActions } from '@/features/auth';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  useDerivedValue,
} from 'react-native-reanimated';
import {
  View,
  XStack,
  YStack,
  Text,
  styled,
  Circle,
} from 'tamagui';
import {
  Users,
  Search,
  Bookmark,
  Settings
} from '@tamagui/lucide-icons';

// Componentes animados
const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedText = Animated.createAnimatedComponent(Text);

// Container principal do menu
const CustomTabBar = styled(View, {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: 'white',
  borderTopLeftRadius: '$6',
  borderTopRightRadius: '$6',
  shadowColor: 'rgba(0,0,0,0.1)',
  shadowOffset: { width: 0, height: -2 },
  shadowOpacity: 0.2,
  shadowRadius: 8,
  elevation: 8,
});

// Container dos botões
const TabContent = styled(XStack, {
  justifyContent: 'space-around',
  alignItems: 'center',
  paddingHorizontal: '$3',
  paddingTop: '$2',
  paddingBottom: '$1',
});

// Container do item da aba
const TabItemContainer = styled(YStack, {
  alignItems: 'center',
  justifyContent: 'center',
  gap: '$1',
  paddingVertical: '$1',
  flex: 1,
  maxWidth: 70,
});

// Configuração das abas
const tabsConfig = [
  {
    name: 'home',
    title: 'Community',
    icon: Users,
  },
  {
    name: 'favorites',
    title: 'Explore',
    icon: Search
  },
  {
    name: 'profile',
    title: 'Movement',
    icon: () => null
  },
  {
    name: 'settings',
    title: 'Plan',
    icon: Bookmark
  },
];

// Ícone customizado para Community
const CommunityIcon = ({ color, isActive }: { color: string; isActive: boolean }) => (
  <Circle
    size={18}
    backgroundColor={isActive ? 'rgba(255,255,255,0.2)' : 'transparent'}
    borderWidth={1.5}
    borderColor={color}
    alignItems="center"
    justifyContent="center"
  >
    <View
      width={5}
      height={5}
      backgroundColor={color}
      transform={[{ rotate: '45deg' }]}
    />
  </Circle>
);

// Componente de botão animado
function AnimatedTabButton({
                             route,
                             index,
                             isFocused,
                             activeIndex,
                             onPress,
                           }: {
  route: any;
  index: number;
  isFocused: boolean;
  activeIndex: number;
  onPress: () => void;
}) {
  // Valores animados
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  // Configuração da aba
  const tabConfig = tabsConfig.find(tab => tab.name === route.name);
  const IconComponent = tabConfig?.icon || Search;
  const label = tabConfig?.title || route.name;

  // Animação baseada na distância do ícone ativo
  const animatedDistance = useDerivedValue(() => {
    const distance = Math.abs(index - activeIndex);
    return distance;
  });

  // Estilos animados do container
  const animatedContainerStyle = useAnimatedStyle(() => {
    const distance = animatedDistance.value;

    // Scale baseado na distância
    const targetScale = distance === 0 ? 1 : distance === 1 ? 0.96 : 0.92;

    // Opacity baseado na distância
    const targetOpacity = distance === 0 ? 1 : distance === 1 ? 0.8 : 0.6;

    return {
      transform: [
        { scale: withSpring(targetScale, { damping: 15, stiffness: 200 }) },
        { translateY: translateY.value }
      ],
      opacity: withTiming(targetOpacity, { duration: 300 }),
    };
  });

  // Estilos animados do círculo
  const animatedCircleStyle = useAnimatedStyle(() => {
    const isActive = index === activeIndex;

    return {
      backgroundColor: withTiming(
        isActive ? '#6366F1' : 'transparent',
        { duration: 300 }
      ),
      transform: [
        {
          scale: withSpring(
            isActive ? 1 : 0.88,
            { damping: 15, stiffness: 200 }
          )
        }
      ],
    };
  });

  // Estilos animados do label
  const animatedLabelStyle = useAnimatedStyle(() => {
    const isActive = index === activeIndex;

    return {
      color: withTiming(
        isActive ? '#6366F1' : '#9CA3AF',
        { duration: 300 }
      ),
      transform: [
        {
          translateY: withSpring(
            isActive ? -1 : 0,
            { damping: 12, stiffness: 200 }
          )
        }
      ],
    };
  });

  // Handlers de pressionar
  const handlePressIn = () => {
    scale.value = withSpring(0.94, {
      damping: 15,
      stiffness: 400,
    });
    translateY.value = withSpring(1, {
      damping: 15,
      stiffness: 400,
    });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 400,
    });
    translateY.value = withSpring(0, {
      damping: 15,
      stiffness: 400,
    });
  };

  const handlePress = () => {
    // Feedback tátil sutil
    translateY.value = withSpring(-3, {
      damping: 10,
      stiffness: 500,
    }, () => {
      translateY.value = withSpring(0, {
        damping: 12,
        stiffness: 300,
      });
    });

    runOnJS(onPress)();
  };

  const iconColor = isFocused ? 'white' : '#9CA3AF';

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={{ flex: 1, maxWidth: 70 }}
    >
      <AnimatedView style={animatedContainerStyle}>
        <TabItemContainer>
          <AnimatedCircle
            size={40}
            alignItems="center"
            justifyContent="center"
            style={animatedCircleStyle}
          >
            {route.name === 'home' ? (
              <CommunityIcon color={iconColor} isActive={isFocused} />
            ) : route.name === 'profile' ? (
              <YStack alignItems="center" gap={0}>
                <Text fontSize={9} color={iconColor} fontWeight="bold">0-0</Text>
                <Text fontSize={9} color={iconColor} fontWeight="bold">0-0</Text>
              </YStack>
            ) : (
              <IconComponent
                size={18}
                color={iconColor}
                strokeWidth={1.5}
              />
            )}
          </AnimatedCircle>

          <AnimatedText
            fontSize={11}
            fontWeight="500"
            textAlign="center"
            style={animatedLabelStyle}
          >
            {label}
          </AnimatedText>
        </TabItemContainer>
      </AnimatedView>
    </Pressable>
  );
}

// Componente de Tab Bar customizada
function CustomTabBarComponent({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  const activeIndex = state.index;

  return (
    <CustomTabBar>
      <TabContent paddingBottom={Math.max(insets.bottom, 6)}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <AnimatedTabButton
              key={route.key}
              route={route}
              index={index}
              isFocused={isFocused}
              activeIndex={activeIndex}
              onPress={onPress}
            />
          );
        })}
      </TabContent>
    </CustomTabBar>
  );
}

export default function AppLayout() {
  const { user, userName } = useAuth();
  const { logout } = useAuthActions();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
      }}
      tabBar={(props) => <CustomTabBarComponent {...props} />}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Início',
          tabBarLabel: 'Community',
        }}
      />

      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favoritos',
          tabBarLabel: 'Explore',
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarLabel: 'Movement',
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Configurações',
          tabBarLabel: 'Plan',
        }}
      />
    </Tabs>
  );
}
