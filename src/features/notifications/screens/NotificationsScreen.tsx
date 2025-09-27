import React, { useState } from 'react';
import { Alert, FlatList, ListRenderItem, RefreshControl } from 'react-native';
import { Button, Text, View, XStack, YStack } from 'tamagui';
import { BellOff, Check, CheckCheck, Filter, Trash2 } from '@tamagui/lucide-icons';
import { router } from 'expo-router';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHapticFeedback } from '@/shared/components/feedback/Haptic/HapticContext';
import { NotificationData } from '@/features/notifications/types/notification';
import { useNotifications } from '@/features/notifications/hooks/useNotification';

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
      case 'urgent': return '$red9';
      case 'high': return '$orange9';
      case 'normal': return '$blue9';
      case 'low': return '$gray9';
      default: return '$blue9';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'message': return '💬';
      case 'reminder': return '⏰';
      case 'system': return '⚙️';
      case 'promotion': return '🎉';
      case 'update': return '🔄';
      default: return '🔔';
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
        { text: 'Cancelar', style: 'cancel' },
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
      backgroundColor={notification.is_read ? "$background" : "$blue1"}
      borderRadius="$4"
      borderWidth={1}
      borderColor={notification.is_read ? "$borderColor" : "$blue6"}
      pressStyle={{ opacity: 0.8, scale: 0.98 }}
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
              fontWeight={notification.is_read ? "500" : "700"}
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
                  icon={<Check size={16} />}
                  onPress={handleMarkAsRead}
                  circular
                />
              )}

              <Button
                size="$2"
                variant="outlined"
                icon={<Trash2 size={16} />}
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

  const {
    notifications,
    unreadCount,
    stats,
    loading,
    refreshing,
    loadingMore,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    loadMore,
    refresh,
    applyFilters,
    clearFilters,
    filters,
    hasNotifications,
    hasUnread,
    isEmpty,
    pagination
  } = useNotifications();

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
    haptic.selection();

    Alert.alert(
      'Marcar Todas como Lidas',
      `Marcar ${unreadCount} notificações como lidas?`,
      [
        { text: 'Cancelar', style: 'cancel' },
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

  const handleFilter = (type?: string) => {
    haptic.light();

    if (type) {
      applyFilters({ ...filters, type });
    } else {
      setShowFilters(!showFilters);
    }
  };

  const renderNotificationItem: ListRenderItem<NotificationData> = ({ item }) => (
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
                icon={<Filter size={18} />}
                onPress={() => handleFilter()}
                circular
              />

              {hasUnread && (
                <Button
                  size="$3"
                  variant="outlined"
                  icon={<CheckCheck size={18} />}
                  onPress={handleMarkAllAsRead}
                  circular
                />
              )}
            </XStack>
          </XStack>

          {hasUnread && (
            <Text fontSize="$3" color="$blue10" marginTop="$1">
              {unreadCount} não {unreadCount === 1 ? 'lida' : 'lidas'}
            </Text>
          )}
        </YStack>
      </XStack>

      {stats && (
        <XStack
          justifyContent="space-around"
          padding="$3"
          backgroundColor="$gray2"
          borderBottomWidth={1}
          borderBottomColor="$borderColor"
        >
          <YStack alignItems="center">
            <Text fontSize="$6" fontWeight="bold" color="$blue10">
              {stats.total_notifications}
            </Text>
            <Text fontSize="$2" color="$color11">Total</Text>
          </YStack>

          <YStack alignItems="center">
            <Text fontSize="$6" fontWeight="bold" color="$red10">
              {stats.unread_count}
            </Text>
            <Text fontSize="$2" color="$color11">Não lidas</Text>
          </YStack>

          <YStack alignItems="center">
            <Text fontSize="$6" fontWeight="bold" color="$green10">
              {stats.last_24h_count}
            </Text>
            <Text fontSize="$2" color="$color11">Últimas 24h</Text>
          </YStack>

          <YStack alignItems="center">
            <Text fontSize="$6" fontWeight="bold" color="$orange10">
              {stats.last_week_count}
            </Text>
            <Text fontSize="$2" color="$color11">Última semana</Text>
          </YStack>
        </XStack>
      )}

      {showFilters && (
        <XStack space="$2" padding="$3" backgroundColor="$gray1" flexWrap="wrap">
          <Button
            size="$3"
            variant={!filters.type ? undefined : "outlined"}
            onPress={() => clearFilters()}
          >
            Todas
          </Button>

          <Button
            size="$3"
            variant={filters.unreadOnly ? undefined : "outlined"}
            onPress={() => applyFilters({ ...filters, unreadOnly: !filters.unreadOnly })}
          >
            Não lidas
          </Button>

          <Button
            size="$3"
            variant={filters.type === 'message' ? undefined : "outlined"}
            onPress={() => handleFilter('message')}
          >
            💬 Mensagens
          </Button>

          <Button
            size="$3"
            variant={filters.type === 'reminder' ? undefined : "outlined"}
            onPress={() => handleFilter('reminder')}
          >
            ⏰ Lembretes
          </Button>

          <Button
            size="$3"
            variant={filters.type === 'system' ? undefined : "outlined"}
            onPress={() => handleFilter('system')}
          >
            ⚙️ Sistema
          </Button>
        </XStack>
      )}

      {pagination.total > 0 && (
        <View padding="$2" backgroundColor="$gray1">
          <Text fontSize="$3" color="$color11" textAlign="center">
            {notifications.length} de {pagination.total} notificações
          </Text>
        </View>
      )}
    </YStack>
  );

  const renderFooter = () => {
    if (loadingMore) {
      return (
        <View padding="$4" alignItems="center">
          <Text fontSize="$3" color="$color11">
            Carregando mais notificações...
          </Text>
        </View>
      );
    }

    return <View height={20} />;
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
      <View
        width={80}
        height={80}
        backgroundColor="$gray4"
        borderRadius={40}
        alignItems="center"
        justifyContent="center"
      >
        <BellOff size={40} color="$gray10" />
      </View>

      <YStack alignItems="center" space="$2">
        <Text fontSize="$6" fontWeight="bold" color="$color">
          Nenhuma notificação
        </Text>
        <Text fontSize="$4" color="$color11" textAlign="center">
          {filters.unreadOnly
            ? 'Você não tem notificações não lidas'
            : 'Quando você receber notificações, elas aparecerão aqui'
          }
        </Text>
      </YStack>

      {Object.keys(filters).length > 0 && (
        <Button onPress={clearFilters} variant="outlined">
          Limpar Filtros
        </Button>
      )}
    </YStack>
  );

  return (
    <View flex={1} backgroundColor="$background" paddingTop={insets.top}>
      <StatusBar style="auto" />

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
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotificationItem}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={isEmpty ? renderEmpty : null}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor="$blue10"
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: '$background'
        }}
        style={{ flex: 1 }}
      />
    </View>
  );
}
