import React from 'react';
import {View} from 'tamagui';
import {Bell} from '@tamagui/lucide-icons';
import {NotificationBadge} from './NotificationBadge';
import {router} from 'expo-router';
import {HapticButton} from '@/shared/components/feedback/Haptic/HapticButton';

interface NotificationIconProps {
  size?: number;
  color?: string;
  onPress?: () => void;
  showBadge?: boolean;
}

export const NotificationIcon: React.FC<NotificationIconProps> = ({
                                                                    size = 40,
                                                                    color = 'white',
                                                                    onPress,
                                                                    showBadge = true
                                                                  }) => {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      setTimeout(() => {
        router.push('/(app)/notifications');
      }, 150);
    }
  };

  return (
    <View position="relative">
      <HapticButton
        onPress={handlePress}
        chromeless
        backgroundColor="rgba(255, 255, 255, 0.2)"
        borderRadius={8}
        width={40}
        height={40}
        padding={0}
        icon={<Bell size={size / 2} color={color}/>}
        hapticType="light"
      />

      {showBadge && <NotificationBadge />}
    </View>
  );
};
