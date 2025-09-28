// NotificationBadge.tsx - Versão simplificada
import React from 'react';
import { Text, View } from 'tamagui';
import {useNotificationCounter} from '@/features/notifications/hooks/useNotification';

interface NotificationBadgeProps {
  maxCount?: number;
  size?: 'small' | 'medium' | 'large';
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
                                                                      maxCount = 99,
                                                                      size = 'small'
                                                                    }) => {
  const { unreadCount } = useNotificationCounter();

  if (unreadCount === 0) return null;

  const sizeConfig = {
    small: { width: 18, height: 18, fontSize: 10 },
    medium: { width: 22, height: 22, fontSize: 12 },
    large: { width: 26, height: 26, fontSize: 14 }
  };

  const config = sizeConfig[size];
  const displayCount = unreadCount > maxCount ? `${maxCount}+` : unreadCount.toString();

  return (
    <View
      position="absolute"
      top={-5}
      right={-5}
      backgroundColor="$error"
      borderRadius={config.width / 2}
      width={config.width}
      height={config.height}
      alignItems="center"
      justifyContent="center"
      borderWidth={2}
      borderColor="$error"
    >
      <Text
        fontSize={config.fontSize}
        color="white"
        fontWeight="bold"
        textAlign="center"
      >
        {displayCount}
      </Text>
    </View>
  );
};
