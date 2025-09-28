import {useCallback, useEffect, useState} from 'react';
import {useAuth} from '@/features/auth/hooks/useAuth';
import {NotificationData, NotificationFilters} from '@/features/notifications/types/notification';
import {notificationManager} from '@/features/notifications/services/notificationManager';
import {NotificationService} from '@/features/notifications/services/notificationService';

export const useNotifications = (options: { isForScreen?: boolean } = {}) => {
  const {isForScreen = false} = options;
  const {user} = useAuth();

  // Estado único para contador
  const [unreadCount, setUnreadCount] = useState(0);

  // Estados apenas para tela
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(false);

  // Configurar usuário no manager
  useEffect(() => {
    notificationManager.setUserId(user?.id || null);
  }, [user?.id]);

  // Escutar mudanças do manager
  useEffect(() => {
    const unsubscribe = notificationManager.subscribe(() => {
      const newCount = notificationManager.getUnreadCount();
      setUnreadCount(newCount);
    });

    return unsubscribe;
  }, []);

  // Carregar notificações apenas se for para tela
  const loadNotifications = useCallback(async (filters: NotificationFilters = {}) => {
    if (!user?.id || !isForScreen) return;

    setLoading(true);
    try {
      const result = await NotificationService.getUserNotifications(user.id, 1, 20, filters);
      setNotifications(result.data);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id, isForScreen]);

  // Carregar notificações quando usuário mudar (apenas para tela)
  useEffect(() => {
    if (isForScreen && user?.id) {
      loadNotifications();
    }
  }, [user?.id, isForScreen, loadNotifications]);

  // Ações simplificadas
  const markAsRead = useCallback(async (notificationId: string) => {
    const success = await NotificationService.markAsRead(notificationId);
    if (success) {
      // Atualizar lista local se for tela
      if (isForScreen) {
        setNotifications(prev =>
          prev.map(n => n.id === notificationId
            ? {...n, is_read: true, read_at: new Date().toISOString()}
            : n
          )
        );
      }
      // Forçar atualização do contador
      await notificationManager.refresh();
    }
    return success;
  }, [isForScreen]);

  const markAllAsRead = useCallback(async () => {
    if (!user?.id) return 0;

    const count = await NotificationService.markAllAsRead(user.id);
    if (count > 0) {
      if (isForScreen) {
        setNotifications(prev =>
          prev.map(n => ({...n, is_read: true, read_at: new Date().toISOString()}))
        );
      }
      await notificationManager.refresh();
    }
    return count;
  }, [user?.id, isForScreen]);

  const deleteNotification = useCallback(async (notificationId: string) => {
    const success = await NotificationService.deleteNotification(notificationId);
    if (success) {
      if (isForScreen) {
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
      }
      await notificationManager.refresh();
    }
    return success;
  }, [isForScreen]);

  const refresh = useCallback(async () => {
    await notificationManager.refresh();
    if (isForScreen) {
      await loadNotifications();
    }
  }, [isForScreen, loadNotifications]);

  return {
    // Dados básicos (sempre disponíveis)
    unreadCount,
    hasUnread: unreadCount > 0,

    // Dados da tela (apenas se isForScreen = true)
    notifications: isForScreen ? notifications : [],
    loading: isForScreen ? loading : false,

    // Ações
    refresh,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    loadNotifications: isForScreen ? loadNotifications : () => {},

    // Utils
    hasNotifications: isForScreen ? notifications.length > 0 : false,
  };
};

// Hook específico para badge
export const useNotificationCounter = () => {
  const {unreadCount, hasUnread} = useNotifications({isForScreen: false});
  return {unreadCount, hasUnread};
};
