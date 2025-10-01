import React from 'react';
import {HomeHeader} from '@/features/home/components/HomeHeader';
import {useAuth} from '@/features/auth/hooks/useAuth';
import {router} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import {YStack} from 'tamagui';
import {Platform, ScrollView, StyleSheet} from 'react-native';

export const HomeScreen = () => {
  const {user} = useAuth();

  return (
    <>
      <StatusBar style="light"/>
      <YStack flex={1} backgroundColor="$background">
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

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={Platform.OS === 'ios'}
          scrollEventThrottle={16}
        >
          <YStack flex={1} padding={20}>

            {/* <Text>Seu conteúdo aqui</Text> */}
          </YStack>
        </ScrollView>
      </YStack>
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
