import React from 'react';
import {Tabs} from 'expo-router';
import {AnimatedTabBar} from '@/shared/components/ui/AnimatedTabBar/AnimatedTabBar';
import {AuthGate} from '@/features/auth/components/AuthGate';

export default function AppLayout() {
  const visibleTabs = ['home', 'favorites', 'notifications', 'profile'];
  const hiddenTabs = ['update-profile', 'update-contacts', 'update-password'];

  return (
    <AuthGate requireAuth>
      <Tabs
        tabBar={(props) =>
          <AnimatedTabBar {...props} visibleTabs={visibleTabs} hiddenRoutes={hiddenTabs}/>}>

        <Tabs.Screen
          name="home"
          options={{
            headerShown: false,
            title: 'Início',
            tabBarLabel: 'Início',
          }}
        />

        <Tabs.Screen
          name="favorites"
          options={{
            headerShown: false,
            title: 'Favoritos',
            tabBarLabel: 'Favoritos',
          }}
        />

        <Tabs.Screen
          name="settings"
          options={{
            title: 'Detalhes',
            tabBarLabel: 'Ajustes',
          }}
        />

        <Tabs.Screen
          name="notifications"
          options={{
            title: 'Notificações',
            tabBarLabel: 'Notificações',
            headerShown: false,
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: 'Perfil',
            tabBarLabel: 'Perfil',
            headerShown: false,
          }}
        />

        <Tabs.Screen
          name="update-profile"
          options={{
            title: 'Atualizar Perfil',
            tabBarLabel: 'Atualizar Perfil',
            headerShown: false,
          }}
        />

        <Tabs.Screen
          name="update-contacts"
          options={{
            title: 'Atualizar Contatos',
            tabBarLabel: 'Atualizar Contatos',
            headerShown: false,
          }}
        />

        <Tabs.Screen
          name="update-password"
          options={{
            title: 'Atualizar Password',
            tabBarLabel: 'Atualizar Password',
            headerShown: false,
          }}
        />

      </Tabs>
    </AuthGate>
  );
}
