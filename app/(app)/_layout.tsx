import {Tabs, usePathname} from 'expo-router';
import {Heart, Home, LogOut, Settings, User} from '@tamagui/lucide-icons';
import {Button, Text, View, XStack} from 'tamagui';
import {useAuth, useAuthActions} from '@/features/auth';
import {useCallback, useEffect, useMemo, useRef} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {StatusBar} from 'expo-status-bar';
import {Animated, Dimensions, StyleSheet} from 'react-native';

const {width: screenWidth} = Dimensions.get('window');

export default function AppLayout() {
  const {user, userName} = useAuth();
  const {logout} = useAuthActions();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  // Animação para o indicador deslizante
  const slideAnimation = useRef(new Animated.Value(0)).current;

  // Mapeamento das rotas para índices
  const routeToIndex = {
    '/home': 0,
    '/favorites': 1,
    '/profile': 2,
    '/settings': 3,
  };

  // Largura de cada tab (recalculada para o novo tamanho)
  const tabWidth = (screenWidth - 96) / 4; // Ajustado: 64px margem + 32px padding total

  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }, [logout]);

  const firstName = useMemo(() => {
    return userName?.split(' ')[0] || 'Usuário';
  }, [userName]);

  // Animar quando a rota muda
  useEffect(() => {
    const newIndex = routeToIndex[pathname] ?? 0;

    // Posição simples: cada tab ocupa uma largura igual
    const targetPosition = newIndex * tabWidth;

    Animated.spring(slideAnimation, {
      toValue: targetPosition,
      useNativeDriver: true,
      tension: 120,
      friction: 8,
    }).start();
  }, [pathname, tabWidth, slideAnimation]);

  const HomeHeaderTitle = useCallback(() => (
    <XStack alignItems="center" justifyContent="space-between" flex={1}>
      <Text color="$white" fontSize="$6" fontWeight="bold">
        Olá, {firstName}!
      </Text>
      <Button
        size="$3"
        backgroundColor="$red9"
        color="$white"
        onPress={handleLogout}
        pressStyle={{scale: 0.95}}
        borderRadius="$3"
        paddingHorizontal="$3"
      >
        <XStack alignItems="center" gap="$2">
          <LogOut size={16} color="white"/>
          <Text color="$white" fontSize="$2" fontWeight="500">
            Sair
          </Text>
        </XStack>
      </Button>
    </XStack>
  ), [firstName, handleLogout]);

  const LogoutButton = useCallback(() => (
    <Button
      size="$3"
      backgroundColor="$red9"
      color="$white"
      onPress={handleLogout}
      pressStyle={{scale: 0.95}}
      borderRadius="$3"
      marginRight="$4"
    >
      <LogOut size={16} color="white"/>
    </Button>
  ), [handleLogout]);

  return (
    <View style={{flex: 1, backgroundColor: '#1a2a35'}}>
      <StatusBar style="light" backgroundColor="#1a2a35"/>

      <Tabs
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#1a2a35',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          tabBarStyle: {
            position: 'absolute',
            bottom: insets.bottom,
            left: 32, // Aumentado para 32px de padding lateral
            right: 32, // Aumentado para 32px de padding lateral
            height: 60,
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            borderRadius: 30,
            paddingHorizontal: 16,

            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 12,
            },
            shadowOpacity: 0.4,
            shadowRadius: 20,
            elevation: 20,

            borderTopWidth: 0,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.1)',
          },
          tabBarActiveTintColor: '#000000',
          tabBarInactiveTintColor: '#ffffff',
          tabBarLabelStyle: {
            fontSize: 0,
            height: 0,
          },
          tabBarIconStyle: {
            marginTop: 0,
            marginBottom: 0,
          },
          tabBarItemStyle: {
            paddingVertical: 12,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Início',
            headerTitle: HomeHeaderTitle,
            tabBarIcon: ({focused}) => (
              <View style={{zIndex: 100}}>
                <Home
                  size={22}
                  color={focused ? '#000' : '#fff'}
                  strokeWidth={2}
                />
              </View>
            ),
          }}
        />

        <Tabs.Screen
          name="favorites"
          options={{
            title: 'Favoritos',
            headerTitle: 'Favoritos',
            headerRight: LogoutButton,
            tabBarIcon: ({focused}) => (
              <View style={{zIndex: 100}}>
                <Heart
                  size={22}
                  color={focused ? '#000000' : '#ffffff'}
                  strokeWidth={2}
                />
              </View>
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: 'Perfil',
            headerTitle: 'Meu Perfil',
            headerRight: LogoutButton,
            tabBarIcon: ({focused}) => (
              <View style={{zIndex: 100}}>
                <User
                  size={22}
                  color={focused ? '#000000' : '#ffffff'}
                  strokeWidth={2}
                />
              </View>
            ),
          }}
        />

        <Tabs.Screen
          name="settings"
          options={{
            title: 'Configurações',
            headerTitle: 'Configurações',
            headerRight: LogoutButton,
            tabBarIcon: ({focused}) => (
              <View style={{zIndex: 100}}>
                <Settings
                  size={22}
                  color={focused ? '#000000' : '#ffffff'}
                  strokeWidth={2}
                />
              </View>
            ),
          }}
        />
      </Tabs>

      {/* Indicador deslizante circular branco */}
      <View style={[styles.slidingIndicatorContainer, {bottom: insets.bottom + 8}]}>
        <Animated.View
          style={[
            styles.slidingIndicator,
            {
              transform: [{translateX: slideAnimation}],
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  slidingIndicatorContainer: {
    position: 'absolute',
    left: 59, // Ajustado para o novo padding: 32 (margem) + 16 (padding) + offset
    pointerEvents: 'none',
    zIndex: 1,
  },
  slidingIndicator: {
    width: 44,
    height: 44,
    backgroundColor: '#ffffff',
    borderRadius: 22,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
});
