import React from 'react';
import {HomeHeader} from '@/features/home/components/HomeHeader';
import {useAuth} from '@/features/auth/hooks/useAuth';
import {BaseScreenWrapper} from '@/shared/components/layout';
import {router} from 'expo-router';

export const HomeScreen = () => {
  const {user} = useAuth();

  return (
    <BaseScreenWrapper>
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
        userName={user?.firstName + ' ' + user?.lastName}
        text={user?.email}
        onNotification={() => router.navigate('/(app)/notifications')}
        onUserPress={() => router.navigate('/(app)/profile')}
      />
    </BaseScreenWrapper>
  );
}
