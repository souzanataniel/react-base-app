import React, {useRef, useState} from 'react';
import {Alert, FlatList, ListRenderItem, Pressable, RefreshControl} from 'react-native';
import {Button, Circle, Text, View, XStack, YStack} from 'tamagui';
import {BellOff} from '@tamagui/lucide-icons';
import {router} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import {GestureHandlerRootView, Swipeable} from 'react-native-gesture-handler';
import {useHapticFeedback} from '@/shared/components/feedback/Haptic/HapticContext';
import {NotificationData} from '@/features/notifications/types/notification';
import {useNotifications} from '@/features/notifications/hooks/useNotification';
import {ScreenWithFixedSection} from '@/shared/components/layout/ScreenWithFixedSection';
import {SwipeableNotificationItem} from '@/features/notifications/components/SwipeableNotificationItem';

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
        color="$blue10"
        pressStyle={{opacity: 0.7}}
        onPress={onMarkAllAsRead}
      >
        <Text fontSize="$3" color="$blue10">
          Marcar todas como lida
        </Text>
      </Button>
    )}
  </XStack>
);

const TabSelector: React.FC<{
  currentTab: 'all' | 'unread';
  onTabChange: (tab: 'all' | 'unread') => void;
  unreadCount: number;
}> = ({currentTab, onTabChange, unreadCount}) => {
  const haptic = useHapticFeedback();

  const handleTabPress = (tab: 'all' | 'unread') => {
    haptic.light();
    onTabChange(tab);
  };

  return (
    <XStack
      backgroundColor="$card"
      padding="$2"
      marginHorizontal="$4"
      marginTop="$3"
      marginBottom="$2"
      borderRadius="$3"
    >
      <Pressable onPress={() => handleTabPress('all')} style={{flex: 1}}>
        <View
          flex={1}
          backgroundColor={currentTab === 'all' ? '$button' : 'transparent'}
          borderRadius="$4"
          borderBottomRightRadius="$0"
          borderTopRightRadius="$0"
          paddingVertical="$2"
          alignItems="center"
          justifyContent="center"
          borderWidth="$0.5"
          borderColor="$button"
        >
          <Text
            color={currentTab === 'all' ? '$buttonLabel' : '$color'}
            fontWeight={currentTab === 'all' ? '600' : '500'}
            fontSize="$4"
          >
            Todas
          </Text>
        </View>
      </Pressable>

      <Pressable onPress={() => handleTabPress('unread')} style={{flex: 1}}>
        <View
          flex={1}
          backgroundColor={currentTab === 'unread' ? '$button' : 'transparent'}
          borderRadius="$4"
          borderBottomLeftRadius="$0"
          borderTopLeftRadius="$0"
          paddingVertical="$2"
          alignItems="center"
          borderWidth="$0.5"
          borderColor="$button"
          justifyContent="center"
        >
          <XStack space="$2" alignItems="center">
            <Text
              color={currentTab === 'unread' ? '$buttonLabel' : '$color'}
              fontWeight={currentTab === 'unread' ? '600' : '500'}
              fontSize="$4"
            >
              Não Lidas
            </Text>
            {unreadCount > 0 && (
              <View
                backgroundColor={currentTab === 'unread' ? '$buttonLabel' : '$primary'}
                paddingHorizontal="$2"
                paddingVertical="$0.5"
                borderRadius="$6"
                minWidth={20}
                alignItems="center"
                justifyContent="center"
              >
                <Text
                  color={currentTab === 'unread' ? '$color' : '$buttonLabel'}
                  fontSize="$2"
                  fontWeight="bold"
                >
                  {unreadCount}
                </Text>
              </View>
            )}
          </XStack>
        </View>
      </Pressable>
    </XStack>
  );
};

export function NotificationsScreen() {
  const haptic = useHapticFeedback();
  const [currentTab, setCurrentTab] = useState<'all' | 'unread'>('all');
  const openSwipeableRef = useRef<Swipeable | null>(null);

  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification, // Adicione este método no seu hook
    refresh,
  } = useNotifications({isForScreen: true});

  const handleSwipeableWillOpen = (swipeable: Swipeable) => {
    // Fecha o swipeable anterior se existir e for diferente do atual
    if (openSwipeableRef.current && openSwipeableRef.current !== swipeable) {
      openSwipeableRef.current.close();
    }
    // Armazena a referência do novo swipeable aberto
    openSwipeableRef.current = swipeable;
  };

  const handleNotificationPress = async (notification: NotificationData) => {
    // Fecha qualquer swipeable aberto ao clicar em uma notificação
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

  const handleDeleteNotification = async (notification: NotificationData) => {
    Alert.alert(
      'Excluir Notificação',
      'Tem certeza que deseja excluir esta notificação?',
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            openSwipeableRef.current = null;
            await deleteNotification(notification.id);
            haptic.success();
          },
        },
      ]
    );
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

  const displayedNotifications = React.useMemo(() => {
    if (currentTab === 'unread') {
      return notifications.filter(n => !n.is_read);
    }
    return notifications;
  }, [notifications, currentTab]);

  const groupedNotifications = React.useMemo(() => {
    const now = new Date();
    const today: NotificationData[] = [];
    const yesterday: NotificationData[] = [];
    const older: NotificationData[] = [];

    displayedNotifications.forEach(notification => {
      const notificationDate = new Date(notification.created_at);
      const diffInDays = Math.floor(
        (now.getTime() - notificationDate.getTime()) / (1000 * 60 * 60 * 24)
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
    const data: Array<{type: 'separator' | 'notification'; data: any}> = [];

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
      />
    );
  };

  const renderEmpty = () => (
    <YStack
      flex={1}
      alignItems="center"
      justifyContent="center"
      padding="$6"
      space="$4"
      minHeight={400}
    >
      <Circle size={80} backgroundColor="$gray3">
        <BellOff size={40} color="$gray10" />
      </Circle>

      <YStack alignItems="center" space="$2">
        <Text fontSize="$6" fontWeight="bold" color="$color">
          Nenhuma notificação
        </Text>
        <Text fontSize="$4" color="$gray11" textAlign="center">
          {currentTab === 'unread'
            ? 'Você não tem notificações não lidas'
            : 'Quando você receber notificações, elas aparecerão aqui'}
        </Text>
      </YStack>
    </YStack>
  );

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <StatusBar style="auto" />
      <ScreenWithFixedSection
        title="Notificações"
        onBack={() => router.back()}
        fixedContent={
          <TabSelector
            currentTab={currentTab}
            onTabChange={setCurrentTab}
            unreadCount={unreadCount}
          />
        }
        fixedContentHeight={70}
        hasTabBar={false}
        customBottomPadding={0}
      >
        <FlatList
          data={flatListData}
          keyExtractor={(item, index) =>
            item.type === 'separator'
              ? `separator-${item.data.section}`
              : `notification-${item.data.id}`
          }
          renderItem={renderItem}
          ListEmptyComponent={!loading ? renderEmpty : null}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={refresh}
              tintColor="$blue10"
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
          }}
          ItemSeparatorComponent={({leadingItem}) =>
            leadingItem?.type === 'notification' ? (
              <View height="$0.5" backgroundColor="$background" marginHorizontal="$4" />
            ) : null
          }
          style={{flex: 1}}
        />
      </ScreenWithFixedSection>
    </GestureHandlerRootView>
  );
}
