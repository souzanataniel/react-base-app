import React from 'react';
import {Text, View} from 'tamagui';
import {useNotifications} from '@/features/notifications/hooks/useNotification';

interface NotificationBadgeProps {
  maxCount?: number;
  size?: 'small' | 'medium' | 'large';
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  offset?: { x: number; y: number };
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
                                                                      maxCount = 99,
                                                                      size = 'medium',
                                                                      position = 'top-right',
                                                                      offset = {x: -5, y: -5}
                                                                    }) => {
  const {unreadCount} = useNotifications();

  if (unreadCount === 0) return null;

  // Configurações de tamanho
  const sizeConfig = {
    small: {width: 16, height: 16, fontSize: '$1', minWidth: 16},
    medium: {width: 20, height: 20, fontSize: '$2', minWidth: 20},
    large: {width: 24, height: 24, fontSize: '$3', minWidth: 24}
  };

  // Configurações de posição
  const positionConfig = {
    'top-right': {top: offset.y, right: offset.x},
    'top-left': {top: offset.y, left: offset.x},
    'bottom-right': {bottom: Math.abs(offset.y), right: offset.x},
    'bottom-left': {bottom: Math.abs(offset.y), left: offset.x}
  };

  const config = sizeConfig[size];
  const positionStyle = positionConfig[position];

  const displayCount = unreadCount > maxCount ? `${maxCount}+` : unreadCount.toString();

  return (
    <View
      position="absolute"
      backgroundColor="$red9"
      borderRadius={config.width / 2}
      minWidth={config.minWidth}
      height={config.height}
      alignItems="center"
      justifyContent="center"
      borderWidth={2}
      borderColor="$background"
      paddingHorizontal={unreadCount > 9 ? '$1' : 0}
      {...positionStyle}
    >
      <Text
        fontSize={config.fontSize}
        color="white"
        fontWeight="bold"
        lineHeight={config.height - 4}
        textAlign="center"
      >
        {displayCount}
      </Text>
    </View>
  );
};
