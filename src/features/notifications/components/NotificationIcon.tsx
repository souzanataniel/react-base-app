import React from 'react';
import { View, Button } from 'tamagui';
import { Bell } from '@tamagui/lucide-icons';
import { NotificationBadge } from './NotificationBadge';
import { router } from 'expo-router';
import { useHapticFeedback } from '@/shared/components/feedback/Haptic/HapticContext';

interface NotificationIconProps {
  size?: number;
  color?: string;
  onPress?: () => void;
  showBadge?: boolean;
}

export const NotificationIcon: React.FC<NotificationIconProps> = ({
                                                                    size = 24,
                                                                    color = '$color',
                                                                    onPress,
                                                                    showBadge = true
                                                                  }) => {
  const haptic = useHapticFeedback();

  const handlePress = () => {
    haptic.light();
    if (onPress) {
      onPress();
    } else {
      router.push('/(app)/notifications');
    }
  };

  return (
    <View position="relative">
      <Button
        size="$4"
        variant="outlined"
        icon={<Bell size={size} color={color} />}
        onPress={handlePress}
        circular
      />

      {showBadge && <NotificationBadge />}
    </View>
  );
};
