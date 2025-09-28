import React, {useState} from 'react';
import {Alert, FlatList, ListRenderItem, RefreshControl} from 'react-native';
import {Button, Text, View, XStack, YStack} from 'tamagui';
import {BellOff, Check, CheckCheck, Filter, Trash2} from '@tamagui/lucide-icons';
import {router} from 'expo-router';
import {formatDistanceToNow} from 'date-fns';
import {ptBR} from 'date-fns/locale';
import {StatusBar} from 'expo-status-bar';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useHapticFeedback} from '@/shared/components/feedback/Haptic/HapticContext';
import {NotificationData} from '@/features/notifications/types/notification';
import {useNotifications} from '@/features/notifications/hooks/useNotification';

interface NotificationItemProps {
  notification: NotificationData;
  onPress: (notification: NotificationData) => void;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
                                                             notification,
                                                             onPress,
                                                             onMarkAsRead,
                                                             onDelete
                                                           }) => {
  const haptic = useHapticFeedback();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return '$red9';
      case 'high':
        return '$orange9';
      case 'normal':
        return '$blue9';
      case 'low':
        return '$gray9';
      default:
        return '$blue9';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'message':
        return '💬';
      case 'reminder':
        return '⏰';
      case 'system':
        return '⚙️';
      case 'promotion':
        return '🎉';
      case 'update':
        return '🔄';
      default:
        return '🔔';
    }
  };

  const handlePress = () => {
    haptic.light();
    onPress(notification);
  };

  const handleMarkAsRead = (e: any) => {
    e.stopPropagation();
    haptic.selection();
    onMarkAsRead(notification.id);
  };

  const handleDelete = (e: any) => {
    e.stopPropagation();
    haptic.warning();

    Alert.alert(
      'Deletar Notificação',
      'Tem certeza que deseja deletar esta notificação?',
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: () => onDelete(notification.id)
        }
      ]
    );
  };

  return (
    <View
      padding="$4"
      marginVertical="$1"
      marginHorizontal="$3"
      backgroundColor={notification.is_read ? '$background' : '$blue1'}
      borderRadius="$4"
      borderWidth={1}
      borderColor={notification.is_read ? '$borderColor' : '$blue6'}
      pressStyle={{opacity: 0.8, scale: 0.98}}
      onPress={handlePress}
    >
      <XStack space="$3" alignItems="flex-start">
        <View
          width={40}
          height={40}
          backgroundColor={getPriorityColor(notification.priority)}
          borderRadius={20}
          alignItems="center"
          justifyContent="center"
        >
          <Text fontSize="$5">{getTypeIcon(notification.type)}</Text>
        </View>

        <YStack flex={1} space="$1">
          <XStack justifyContent="space-between" alignItems="flex-start">
            <Text
              fontSize="$4"
              fontWeight={notification.is_read ? '500' : '700'}
              color="$color"
              flex={1}
              marginRight="$2"
            >
              {notification.title}
            </Text>

            {!notification.is_read && (
              <View
                width={8}
                height={8}
                backgroundColor="$blue9"
                borderRadius={4}
              />
            )}
          </XStack>

          {notification.body && (
            <Text
              fontSize="$3"
              color="$color11"
              numberOfLines={2}
            >
              {notification.body}
            </Text>
          )}

          <XStack justifyContent="space-between" alignItems="center" marginTop="$2">
            <Text fontSize="$2" color="$color10">
              {formatDistanceToNow(new Date(notification.created_at), {
                addSuffix: true,
                locale: ptBR
              })}
            </Text>

            <XStack space="$2">
              {!notification.is_read && (
                <Button
                  size="$2"
                  variant="outlined"
                  icon={<Check size={16}/>}
                  onPress={handleMarkAsRead}
                  circular
                />
              )}

              <Button
                size="$2"
                variant="outlined"
                icon={<Trash2 size={16}/>}
                onPress={handleDelete}
                circular
                theme="red"
              />
            </XStack>
          </XStack>

          <XStack space="$2" marginTop="$1">
            <View
              backgroundColor="$gray4"
              paddingHorizontal="$2"
              paddingVertical="$1"
              borderRadius="$2"
            >
              <Text fontSize="$1" color="$gray11" textTransform="uppercase">
                {notification.type}
              </Text>
            </View>

            {notification.category && (
              <View
                backgroundColor="$blue4"
                paddingHorizontal="$2"
                paddingVertical="$1"
                borderRadius="$2"
              >
                <Text fontSize="$1" color="$blue11">
                  {notification.category}
                </Text>
              </View>
            )}
          </XStack>
        </YStack>
      </XStack>
    </View>
  );
};

export function NotificationsScreen() {
  const haptic = useHapticFeedback();
  const insets = useSafeAreaInsets();
  const [showFilters, setShowFilters] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<'all' | 'unread' | string>('all');

  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh,
    hasNotifications,
  } = useNotifications({ isForScreen: true });

  const handleNotificationPress = async (notification: NotificationData) => {
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }

    if (notification.action_url) {
      // router.push(notification.action_url);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    await markAsRead(notificationId);
  };

  const handleDelete = async (notificationId: string) => {
    await deleteNotification(notificationId);
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
          }
        }
      ]
    );
  };

  const handleFilter = (filterType: 'all' | 'unread' | string) => {
    haptic.light();
    setCurrentFilter(filterType);
    setShowFilters(false);
  };

  // Filtro local simples
  const filteredNotifications = notifications.filter(notification => {
    if (currentFilter === 'unread') {
      return !notification.is_read;
    }
    if (currentFilter !== 'all') {
      return notification.type === currentFilter;
    }
    return true;
  });

  const renderNotificationItem: ListRenderItem<NotificationData> = ({item}) => (
    <NotificationItem
      notification={item}
      onPress={handleNotificationPress}
      onMarkAsRead={handleMarkAsRead}
      onDelete={handleDelete}
    />
  );

  const renderHeader = () => (
    <YStack backgroundColor="$background">
      <XStack
        justifyContent="space-between"
        alignItems="center"
        padding="$4"
        backgroundColor="$background"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
      >
        <YStack flex={1}>
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize="$6" fontWeight="bold" color="$color">
              Notificações
            </Text>

            <XStack space="$2">
              <Button
                size="$3"
                variant="outlined"
                icon={<Filter size={18}/>}
                onPress={() => setShowFilters(!showFilters)}
                circular
              />

              {unreadCount > 0 && (
                <Button
                  size="$3"
                  variant="outlined"
                  icon={<CheckCheck size={18}/>}
                  onPress={handleMarkAllAsRead}
                  circular
                />
              )}
            </XStack>
          </XStack>

          {unreadCount > 0 && (
            <Text fontSize="$3" color="$blue10" marginTop="$1">
              {unreadCount} não {unreadCount === 1 ? 'lida' : 'lidas'}
            </Text>
          )}
        </YStack>
      </XStack>

      {showFilters && (
        <XStack space="$2" padding="$3" backgroundColor="$gray1" flexWrap="wrap">
          <Button
            size="$3"
            variant={currentFilter === 'all' ? undefined : 'outlined'}
            onPress={() => handleFilter('all')}
          >
            Todas
          </Button>

          <Button
            size="$3"
            variant={currentFilter === 'unread' ? undefined : 'outlined'}
            onPress={() => handleFilter('unread')}
          >
            Não lidas ({unreadCount})
          </Button>

          <Button
            size="$3"
            variant={currentFilter === 'message' ? undefined : 'outlined'}
            onPress={() => handleFilter('message')}
          >
            💬 Mensagens
          </Button>

          <Button
            size="$3"
            variant={currentFilter === 'reminder' ? undefined : 'outlined'}
            onPress={() => handleFilter('reminder')}
          >
            ⏰ Lembretes
          </Button>

          <Button
            size="$3"
            variant={currentFilter === 'system' ? undefined : 'outlined'}
            onPress={() => handleFilter('system')}
          >
            ⚙️ Sistema
          </Button>
        </XStack>
      )}

      {hasNotifications && (
        <View padding="$2" backgroundColor="$gray1">
          <Text fontSize="$3" color="$color11" textAlign="center">
            {filteredNotifications.length} notificação{filteredNotifications.length === 1 ? '' : 's'}
            {currentFilter !== 'all' && ` (filtro: ${currentFilter === 'unread' ? 'não lidas' : currentFilter})`}
          </Text>
        </View>
      )}
    </YStack>
  );

  const renderEmpty = () => (
    <YStack
      flex={1}
      alignItems="center"
      justifyContent="center"
      padding="$6"
      space="$4"
      minHeight={400}
    >
      <View
        width={80}
        height={80}
        backgroundColor="$gray4"
        borderRadius={40}
        alignItems="center"
        justifyContent="center"
      >
        <BellOff size={40} color="$gray10"/>
      </View>

      <YStack alignItems="center" space="$2">
        <Text fontSize="$6" fontWeight="bold" color="$color">
          {currentFilter === 'unread' ? 'Nenhuma notificação não lida' : 'Nenhuma notificação'}
        </Text>
        <Text fontSize="$4" color="$color11" textAlign="center">
          {currentFilter === 'unread'
            ? 'Todas as notificações estão marcadas como lidas'
            : 'Quando você receber notificações, elas aparecerão aqui'
          }
        </Text>
      </YStack>

      {currentFilter !== 'all' && (
        <Button onPress={() => handleFilter('all')} variant="outlined">
          Ver Todas as Notificações
        </Button>
      )}
    </YStack>
  );

  return (
    <View flex={1} backgroundColor="$background" paddingTop={insets.top}>
      <StatusBar style="auto"/>

      {/* Header de navegação */}
      <XStack
        padding="$4"
        alignItems="center"
        backgroundColor="$background"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
      >
        <Button
          size="$3"
          variant="outlined"
          onPress={() => router.back()}
          circular
          marginRight="$3"
        >
          ←
        </Button>

        <Text fontSize="$5" fontWeight="600" color="$color">
          Voltar
        </Text>
      </XStack>

      <FlatList
        data={filteredNotifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotificationItem}
        ListHeaderComponent={renderHeader}
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
          backgroundColor: '$background'
        }}
        style={{flex: 1}}
      />

      {/* Loading indicator */}
      {loading && (
        <View
          position="absolute"
          top={0}
          bottom={0}
          left={0}
          right={0}
          backgroundColor="rgba(0,0,0,0.1)"
          alignItems="center"
          justifyContent="center"
        >
          <Text fontSize="$4" color="$color11">
            Carregando...
          </Text>
        </View>
      )}
    </View>
  );
}
