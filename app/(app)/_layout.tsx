import React from 'react';
import {Tabs} from 'expo-router';
import {AnimatedTabBar} from '@/shared/components/ui/AnimatedTabBar';
import {AuthGuard} from '@/features/auth/components/AuthGuard';

export default function AppLayout() {
  const visibleTabs = ['home', 'favorites', 'profile', 'settings'];
  const hiddenTabs = ['notifications', 'update-profile'];
  return (
    <AuthGuard requireAuth={true}>
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
            title: 'Ajustes',
            tabBarLabel: 'Ajustes',
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
          name="notifications"
          options={{
            title: 'Notificações',
            tabBarLabel: 'Notificações',
            headerShown: false,
          }}
        />

      </Tabs>
    </AuthGuard>
  );
}
