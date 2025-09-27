import {useCallback, useEffect, useRef, useState} from 'react';
import {useAuth} from '@/features/auth/hooks/useAuth';
import {NotificationData, NotificationFilters, NotificationStats} from '@/features/notifications/types/notification';
import {NotificationService} from '@/features/notifications/services/notificationService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useNotifications = (initialFilters: NotificationFilters = {}) => {
  const {user} = useAuth();
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [filters, setFilters] = useState<NotificationFilters>(initialFilters);
  const [pagination, setPagination] = useState({
    page: 1,
    hasMore: false,
    total: 0
  });

  const realtimeSubscription = useRef<any>(null);

  const loadNotifications = useCallback(async (
    page: number = 1,
    shouldAppend: boolean = false,
    customFilters?: NotificationFilters
  ) => {
    if (!user?.id) {
      setNotifications([]);
      setPagination({page: 1, hasMore: false, total: 0});
      return;
    }

    const isFirstPage = page === 1;
    const currentFilters = customFilters || filters;

    if (isFirstPage && !shouldAppend) {
      setLoading(true);
    } else if (!isFirstPage) {
      setLoadingMore(true);
    }

    try {
      const result = await NotificationService.getUserNotifications(
        user.id,
        page,
        20,
        currentFilters
      );

      if (shouldAppend && !isFirstPage) {
        setNotifications(prev => [...prev, ...result.data]);
      } else {
        setNotifications(result.data);
      }

      setPagination({
        page,
        hasMore: result.hasMore,
        total: result.count
      });

    } catch (error) {
      console.error('Erro ao carregar notificações:', error);

      if (isFirstPage) {
        setNotifications([]);
        setPagination({page: 1, hasMore: false, total: 0});
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  }, [user?.id, filters]);

  const loadMore = useCallback(async () => {
    if (!pagination.hasMore || loadingMore || notifications.length === 0) {
      return;
    }

    const nextPage = pagination.page + 1;
    await loadNotifications(nextPage, true);
  }, [pagination.hasMore, pagination.page, loadingMore, notifications.length, loadNotifications]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    setPagination({page: 1, hasMore: false, total: 0});

    await Promise.all([
      loadNotifications(1),
      loadStats(),
      loadUnreadCount()
    ]);
  }, [loadNotifications]);

  const loadStats = useCallback(async () => {
    if (!user?.id) return;

    try {
      const userStats = await NotificationService.getUserStats(user.id);
      if (userStats) {
        setStats(userStats);
      } else {
        setStats({
          user_id: user.id,
          total_notifications: 0,
          unread_count: 0,
          read_count: 0,
          last_24h_count: 0,
          last_week_count: 0,
          last_month_count: 0
        });
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      setStats({
        user_id: user.id,
        total_notifications: 0,
        unread_count: 0,
        read_count: 0,
        last_24h_count: 0,
        last_week_count: 0,
        last_month_count: 0
      });
    }
  }, [user?.id]);

  const loadUnreadCount = useCallback(async () => {
    if (!user?.id) return;

    try {
      const count = await NotificationService.getUnreadCount(user.id);
      setUnreadCount(count);
    } catch (error) {
      console.error('Erro ao carregar contador:', error);
      setUnreadCount(0);
    }
  }, [user?.id]);

  const markAsRead = useCallback(async (notificationId: string) => {
    const success = await NotificationService.markAsRead(notificationId);

    if (success) {
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId
            ? {...n, is_read: true, read_at: new Date().toISOString()}
            : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      if (stats) {
        setStats(prev => prev ? {
          ...prev,
          unread_count: Math.max(0, prev.unread_count - 1),
          read_count: prev.read_count + 1
        } : null);
      }
    }
    return success;
  }, [stats]);

  const markAllAsRead = useCallback(async () => {
    if (!user?.id) return 0;

    const updatedCount = await NotificationService.markAllAsRead(user.id);
    if (updatedCount > 0) {
      setNotifications(prev =>
        prev.map(n => ({...n, is_read: true, read_at: new Date().toISOString()}))
      );
      setUnreadCount(0);
      if (stats) {
        setStats(prev => prev ? {
          ...prev,
          unread_count: 0,
          read_count: prev.total_notifications
        } : null);
      }
    }
    return updatedCount;
  }, [user?.id, stats]);

  const deleteNotification = useCallback(async (notificationId: string) => {
    const success = await NotificationService.deleteNotification(notificationId);

    if (success) {
      setNotifications(prev => {
        const notification = prev.find(n => n.id === notificationId);
        const filtered = prev.filter(n => n.id !== notificationId);

        if (notification && !notification.is_read) {
          setUnreadCount(current => Math.max(0, current - 1));
        }

        return filtered;
      });

      setPagination(prev => ({
        ...prev,
        total: Math.max(0, prev.total - 1)
      }));
    }

    return success;
  }, []);

  const applyFilters = useCallback(async (newFilters: NotificationFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({...prev, page: 1, hasMore: false}));
    await loadNotifications(1, false, newFilters);
  }, [loadNotifications]);

  const clearFilters = useCallback(async () => {
    const emptyFilters = {};
    setFilters(emptyFilters);
    setPagination(prev => ({...prev, page: 1, hasMore: false}));
    await loadNotifications(1, false, emptyFilters);
  }, [loadNotifications]);

  const syncNotifications = useCallback(async () => {
    if (!user?.id) return;

    try {
      const lastSync = await AsyncStorage.getItem('last_notification_sync');
      const newNotifications = await NotificationService.syncNotifications(
        user.id,
        lastSync || undefined
      );

      if (newNotifications.length > 0) {
        setNotifications(prev => {
          const existingIds = new Set(prev.map(n => n.id));
          const uniqueNew = newNotifications.filter(n => !existingIds.has(n.id));

          return [...uniqueNew, ...prev];
        });

        await loadUnreadCount();
      }

      await AsyncStorage.setItem('last_notification_sync', new Date().toISOString());

    } catch (error) {
      console.error('Erro na sincronização:', error);
    }
  }, [user?.id, loadUnreadCount]);

  const enableRealTime = useCallback(() => {
    if (!user?.id || realtimeSubscription.current) return;

    realtimeSubscription.current = NotificationService.subscribeToNotifications(
      user.id,
      (notification) => {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
      },
      (notification) => {
        setNotifications(prev =>
          prev.map(n => n.id === notification.id ? notification : n)
        );
      },
      (notificationId) => {
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
      }
    );
  }, [user?.id]);

  const disableRealTime = useCallback(() => {
    if (realtimeSubscription.current) {
      NotificationService.unsubscribeFromNotifications(realtimeSubscription.current);
      realtimeSubscription.current = null;
    }
  }, []);

  useEffect(() => {
    if (user?.id) {
      loadNotifications(1);
      loadStats();
      loadUnreadCount();
    } else {
      setNotifications([]);
      setUnreadCount(0);
      setStats(null);
      setPagination({page: 1, hasMore: false, total: 0});
    }
  }, [user?.id, loadNotifications, loadStats, loadUnreadCount]);

  useEffect(() => {
    return () => {
      disableRealTime();
    };
  }, [disableRealTime]);

  return {
    // Data
    notifications,
    unreadCount,
    stats,
    filters,
    pagination,

    // States
    loading,
    refreshing,
    loadingMore,

    // Actions
    loadNotifications,
    loadMore,
    refresh,
    markAsRead,
    markAllAsRead,
    deleteNotification,

    // Filters
    applyFilters,
    clearFilters,

    // Sync
    syncNotifications,

    // Real-time
    enableRealTime,
    disableRealTime,

    // Utils
    hasNotifications: notifications.length > 0,
    hasUnread: unreadCount > 0,
    isEmpty: !loading && notifications.length === 0,
  };
};
