import React, {useRef, useEffect} from 'react';
import {Animated, Pressable} from 'react-native';
import {Circle, Text, View, XStack, YStack} from 'tamagui';
import {Calendar, CreditCard, Star, Tag, Trash2} from '@tamagui/lucide-icons';
import {formatDistanceToNow} from 'date-fns';
import {ptBR} from 'date-fns/locale';
import {
  GestureHandlerRootView,
  Swipeable,
} from 'react-native-gesture-handler';
import {useHapticFeedback} from '@/shared/components/feedback/Haptic/HapticContext';
import {NotificationData} from '@/features/notifications/types/notification';

interface SwipeableNotificationItemProps {
  notification: NotificationData;
  onPress: (notification: NotificationData) => void;
  onDelete: (notification: NotificationData) => void;
  onSwipeableWillOpen?: (ref: Swipeable) => void;
  shouldClose?: boolean;
}

export const SwipeableNotificationItem: React.FC<
  SwipeableNotificationItemProps
> = ({notification, onPress, onDelete, onSwipeableWillOpen, shouldClose}) => {
  const haptic = useHapticFeedback();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const swipeableRef = useRef<Swipeable>(null);

  useEffect(() => {
    if (shouldClose) {
      swipeableRef.current?.close();
    }
  }, [shouldClose]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'message':
        return Calendar;
      case 'reminder':
        return Star;
      case 'system':
        return Tag;
      case 'promotion':
        return Tag;
      case 'update':
        return CreditCard;
      default:
        return Calendar;
    }
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      tension: 300,
      friction: 20,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 20,
    }).start();
  };

  const handlePress = () => {
    haptic.light();
    onPress(notification);
  };

  const handleDelete = () => {
    haptic.medium();
    swipeableRef.current?.close();
    onDelete(notification);
  };

  const handleSwipeableWillOpen = () => {
    haptic.light();
    if (swipeableRef.current) {
      onSwipeableWillOpen?.(swipeableRef.current);
    }
  };

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-100, -50, 0],
      outputRange: [1, 0.9, 0],
      extrapolate: 'clamp',
    });

    const opacity = dragX.interpolate({
      inputRange: [-100, -50, 0],
      outputRange: [1, 0.7, 0],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        style={{
          opacity,
          transform: [{scale}],
          justifyContent: 'center',
          alignItems: 'center',
          width: 80,
          marginRight: 8,
        }}
      >
        <Pressable
          onPress={handleDelete}
          style={{
            backgroundColor: '#ef4444',
            borderRadius: 12,
            width: 70,
            height: '90%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Trash2 size={24} color="white" />
          <Text color="white" fontSize="$2" fontWeight="600" marginTop="$1">
            Excluir
          </Text>
        </Pressable>
      </Animated.View>
    );
  };

  const Icon = getTypeIcon(notification.type);

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      overshootRight={false}
      friction={2}
      rightThreshold={40}
      onSwipeableWillOpen={handleSwipeableWillOpen}
    >
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
      >
        <Animated.View style={{transform: [{scale: scaleAnim}]}}>
          <XStack
            padding="$4"
            backgroundColor="$card"
            space="$3"
            alignItems="flex-start"
            marginHorizontal="$2"
            borderRadius="$4"
            borderLeftWidth={!notification.is_read ? '$1.5' : '$1.5'}
            borderLeftColor={
              !notification.is_read ? '$defaultPrimary' : '$colorTertiary'
            }
          >
            <Circle size={44} backgroundColor="$iconPlaceholder">
              <Icon size={20} color="$defaultPrimary" />
            </Circle>

            <YStack flex={1} gap="$1.5">
              <XStack justifyContent="space-between" alignItems="flex-start">
                <Text
                  fontSize="$4"
                  fontWeight="600"
                  color="$color"
                  flex={1}
                  marginRight="$2"
                >
                  {notification.title}
                </Text>

                <Text
                  fontSize="$2"
                  color="$colorSecondary"
                  flexShrink={0}
                  fontWeight={500}
                >
                  {formatDistanceToNow(new Date(notification.created_at), {
                    addSuffix: false,
                    locale: ptBR,
                  })
                    .replace('cerca de ', '')
                    .replace('há ', '')}
                </Text>
              </XStack>

              {notification.body && (
                <Text
                  fontSize="$3"
                  color="$colorSecondary"
                  lineHeight={20}
                  numberOfLines={3}
                >
                  {notification.body}
                </Text>
              )}
            </YStack>
          </XStack>
        </Animated.View>
      </Pressable>
    </Swipeable>
  );
};
