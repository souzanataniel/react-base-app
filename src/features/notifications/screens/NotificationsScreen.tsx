import React, {useRef, useState} from 'react';
import {ActivityIndicator, Alert, Animated, ListRenderItem, Platform} from 'react-native';
import {Button, Circle, Text, View, XStack, YStack} from 'tamagui';
import {router} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Reanimated, {useAnimatedStyle, useSharedValue, withSpring, withTiming,} from 'react-native-reanimated';
import {useHapticFeedback} from '@/shared/components/feedback/Haptic/HapticContext';
import {NotificationData} from '@/features/notifications/types/notification';
import {useNotifications} from '@/features/notifications/hooks/useNotification';
import {SwipeableNotificationItem} from '@/features/notifications/components/SwipeableNotificationItem';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import {ScrollAwareTabSelector} from '@/shared/components/ui/ScrollAwareTabSelector/ScrollAwareTabSelector';
import {BasicHeader} from '@/shared/components/ui/Header/BasicHeader';
import {RefreshCcw} from '@tamagui/lucide-icons';
import {useConfirm} from '@/shared/components/feedback/BaseConfirm/BaseConfirm';
import {useFocusEffect, useScrollToTop} from '@react-navigation/native';

const DEFAULT_HEADER_HEIGHT = Platform.select({ios: 44, android: 56, default: 56});
const PULL_THRESHOLD = 80;

const DateSeparator: React.FC<{
  title: string;
  onMarkAllAsRead?: () => void;
  showMarkAll?: boolean;
}> = ({title, onMarkAllAsRead, showMarkAll = true}) => (
  <XStack
    justifyContent="space-between"
    alignItems="center"
    paddingHorizontal="$4"
    paddingTop="$4"
    paddingBottom="$3"
    backgroundColor="$background"
  >
    <Text
      fontSize="$2"
      fontWeight="600"
      color="$colorSecondary"
      textTransform="uppercase"
      letterSpacing={0.5}
    >
      {title}
    </Text>

    {showMarkAll && onMarkAllAsRead && (
      <Button
        size="$2"
        chromeless
        pressStyle={{opacity: 0.7}}
        onPress={onMarkAllAsRead}
        backgroundColor="$button"
      >
        <Text fontSize="$2" color="$buttonLabel">
          Marcar todas como lida
        </Text>
      </Button>
    )}
  </XStack>
);

const PullToRefreshIndicator: React.FC<{
  pullDistance: Animated.AnimatedInterpolation<number>;
  isRefreshing: boolean;
  topOffset: number;
}> = ({pullDistance, isRefreshing, topOffset}) => {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(0);

  React.useEffect(() => {
    if (isRefreshing) {
      rotation.value = withTiming(360, {duration: 1000});
      scale.value = withSpring(1, {damping: 12});
    } else {
      rotation.value = 0;
      scale.value = withSpring(0, {damping: 12});
    }
  }, [isRefreshing]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {rotate: `${rotation.value}deg`},
      {scale: scale.value},
    ],
  }));

  const containerStyle = {
    transform: [{translateY: pullDistance}],
  };

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: topOffset,
          left: 0,
          right: 0,
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 12,
          zIndex: 9998,
        },
        containerStyle,
      ]}
      pointerEvents="none"
    >
      {isRefreshing ? (
        <Reanimated.View style={animatedStyle}>
          <ActivityIndicator size="small" color="#007AFF"/>
        </Reanimated.View>
      ) : (
        <Animated.View
          style={{
            opacity: pullDistance.interpolate({
              inputRange: [0, PULL_THRESHOLD],
              outputRange: [0, 1],
              extrapolate: 'clamp',
            }),
            transform: [
              {
                rotate: pullDistance.interpolate({
                  inputRange: [0, PULL_THRESHOLD],
                  outputRange: ['0deg', '180deg'],
                  extrapolate: 'clamp',
                }),
              },
            ],
          }}
        >
          <RefreshCcw size="$2" color="$colorSecondary"></RefreshCcw>
        </Animated.View>
      )}
    </Animated.View>
  );
};

export function NotificationsScreen() {
  const listRef = useRef<any>(null);

  useFocusEffect(
    React.useCallback(() => {
      listRef.current?.scrollToOffset?.({offset: 0, animated: false});
      return () => {};
    }, [])
  );

  useScrollToTop(listRef);

  const haptic = useHapticFeedback();
  const insets = useSafeAreaInsets();
  const [currentTab, setCurrentTab] = useState<'all' | 'unread'>('all');
  React.useEffect(() => {
    listRef.current?.scrollToOffset?.({offset: 0, animated: false});
  }, [currentTab]);

  const openSwipeableRef = useRef<any>(null);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const scrollY = useRef(new Animated.Value(0)).current;
  const [isRefreshing, setIsRefreshing] = useState(false);
  const pullDistance = useRef(new Animated.Value(0)).current;

  const headerHeight = insets.top + DEFAULT_HEADER_HEIGHT;

  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh,
  } = useNotifications({isForScreen: true});

  const handleSwipeableWillOpen = (swipeable: any) => {
    if (openSwipeableRef.current && openSwipeableRef.current !== swipeable) {
      openSwipeableRef.current.close();
    }
    openSwipeableRef.current = swipeable;
  };

  const handleNotificationPress = async (notification: NotificationData) => {
    if (openSwipeableRef.current) {
      openSwipeableRef.current.close();
      openSwipeableRef.current = null;
    }

    if (!notification.is_read) {
      await markAsRead(notification.id);
    }

    if (notification.action_url) {
      // router.push(notification.action_url);
    }
  };


  const {confirm} = useConfirm();

  const handleDeleteNotification = async (notification: NotificationData) => {
    const confirmed = await confirm({
      title: 'Excluir Notificação',
      description: 'Tem certeza que deseja excluir esta notificação?',
      confirmTextColor: '$error',
      cancelText: 'Cancelar',
      confirmText: 'Excluir',
    });

    if (confirmed) {
      setDeletingIds(prev => new Set(prev).add(notification.id));
      await new Promise(resolve => setTimeout(resolve, 400));
      openSwipeableRef.current = null;
      await deleteNotification(notification.id);
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(notification.id);
        return newSet;
      });
    } else {
      if (openSwipeableRef.current) {
        openSwipeableRef.current.close();
      }
    }
  };


  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return;

    haptic.selection();

    Alert.alert(
      'Marcar Todas como Lidas',
      `Marcar ${unreadCount} notificação${unreadCount === 1 ? '' : 's'} como lida${unreadCount === 1 ? '' : 's'}?`,
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Confirmar',
          onPress: async () => {
            const count = await markAllAsRead();
            if (count > 0) {
              haptic.success();
            }
          },
        },
      ]
    );
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    haptic.selection();
    await refresh();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  const displayedNotifications = React.useMemo(() => {
    if (currentTab === 'unread') {
      return notifications.filter(n => !n.is_read);
    }
    return notifications;
  }, [notifications, currentTab]);

  const groupedNotifications = React.useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const today: NotificationData[] = [];
    const yesterday: NotificationData[] = [];
    const older: NotificationData[] = [];

    displayedNotifications.forEach(notification => {
      const notificationDate = new Date(notification.created_at);
      const notificationStart = new Date(
        notificationDate.getFullYear(),
        notificationDate.getMonth(),
        notificationDate.getDate()
      );

      const diffInDays = Math.floor(
        (todayStart.getTime() - notificationStart.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffInDays === 0) {
        today.push(notification);
      } else if (diffInDays === 1) {
        yesterday.push(notification);
      } else {
        older.push(notification);
      }
    });

    return {today, yesterday, older};
  }, [displayedNotifications]);

  const flatListData = React.useMemo(() => {
    const data: Array<{ type: 'separator' | 'notification'; data: any }> = [];

    if (groupedNotifications.today.length > 0) {
      data.push({type: 'separator', data: {title: 'Hoje', section: 'today'}});
      groupedNotifications.today.forEach(notification => {
        data.push({type: 'notification', data: notification});
      });
    }

    if (groupedNotifications.yesterday.length > 0) {
      data.push({type: 'separator', data: {title: 'Ontem', section: 'yesterday'}});
      groupedNotifications.yesterday.forEach(notification => {
        data.push({type: 'notification', data: notification});
      });
    }

    if (groupedNotifications.older.length > 0) {
      data.push({type: 'separator', data: {title: 'Anteriores', section: 'older'}});
      groupedNotifications.older.forEach(notification => {
        data.push({type: 'notification', data: notification});
      });
    }

    return data;
  }, [groupedNotifications]);

  const renderItem: ListRenderItem<any> = ({item}) => {
    if (item.type === 'separator') {
      return (
        <DateSeparator
          title={item.data.title}
          onMarkAllAsRead={handleMarkAllAsRead}
          showMarkAll={item.data.section === 'today' && unreadCount > 0}
        />
      );
    }

    return (
      <SwipeableNotificationItem
        notification={item.data}
        onPress={handleNotificationPress}
        onDelete={handleDeleteNotification}
        onSwipeableWillOpen={handleSwipeableWillOpen}
        isDeleting={deletingIds.has(item.data.id)}
      />
    );
  };

  const renderEmpty = () => (
    <YStack
      flex={1}
      alignItems="center"
      justifyContent="center"
      padding="$6"
      gap="$4"
      minHeight={400}
    >
      <Circle size={100} backgroundColor="transparent" marginBottom="$4">
        <LottieView
          source={require('@/assets/lottie/empty_notification.json')}
          autoPlay
          loop={true}
          style={{
            width: 172,
            height: 172,
          }}
        />
      </Circle>

      <YStack alignItems="center" gap="$2">
        <Text fontSize="$6" fontWeight="bold" color="$color">
          Nenhuma Notificação
        </Text>
        <Text fontSize="$4" color="$colorSecondary" textAlign="center">
          {currentTab === 'unread'
            ? 'Você não tem notificações não lidas.'
            : 'Quando você receber notificações, elas aparecerão aqui !'}
        </Text>
      </YStack>
    </YStack>
  );

  const animatedPullDistance = pullDistance.interpolate({
    inputRange: [0, PULL_THRESHOLD * 2],
    outputRange: [0, PULL_THRESHOLD],
    extrapolate: 'clamp',
  });
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <StatusBar style="auto"/>
      <YStack flex={1} backgroundColor="$background" marginBottom={insets.bottom + 40}>
        <YStack
          position="absolute"
          top={0}
          left={0}
          right={0}
          zIndex={999}
        >
          <BasicHeader
            title="Notificações"
            onBack={() => router.back()}
          />
        </YStack>

        <ScrollAwareTabSelector
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          unreadCount={unreadCount}
          scrollY={scrollY}
          headerHeight={headerHeight}
          topOffset={headerHeight}
        />

        <PullToRefreshIndicator
          pullDistance={animatedPullDistance}
          isRefreshing={isRefreshing}
          topOffset={headerHeight + 78}
        />

        <Animated.FlatList
          ref={listRef}
          data={flatListData}
          keyExtractor={(item, index) =>
            item.type === 'separator'
              ? `separator-${item.data.section}`
              : `notification-${item.data.id}`
          }
          renderItem={renderItem}
          ListEmptyComponent={!loading ? renderEmpty : null}
          onRefresh={handleRefresh}
          refreshing={isRefreshing}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: headerHeight + 78,
            paddingBottom: insets.bottom,
          }}
          ItemSeparatorComponent={({leadingItem}) =>
            leadingItem?.type === 'notification' ? (
              <View height="$0.5" backgroundColor="$background" marginHorizontal="$4"/>
            ) : null
          }
          style={{flex: 1}}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {y: scrollY},
                },
              },
            ],
            {
              useNativeDriver: false,
              listener: (event: any) => {
                const offsetY = event.nativeEvent.contentOffset.y;
                if (offsetY < 0) {
                  pullDistance.setValue(Math.abs(offsetY));
                } else {
                  pullDistance.setValue(0);
                }
              },
            }
          )}
          scrollEventThrottle={16}
        />
      </YStack>
    </GestureHandlerRootView>
  );
}
