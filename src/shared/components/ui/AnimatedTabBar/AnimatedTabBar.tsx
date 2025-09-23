import React, {useCallback, useMemo} from 'react';
import {Pressable} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {styled, Text, View, XStack, YStack} from 'tamagui';
import {
  Bars3Icon,
  BellIcon,
  ChatBubbleLeftIcon,
  Cog6ToothIcon,
  HeartIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  ShoppingCartIcon,
  UserIcon,
} from 'react-native-heroicons/outline';

import {
  Bars3Icon as Bars3IconSolid,
  BellIcon as BellIconSolid,
  ChatBubbleLeftIcon as ChatBubbleLeftIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
  HeartIcon as HeartIconSolid,
  HomeIcon as HomeIconSolid,
  MagnifyingGlassIcon as MagnifyingGlassIconSolid,
  PlusIcon as PlusIconSolid,
  ShoppingCartIcon as ShoppingCartIconSolid,
  UserIcon as UserIconSolid,
} from 'react-native-heroicons/solid';

import {useTabBarHeight} from './hooks/useTabBarHeight';

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
  visibleTabs?: string[];
  hiddenRoutes?: string[];
  tabConfig?: {
    routeName: string;
    label?: string;
    iconKey?: IconKey;
  }[];
}

interface AnimatedTabButtonProps {
  route: TabRoute;
  index: number;
  isFocused: boolean;
  activeIndex: number;
  onPress: () => void;
  disabled?: boolean;
  descriptor: any;
  config: any;
}

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedText = Animated.createAnimatedComponent(Text);

const TabContent = styled(XStack, {
  justifyContent: 'space-around',
  alignItems: 'center',
});

const TabItemContainer = styled(YStack, {
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
  position: 'relative',
});

export type IconKey =
  | 'home'
  | 'profile'
  | 'settings'
  | 'notifications'
  | 'chat'
  | 'shop'
  | 'favorites'
  | 'search'
  | 'add'
  | 'menu';

const ICON_MAPPING_OUTLINE = {
  home: HomeIcon,
  profile: UserIcon,
  settings: Cog6ToothIcon,
  notifications: BellIcon,
  chat: ChatBubbleLeftIcon,
  shop: ShoppingCartIcon,
  favorites: HeartIcon,
  search: MagnifyingGlassIcon,
  add: PlusIcon,
  menu: Bars3Icon,
} as const;

const ICON_MAPPING_SOLID = {
  home: HomeIconSolid,
  profile: UserIconSolid,
  settings: Cog6ToothIconSolid,
  notifications: BellIconSolid,
  chat: ChatBubbleLeftIconSolid,
  shop: ShoppingCartIconSolid,
  favorites: HeartIconSolid,
  search: MagnifyingGlassIconSolid,
  add: PlusIconSolid,
  menu: Bars3IconSolid,
} as const;

const TabIcon = React.memo<{
  iconKey: IconKey;
  color: string;
  size: number;
  isFocused: boolean;
}>(({iconKey, color, size, isFocused}) => {
  const IconComponent = isFocused
    ? ICON_MAPPING_SOLID[iconKey] || ICON_MAPPING_SOLID.home
    : ICON_MAPPING_OUTLINE[iconKey] || ICON_MAPPING_OUTLINE.home;

  return (
    <IconComponent
      size={size}
      color={color}
    />
  );
});

TabIcon.displayName = 'TabIcon';

const getTabLabel = (options: any, routeName: string): string => {
  return options?.tabBarLabel || options?.title || routeName;
};

const getTabIconKey = (options: any, routeName: string): IconKey => {
  if (options?.tabBarIconKey && options.tabBarIconKey in ICON_MAPPING_OUTLINE) {
    return options.tabBarIconKey as IconKey;
  }

  if (routeName in ICON_MAPPING_OUTLINE) {
    return routeName as IconKey;
  }

  const label = (options?.tabBarLabel || '').toLowerCase().trim();
  if (label in ICON_MAPPING_OUTLINE) {
    return label as IconKey;
  }

  const title = (options?.title || '').toLowerCase().trim();
  if (title in ICON_MAPPING_OUTLINE) {
    return title as IconKey;
  }

  return 'home';
};

const useTabAnimation = (index: number, activeIndex: number, config: any) => {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  const animatedDistance = useDerivedValue(() =>
    Math.abs(index - activeIndex)
  );

  const animatedContainerStyle = useAnimatedStyle(() => {
    const distance = animatedDistance.value;
    const targetOpacity = distance === 0 ? 1 : distance === 1 ? 0.8 : 0.65;

    return {
      transform: [
        {scale: 1},
        {translateY: translateY.value}
      ],
      opacity: withTiming(targetOpacity, config.animation.timing),
    };
  });

  const animatedLabelStyle = useAnimatedStyle(() => {
    const isActive = index === activeIndex;

    return {
      color: withTiming(
        isActive ? config.colors.active : config.colors.inactive,
        config.animation.timing
      ),
      transform: [{
        translateY: withSpring(
          isActive ? -0.25 : 0,
          {damping: 15, stiffness: 250}
        )
      }],
    };
  });

  const animatedBorderStyle = useAnimatedStyle(() => {
    const isActive = index === activeIndex;

    return {
      opacity: withTiming(isActive ? 1 : 0, config.animation.timing),
      transform: [{
        scaleX: withSpring(
          isActive ? 1 : 0.3,
          config.animation.scale
        )
      }],
    };
  });

  return {
    scale,
    translateY,
    animatedContainerStyle,
    animatedLabelStyle,
    animatedBorderStyle,
  };
};

const AnimatedTabButton = React.memo<AnimatedTabButtonProps>(({
                                                                route,
                                                                index,
                                                                isFocused,
                                                                activeIndex,
                                                                onPress,
                                                                disabled = false,
                                                                descriptor,
                                                                config,
                                                              }) => {
  const options = descriptor?.options || {};

  const label = useMemo(() => getTabLabel(options, route.name), [options, route.name]);
  const iconKey = useMemo(() => getTabIconKey(options, route.name), [options, route.name]);

  const {
    scale,
    translateY,
    animatedContainerStyle,
    animatedLabelStyle,
    animatedBorderStyle,
  } = useTabAnimation(index, activeIndex, config);

  const iconColor = isFocused ? config.colors.active : config.colors.inactive;

  const handlePressIn = useCallback(() => {
    if (disabled) return;
    scale.value = withSpring(0.98, config.animation.press);
    translateY.value = withSpring(0.25, config.animation.press);
  }, [disabled, scale, translateY, config.animation.press]);

  const handlePressOut = useCallback(() => {
    if (disabled) return;
    scale.value = withSpring(1, config.animation.press);
    translateY.value = withSpring(0, config.animation.press);
  }, [disabled, scale, translateY, config.animation.press]);

  const handlePress = useCallback(() => {
    if (disabled) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    translateY.value = withSpring(-0.5, config.animation.bounce, () => {
      translateY.value = withSpring(0, config.animation.return);
    });

    runOnJS(onPress)();
  }, [disabled, onPress, translateY, config.animation.bounce, config.animation.return]);

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      accessible
      accessibilityRole="tab"
      accessibilityLabel={`${label} tab`}
      accessibilityState={{selected: isFocused}}
      accessibilityHint={`Navigate to ${label} screen`}
      style={{
        flex: 1,
        maxWidth: config.sizes.maxWidth,
        opacity: disabled ? 0.5 : 1
      }}
    >
      <AnimatedView style={animatedContainerStyle}>
        <TabItemContainer
          gap={config.spacing.gap}
          paddingVertical={config.spacing.paddingVertical}
        >
          <AnimatedView
            style={[
              {
                position: 'absolute',
                top: config.sizes.activeBorderTopOffset,
                left: '40%',
                width: '80%',
                height: config.sizes.activeBorderHeight,
                backgroundColor: config.colors.activeBorder,
                borderRadius: config.sizes.activeBorderHeight / 2,
                marginLeft: '-30%',
              },
              animatedBorderStyle,
            ]}
          />

          <View style={{
            width: config.sizes.icon + 1,
            height: config.sizes.icon + 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <TabIcon
              iconKey={iconKey}
              color={iconColor}
              size={config.sizes.icon}
              isFocused={isFocused}
            />
          </View>

          <AnimatedText
            fontSize={config.sizes.fontSize}
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

const CustomTabBarComponent = React.memo<TabBarProps>(({
                                                         state,
                                                         descriptors,
                                                         navigation,
                                                         visibleTabs,
                                                         tabConfig,
                                                         hiddenRoutes = []
                                                       }) => {
  const insets = useSafeAreaInsets();
  const {tabBarHeight, config} = useTabBarHeight();

  const currentRoute = state.routes[state.index];
  const currentDescriptor = descriptors[currentRoute.key];
  const currentOptions = currentDescriptor?.options || {};

  const shouldHideTabBar =
    hiddenRoutes.includes(currentRoute.name) ||
    currentOptions.tabBarStyle?.display === 'none' ||
    currentOptions.hideTabBar === true;

  const slideTranslateY = useSharedValue(0);

  React.useEffect(() => {
    slideTranslateY.value = withTiming(
      shouldHideTabBar ? tabBarHeight : 0,
      config.animation.hideShow
    );
  }, [shouldHideTabBar, tabBarHeight, slideTranslateY, config.animation.hideShow]);

  const animatedTabBarStyle = useAnimatedStyle(() => ({
    transform: [{translateY: slideTranslateY.value}],
  }));

  const filteredRoutes = useMemo(() => {
    if (tabConfig && tabConfig.length > 0) {
      return tabConfig.map(config => {
        const route = state.routes.find(r => r.name === config.routeName);
        return route;
      }).filter(Boolean) as TabRoute[];
    }

    if (visibleTabs && visibleTabs.length > 0) {
      return state.routes.filter(route =>
        visibleTabs.includes(route.name)
      );
    }

    return state.routes;
  }, [state.routes, visibleTabs, tabConfig]);

  const activeIndex = useMemo(() => {
    const currentRoute = state.routes[state.index];
    return filteredRoutes.findIndex(route => route.key === currentRoute.key);
  }, [state.index, state.routes, filteredRoutes]);

  const handleTabPress = useCallback((route: TabRoute, index: number) => {
    const isFocused = state.index === state.routes.findIndex(r => r.key === route.key);

    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name, route.params);
    }
  }, [navigation, state.index, state.routes]);

  const tabButtons = useMemo(() =>
      filteredRoutes.map((route, index) => {
        const originalIndex = state.routes.findIndex(r => r.key === route.key);
        const isFocused = state.index === originalIndex;
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
            config={config}
          />
        );
      }),
    [filteredRoutes, state.index, state.routes, activeIndex, handleTabPress, descriptors, config]
  );

  React.useEffect(() => {
    filteredRoutes.forEach((route) => {
      const descriptor = descriptors[route.key];
      if (descriptor?.options?.tabBarStyle !== false) {
        descriptor.options = {
          ...descriptor.options,
          tabBarHeight: tabBarHeight,
        };
      }
    });
  }, [filteredRoutes, descriptors, tabBarHeight]);

  if (filteredRoutes.length === 0) {
    return null;
  }

  return (
    <AnimatedView style={[{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: config.colors.background,
      borderTopLeftRadius: config.spacing.borderRadius,
      borderTopRightRadius: config.spacing.borderRadius,
      shadowOpacity: 0.2,
      shadowRadius: 1
    }, animatedTabBarStyle]}>
      <TabContent
        paddingHorizontal={config.spacing.paddingHorizontal}
        paddingTop={config.spacing.paddingTop}
        paddingBottom={Math.max(insets.bottom, 8)}
      >
        {tabButtons}
      </TabContent>
    </AnimatedView>
  );
});

CustomTabBarComponent.displayName = 'CustomTabBarComponent';

export const AnimatedTabBar = React.memo<Partial<TabBarProps>>(({
                                                                  state,
                                                                  descriptors,
                                                                  navigation,
                                                                  visibleTabs,
                                                                  tabConfig,
                                                                  hiddenRoutes
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
      visibleTabs={visibleTabs}
      tabConfig={tabConfig}
      hiddenRoutes={hiddenRoutes}
    />
  );
});

AnimatedTabBar.displayName = 'AnimatedTabBar';
