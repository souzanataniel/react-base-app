import React from 'react';
import {styled, Text, View, XStack, YStack} from 'tamagui';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {COLORS} from '@/shared/constants/colors';
import {PatternOverlay} from '@/shared/components/ui/GradientDotPattern/PatternOverlay';
import {GradientDotPatternProps} from '@/shared/components/ui/GradientDotPattern/GradientDotPattern';
import {AvatarIconMedium} from '@/features/profile/components/AvatarIcon';
import {NotificationIcon} from '@/features/notifications/components/NotificationIcon';

const HeaderContainer = styled(View, {
  backgroundColor: COLORS.PRIMARY,
  paddingTop: 50,
  paddingHorizontal: 20,
  paddingBottom: 20,
  borderBottomLeftRadius: 16,
  borderBottomRightRadius: 16,
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 8,
  },
  shadowOpacity: 0.30,
  shadowRadius: 6,
  position: 'relative',
  overflow: 'hidden',
});

interface HomeHeaderProps {
  userName?: string;
  text?: string;
  onNotification?: () => void;
  onUserPress?: () => void;
  dotPattern?: {
    enabled?: boolean;
  } & Partial<GradientDotPatternProps>;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({
                                                        userName = 'User',
                                                        text = 'Sample Text Here !',
                                                        onNotification,
                                                        onUserPress,
                                                        dotPattern = {
                                                          enabled: true,
                                                          spacing: 26,
                                                          dotSize: 2.5,
                                                          baseOpacity: 0.18,
                                                          color: 'white',
                                                          startX: 35,
                                                          gradientIntensity: 1.2
                                                        }
                                                      }) => {
  const insets = useSafeAreaInsets();

  return (
    <HeaderContainer style={{paddingTop: insets.top + 20}}>
      <PatternOverlay
        enabled={dotPattern.enabled}
        spacing={dotPattern.spacing}
        dotSize={dotPattern.dotSize}
        baseOpacity={dotPattern.baseOpacity}
        color={dotPattern.color}
        startX={dotPattern.startX}
        gradientIntensity={dotPattern.gradientIntensity}
        containerWidth={500}
        containerHeight={300}
      />

      <XStack
        justifyContent="space-between"
        alignItems="center"
        marginBottom={20}
        style={{zIndex: 10, position: 'relative'}}
      >
        <XStack alignItems="center" flex={1}>
          <AvatarIconMedium/>

          <YStack marginLeft={12} gap="$1">
            <Text color="$defaultWhite" fontSize={13} fontWeight="400">
              Bem vindo,
            </Text>
            <Text color="$defaultWhite" fontSize={17} fontWeight="600">
              {userName}
            </Text>
            <Text color="$defaultWhite" fontSize={13} fontWeight="400">
              {text}
            </Text>
          </YStack>
        </XStack>

        <NotificationIcon/>
      </XStack>
    </HeaderContainer>
  );
};
