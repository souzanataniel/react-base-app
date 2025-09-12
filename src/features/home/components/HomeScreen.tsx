import React from 'react';
import {HomeHeader} from '@/features/home/components/HomeHeader';
import {useAuth} from '@/features/auth/hooks/useAuth';
import {BaseScreenWrapper} from '@/shared/components/layout';

export const HomeScreen = () => {
  const {user} = useAuth();

  return (
    <BaseScreenWrapper>
      <HomeHeader
        userName={user?.firstName + ' ' + user?.lastName}
        text="Academia Lim Campeões"
        onNotification={() => console.log('Notification pressed')}
      />
    </BaseScreenWrapper>
  );
}
