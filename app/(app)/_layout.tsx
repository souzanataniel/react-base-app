import React from 'react';
import {Tabs} from 'expo-router';
import {AnimatedTabBar} from '@/shared/components/ui/AnimatedTabBar';
import {AuthGuard} from '@/features/auth/components/AuthGuard';

export default function AppLayout() {
  return (
    <AuthGuard requireAuth={true}>

      <Tabs tabBar={(props) => <AnimatedTabBar {...props} />}>
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
            title: 'Favoritos',
            tabBarLabel: 'Favoritos',
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Perfil',
            tabBarLabel: 'Perfil',
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Ajustes',
            tabBarLabel: 'Ajustes',
          }}
        />
      </Tabs>
    </AuthGuard>
  );
}
