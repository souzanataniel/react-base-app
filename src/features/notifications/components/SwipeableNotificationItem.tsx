import React, {useEffect, useRef} from 'react';
import {Animated, Pressable} from 'react-native';
import {Circle, Text, XStack, YStack} from 'tamagui';
import {Calendar, CreditCard, Star, Tag, Trash2} from '@tamagui/lucide-icons';
import {formatDistanceToNow} from 'date-fns';
import {ptBR} from 'date-fns/locale';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, {Extrapolate, interpolate, SharedValue, useAnimatedStyle,} from 'react-native-reanimated';
import {useHapticFeedback} from '@/shared/components/feedback/Haptic/HapticContext';
import {NotificationData} from '@/features/notifications/types/notification';

interface SwipeableNotificationItemProps {
  notification: NotificationData;
  onPress: (notification: NotificationData) => void;
  onDelete: (notification: NotificationData) => void;
  onSwipeableWillOpen?: (ref: any) => void;
  shouldClose?: boolean;
  isDeleting?: boolean;
}

export const SwipeableNotificationItem: React.FC<
  SwipeableNotificationItemProps
> = ({notification, onPress, onDelete, onSwipeableWillOpen, shouldClose, isDeleting = false}) => {
  const haptic = useHapticFeedback();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const swipeableRef = useRef<any>(null);

  // Animações de remoção - TODAS com useNativeDriver: true
  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const scaleYAnim = useRef(new Animated.Value(1)).current; // Usando scale em vez de height

  useEffect(() => {
    if (shouldClose) {
      swipeableRef.current?.close();
    }
  }, [shouldClose]);

  // Executa animação quando isDeleting muda para true
  useEffect(() => {
    if (isDeleting) {
      // Fecha o swipeable primeiro
      swipeableRef.current?.close();

      // Inicia animação de remoção após pequeno delay
      setTimeout(() => {
        Animated.parallel([
          // Slide para direita
          Animated.timing(slideAnim, {
            toValue: 400,
            duration: 300,
            useNativeDriver: true, // ✅ Native driver
          }),
          // Fade out
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true, // ✅ Native driver
          }),
          // Scale vertical (simula collapse)
          Animated.timing(scaleYAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true, // ✅ Native driver
          }),
        ]).start();
      }, 100);
    }
  }, [isDeleting, slideAnim, opacityAnim, scaleYAnim]);

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
    if (isDeleting) return;

    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      tension: 300,
      friction: 20,
    }).start();
  };

  const handlePressOut = () => {
    if (isDeleting) return;

    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 20,
    }).start();
  };

  const handlePress = () => {
    if (isDeleting) return;

    haptic.light();
    onPress(notification);
  };

  const handleDelete = () => {
    haptic.medium();
    onDelete(notification);
  };

  const handleSwipeableWillOpen = () => {
    haptic.light();
    if (swipeableRef.current) {
      onSwipeableWillOpen?.(swipeableRef.current);
    }
  };

  const renderRightActions = (
    progress: SharedValue<number>,
    drag: SharedValue<number>
  ) => {
    const animatedStyle = useAnimatedStyle(() => {
      const scale = interpolate(
        drag.value,
        [-100, -50, 0],
        [1, 0.9, 0],
        Extrapolate.CLAMP
      );

      const opacity = interpolate(
        drag.value,
        [-100, -50, 0],
        [1, 0.7, 0],
        Extrapolate.CLAMP
      );

      return {
        opacity,
        transform: [{scale}],
      };
    });

    return (
      <Reanimated.View
        style={[
          {
            justifyContent: 'center',
            alignItems: 'center',
            width: 80,
            marginRight: 8,
          },
          animatedStyle,
        ]}
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
          <Trash2 size={24} color="white"/>
          <Text color="white" fontSize="$2" fontWeight="600" marginTop="$1">
            Excluir
          </Text>
        </Pressable>
      </Reanimated.View>
    );
  };

  const Icon = getTypeIcon(notification.type);

  return (
    <Animated.View
      style={{
        transform: [
          {translateX: slideAnim},
          {scaleY: scaleYAnim},
        ],
        opacity: opacityAnim,
        overflow: 'hidden',
      }}
    >
      <Swipeable
        ref={swipeableRef}
        renderRightActions={renderRightActions}
        overshootRight={false}
        friction={2}
        rightThreshold={40}
        onSwipeableWillOpen={handleSwipeableWillOpen}
        enabled={!isDeleting}
      >
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handlePress}
          disabled={isDeleting}
        >
          <Animated.View
            style={{
              transform: [{scale: scaleAnim}]
            }}
          >
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
                <Icon size={20} color="$defaultPrimary"/>
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
    </Animated.View>
  );
};
