import React from 'react';
import {HomeHeader} from '@/features/home/components/HomeHeader';
import {useAuth} from '@/features/auth/hooks/useAuth';
import {router} from 'expo-router';
import {SimpleScreenWrapper} from '@/shared/components/layout/SimpleScreenWrapper';
import {StatusBar} from 'expo-status-bar';

export const HomeScreen = () => {
  const {user} = useAuth();

  return (
    <>
      <StatusBar style="light"/>
      <SimpleScreenWrapper>
        <HomeHeader
          dotPattern={{
            enabled: true,
            startX: 35,
            gradientIntensity: 0.8,
            baseOpacity: 0.5,
            spacing: 10,
            dotSize: 2,
            color: 'white'
          }}
          userName={user?.displayName ? user?.displayName : user?.firstName + ' ' + user?.lastName}
          text={user?.email}
          onNotification={() => router.navigate('/(app)/notifications')}
          onUserPress={() => router.navigate('/(app)/profile')}
        />
      </SimpleScreenWrapper>
    </>
  );
}
