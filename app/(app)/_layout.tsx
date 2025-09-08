import React from 'react';
import {Tabs} from 'expo-router';
import {useAuth, useAuthActions} from '@/features/auth';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Button, Circle, styled, Text, View, XStack, YStack,} from 'tamagui';
import {Bookmark, Search, Users} from '@tamagui/lucide-icons';

// Container principal do menu - altura padrão do mercado
const CustomTabBar = styled(View, {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: 'white',
  borderTopLeftRadius: '$6',
  borderTopRightRadius: '$6',
  shadowColor: 'rgba(0,0,0,0.1)',
  shadowOffset: {width: 0, height: -2},
  shadowOpacity: 0.2,
  shadowRadius: 8,
  elevation: 8,
});

// Container dos botões - altura compacta
const TabContent = styled(XStack, {
  justifyContent: 'space-around',
  alignItems: 'center',
  paddingHorizontal: '$3',
  paddingTop: '$2',
  paddingBottom: '$1',
});

// Botão de cada aba - SEM bordas ao pressionar
const TabButton = styled(Button, {
  backgroundColor: 'transparent',
  borderWidth: 0,
  borderRadius: 0,
  padding: 0,
  minHeight: 'auto',
  height: 'auto',
  flex: 1,
  maxWidth: 70,

  // Remove todos os efeitos visuais de pressionar
  pressStyle: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderWidth: 0,
    scale: 0.95,
  },

  // Remove efeitos de hover/focus
  hoverStyle: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },

  focusStyle: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderWidth: 0,
  },
});

// Container do item da aba - mais compacto
const TabItemContainer = styled(YStack, {
  alignItems: 'center',
  justifyContent: 'center',
  gap: '$1',
  paddingVertical: '$1',
});

// Container do ícone com círculo - tamanho padrão do mercado
const IconContainer = styled(Circle, {
  size: 40,
  alignItems: 'center',
  justifyContent: 'center',

  variants: {
    isActive: {
      true: {
        backgroundColor: '#6366F1',
      },
      false: {
        backgroundColor: 'transparent',
      },
    },
  } as const,
});

// Label do botão - tamanho menor
const TabLabel = styled(Text, {
  fontSize: 11,
  fontWeight: '500',
  textAlign: 'center',

  variants: {
    isActive: {
      true: {
        color: '#6366F1',
      },
      false: {
        color: '#9CA3AF',
      },
    },
  } as const,
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
    icon: () => null // Será customizado
  },
  {
    name: 'settings',
    title: 'Plan',
    icon: Bookmark
  },
];

// Ícone customizado para Community
const CommunityIcon = ({color, isActive}: { color: string; isActive: boolean }) => (
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
      transform={[{rotate: '45deg'}]}
    />
  </Circle>
);

// Componente de Tab Bar customizada
function CustomTabBarComponent({state, descriptors, navigation}: any) {
  const insets = useSafeAreaInsets();

  return (
    <CustomTabBar>
      <TabContent paddingBottom={Math.max(insets.bottom, 6)}>
        {state.routes.map((route: any, index: number) => {
          const {options} = descriptors[route.key];
          const isFocused = state.index === index;

          const tabConfig = tabsConfig.find(tab => tab.name === route.name);
          const IconComponent = tabConfig?.icon || Search;
          const label = tabConfig?.title || route.name;

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

          const iconColor = isFocused ? 'white' : '#9CA3AF';

          return (
            <TabButton
              key={route.key}
              onPress={onPress}
              animation="quick"
              unstyled={true} // Remove estilos padrão do Tamagui
            >
              <TabItemContainer>
                <IconContainer isActive={isFocused}>
                  {route.name === 'home' ? (
                    <CommunityIcon color={iconColor} isActive={isFocused}/>
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
                </IconContainer>
                <TabLabel isActive={isFocused}>
                  {label}
                </TabLabel>
              </TabItemContainer>
            </TabButton>
          );
        })}
      </TabContent>
    </CustomTabBar>
  );
}

export default function AppLayout() {
  const {user, userName} = useAuth();
  const {logout} = useAuthActions();
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
