// 📁 components/AnimatedTabBar/index.tsx
import React, { useCallback, useMemo } from 'react';
import { Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Circle, styled, Text, View, XStack, YStack } from 'tamagui';
import { MaterialIcons } from '@expo/vector-icons';

// Types
interface TabRoute {
  key: string;
  name: string;
  params?: object;
}

interface TabBarState {
  routes: TabRoute[];
  index: number;
}

export interface TabBarProps {
  state: TabBarState;
  descriptors: Record<string, any>;
  navigation: any;
}

interface AnimatedTabButtonProps {
  route: TabRoute;
  index: number;
  isFocused: boolean;
  activeIndex: number;
  onPress: () => void;
  disabled?: boolean;
  descriptor: any;
}

// Theme - Otimizado para ícones cristalinos
const TAB_THEME = {
  colors: {
    active: '#3d6b7a',
    inactive: '#3d6b7a',
    iconActive: 'white',
    iconInactive: '#3d6b7a',
    background: 'white',
    shadow: 'rgba(0,0,0,0.1)',
  },
  sizes: {
    icon: 24, // Tamanho par para melhor renderização
    circle: 44,
    fontSize: 11,
    maxWidth: 70,
  },
  spacing: {
    borderRadius: '$6',
    paddingHorizontal: '$3',
    paddingTop: '$2',
    paddingBottom: '$1',
    gap: '$1',
    paddingVertical: '$1',
  }
} as const;

// Configurações de animação - Otimizadas para qualidade visual
const ANIMATION_CONFIG = {
  scale: { damping: 18, stiffness: 250 },
  press: { damping: 20, stiffness: 500 },
  bounce: { damping: 15, stiffness: 400 },
  return: { damping: 15, stiffness: 350 },
  timing: { duration: 200 },
} as const;

// Styled Components
const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedText = Animated.createAnimatedComponent(Text);

const CustomTabBar = styled(View, {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: TAB_THEME.colors.background,
  borderTopLeftRadius: TAB_THEME.spacing.borderRadius,
  borderTopRightRadius: TAB_THEME.spacing.borderRadius,
  shadowColor: TAB_THEME.colors.shadow,
  shadowOffset: { width: 0, height: -2 },
  shadowOpacity: 0.2,
  shadowRadius: 8,
});

const TabContent = styled(XStack, {
  justifyContent: 'space-around',
  alignItems: 'center',
  paddingHorizontal: TAB_THEME.spacing.paddingHorizontal,
  paddingTop: TAB_THEME.spacing.paddingTop,
  paddingBottom: TAB_THEME.spacing.paddingBottom,
});

const TabItemContainer = styled(YStack, {
  alignItems: 'center',
  justifyContent: 'center',
  gap: TAB_THEME.spacing.gap,
  paddingVertical: TAB_THEME.spacing.paddingVertical,
  flex: 1,
  maxWidth: TAB_THEME.sizes.maxWidth,
});

// Mapeamento de ícones
const ICON_MAPPING = {
  home: 'home',
  favorites: 'favorite',
  profile: 'person',
  settings: 'settings',
  search: 'search',
  users: 'group',
  community: 'home',
  explore: 'search',
  movement: 'person',
  plan: 'settings',
} as const;

type IconKey = keyof typeof ICON_MAPPING;

// Componente de ícone OTIMIZADO para máxima qualidade
const TabIcon = React.memo<{
  iconKey: IconKey;
  color: string;
  size: number;
  isFocused: boolean;
}>(({ iconKey, color, size, isFocused }) => {
  const iconName = ICON_MAPPING[iconKey] || ICON_MAPPING.home;

  // Estilo otimizado para renderização cristalina
  const iconStyle = {
    textAlign: 'center' as const,
    textAlignVertical: 'center' as const,
    includeFontPadding: false,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0,
    lineHeight: size,
  };

  return (
    <MaterialIcons
      name={iconName as any}
      size={size}
      color={color}
      style={iconStyle}
      allowFontScaling={false}
    />
  );
});

TabIcon.displayName = 'TabIcon';

// Utils
const getTabLabel = (options: any, routeName: string): string => {
  return options?.tabBarLabel || options?.title || routeName;
};

const getTabIconKey = (options: any, routeName: string): IconKey => {
  // Prioridade: tabBarIconKey -> mapeamento por route -> mapeamento por label -> fallback
  if (options?.tabBarIconKey && options.tabBarIconKey in ICON_MAPPING) {
    return options.tabBarIconKey as IconKey;
  }

  // Mapear route name para ícone
  if (routeName in ICON_MAPPING) {
    return routeName as IconKey;
  }

  // Mapear por label se disponível (normalizado para lowercase)
  const label = (options?.tabBarLabel || '').toLowerCase().trim();
  if (label in ICON_MAPPING) {
    return label as IconKey;
  }

  // Mapear por título se disponível (normalizado para lowercase)
  const title = (options?.title || '').toLowerCase().trim();
  if (title in ICON_MAPPING) {
    return title as IconKey;
  }

  return 'home';
};

// Hook de animação OTIMIZADO - SEM ESCALA para preservar qualidade dos ícones
const useTabAnimation = (index: number, activeIndex: number) => {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  const animatedDistance = useDerivedValue(() =>
    Math.abs(index - activeIndex)
  );

  const animatedContainerStyle = useAnimatedStyle(() => {
    const distance = animatedDistance.value;

    // ✅ APENAS opacidade - SEM ESCALA para preservar qualidade dos ícones
    const targetOpacity = distance === 0 ? 1 : distance === 1 ? 0.8 : 0.65;

    return {
      transform: [
        // Mantém escala 1 sempre - apenas translateY para feedback
        { scale: 1 },
        { translateY: translateY.value }
      ],
      opacity: withTiming(targetOpacity, ANIMATION_CONFIG.timing),
    };
  });

  const animatedCircleStyle = useAnimatedStyle(() => {
    const isActive = index === activeIndex;

    return {
      backgroundColor: withTiming(
        isActive ? TAB_THEME.colors.active : 'transparent',
        ANIMATION_CONFIG.timing
      ),
      // ✅ Escala APENAS no círculo de fundo, não afeta o ícone
      transform: [{
        scale: withSpring(
          isActive ? 1 : 0.9,
          ANIMATION_CONFIG.scale
        )
      }],
    };
  });

  const animatedLabelStyle = useAnimatedStyle(() => {
    const isActive = index === activeIndex;

    return {
      color: withTiming(
        TAB_THEME.colors.active,
        ANIMATION_CONFIG.timing
      ),
      transform: [{
        translateY: withSpring(
          isActive ? -1 : 0,
          { damping: 15, stiffness: 250 }
        )
      }],
    };
  });

  return {
    scale,
    translateY,
    animatedContainerStyle,
    animatedCircleStyle,
    animatedLabelStyle,
  };
};

// Tab Button Component OTIMIZADO
const AnimatedTabButton = React.memo<AnimatedTabButtonProps>(({
                                                                route,
                                                                index,
                                                                isFocused,
                                                                activeIndex,
                                                                onPress,
                                                                disabled = false,
                                                                descriptor,
                                                              }) => {
  const options = descriptor?.options || {};

  const label = useMemo(() => getTabLabel(options, route.name), [options, route.name]);
  const iconKey = useMemo(() => getTabIconKey(options, route.name), [options, route.name]);

  const {
    scale,
    translateY,
    animatedContainerStyle,
    animatedCircleStyle,
    animatedLabelStyle,
  } = useTabAnimation(index, activeIndex);

  const iconColor = isFocused ? TAB_THEME.colors.iconActive : TAB_THEME.colors.iconInactive;

  // Handlers de press com movimento mínimo para preservar qualidade
  const handlePressIn = useCallback(() => {
    if (disabled) return;
    // Movimento muito sutil para preservar nitidez
    scale.value = withSpring(0.98, ANIMATION_CONFIG.press);
    translateY.value = withSpring(0.5, ANIMATION_CONFIG.press);
  }, [disabled, scale, translateY]);

  const handlePressOut = useCallback(() => {
    if (disabled) return;
    scale.value = withSpring(1, ANIMATION_CONFIG.press);
    translateY.value = withSpring(0, ANIMATION_CONFIG.press);
  }, [disabled, scale, translateY]);

  const handlePress = useCallback(() => {
    if (disabled) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Bounce mínimo para preservar qualidade visual
    translateY.value = withSpring(-2, ANIMATION_CONFIG.bounce, () => {
      translateY.value = withSpring(0, ANIMATION_CONFIG.return);
    });

    runOnJS(onPress)();
  }, [disabled, onPress, translateY]);

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      accessible
      accessibilityRole="tab"
      accessibilityLabel={`${label} tab`}
      accessibilityState={{ selected: isFocused }}
      accessibilityHint={`Navigate to ${label} screen`}
      style={{
        flex: 1,
        maxWidth: TAB_THEME.sizes.maxWidth,
        opacity: disabled ? 0.5 : 1
      }}
    >
      <AnimatedView style={animatedContainerStyle}>
        <TabItemContainer>
          <AnimatedCircle
            size={TAB_THEME.sizes.circle}
            alignItems="center"
            justifyContent="center"
            style={animatedCircleStyle}
          >
            {/* Container extra para isolar o ícone das transformações */}
            <View style={{
              width: TAB_THEME.sizes.icon + 4,
              height: TAB_THEME.sizes.icon + 4,
              alignItems: 'center',
              justifyContent: 'center',
              // Força renderização pixel-perfect
              borderRadius: 0,
            }}>
              <TabIcon
                iconKey={iconKey}
                color={iconColor}
                size={TAB_THEME.sizes.icon}
                isFocused={isFocused}
              />
            </View>
          </AnimatedCircle>
          <AnimatedText
            fontSize={TAB_THEME.sizes.fontSize}
            fontWeight="500"
            textAlign="center"
            style={animatedLabelStyle}
            allowFontScaling={false}
          >
            {label}
          </AnimatedText>
        </TabItemContainer>
      </AnimatedView>
    </Pressable>
  );
});

AnimatedTabButton.displayName = 'AnimatedTabButton';

// Main Component - Com padding bottom para evitar sobreposição
const CustomTabBarComponent = React.memo<TabBarProps>(({
                                                         state,
                                                         descriptors,
                                                         navigation
                                                       }) => {
  const insets = useSafeAreaInsets();
  const activeIndex = state.index;

  // Calcular altura total do tab bar para usar como padding
  const tabBarHeight = 44 + 16 + Math.max(insets.bottom, 6); // circle + padding + safe area

  const handleTabPress = useCallback((route: TabRoute, index: number) => {
    const isFocused = state.index === index;

    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name, route.params);
    }
  }, [navigation, state.index]);

  const tabButtons = useMemo(() =>
      state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const descriptor = descriptors[route.key];

        return (
          <AnimatedTabButton
            key={route.key}
            route={route}
            index={index}
            isFocused={isFocused}
            activeIndex={activeIndex}
            onPress={() => handleTabPress(route, index)}
            descriptor={descriptor}
          />
        );
      }),
    [state.routes, state.index, activeIndex, handleTabPress, descriptors]
  );

  // Adicionar padding bottom para as telas
  React.useEffect(() => {
    // Informar para as telas que precisam de padding bottom
    state.routes.forEach((route) => {
      const descriptor = descriptors[route.key];
      if (descriptor?.options?.tabBarStyle !== false) {
        // Inject tab bar height into screen options for padding
        descriptor.options = {
          ...descriptor.options,
          tabBarHeight: tabBarHeight,
        };
      }
    });
  }, [state.routes, descriptors, tabBarHeight]);

  return (
    <CustomTabBar>
      <TabContent paddingBottom={Math.max(insets.bottom, 6)}>
        {tabButtons}
      </TabContent>
    </CustomTabBar>
  );
});

CustomTabBarComponent.displayName = 'CustomTabBarComponent';

// Exported Component
export const AnimatedTabBar = React.memo<Partial<TabBarProps>>(({
                                                                  state,
                                                                  descriptors,
                                                                  navigation
                                                                }) => {
  if (!state || !descriptors || !navigation) {
    console.warn('AnimatedTabBar: Missing required props');
    return null;
  }

  return (
    <CustomTabBarComponent
      state={state}
      descriptors={descriptors}
      navigation={navigation}
    />
  );
});

AnimatedTabBar.displayName = 'AnimatedTabBar';
