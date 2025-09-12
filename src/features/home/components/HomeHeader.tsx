import React from 'react';
import {StatusBar} from 'expo-status-bar';
import {styled, Text, View, XStack, YStack} from 'tamagui';
import {Bell, User} from '@tamagui/lucide-icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {COLORS} from '@/shared/constants/colors';
import {HapticButton} from '@/shared/components';

const HeaderContainer = styled(View, {
  backgroundColor: COLORS.PRIMARY,
  paddingTop: 50,
  paddingHorizontal: 20,
  paddingBottom: 20,
  borderBottomLeftRadius: 16,
  borderBottomRightRadius: 16,
  shadowColor: 'black',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.15,
  shadowRadius: 6,
});

interface HomeHeaderProps {
  userName?: string;
  text?: string;
  onNotification?: () => void;
  onUserPress?: () => void;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({
                                                        userName = 'User',
                                                        text = 'Sample Text Here !',
                                                        onNotification,
                                                        onUserPress
                                                      }) => {
  const insets = useSafeAreaInsets();

  return (
    <>
      <StatusBar style="light"/>
      <HeaderContainer style={{paddingTop: insets.top + 20}}>
        <XStack justifyContent="space-between" alignItems="center" marginBottom={20}>
          <XStack alignItems="center" flex={1}>
            <HapticButton
              onPress={onUserPress}
              chromeless
              backgroundColor="rgba(255, 255, 255, 0.2)"
              borderRadius={24}
              width={48}
              height={48}
              padding={0}
              icon={<User size={24} color="$absoluteWhite"/>}
              hapticType="light"
            />
            <YStack marginLeft={12}>
              <Text color="$absoluteBorderLight" fontSize={13} fontWeight="400">
                Bem Vindo,
              </Text>
              <Text color="$white" fontSize={17} fontWeight="600">
                {userName}
              </Text>
              <Text color="$white" fontSize={13} fontWeight="400">
                {text}
              </Text>
            </YStack>
          </XStack>

          <HapticButton
            onPress={onNotification}
            chromeless
            backgroundColor="rgba(255, 255, 255, 0.2)"
            borderRadius={8}
            width={40}
            height={40}
            padding={0}
            icon={<Bell size={20} color="$white"/>}
            hapticType="light"
          />
        </XStack>
      </HeaderContainer>
    </>
  );
};
