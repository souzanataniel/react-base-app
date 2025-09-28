import {useCallback, useEffect, useState, useRef} from 'react';
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

  // Ref para controlar se deve recarregar a lista
  const shouldReloadList = useRef(false);
  const currentFilters = useRef<NotificationFilters>({});

  // Configurar usuário no manager
  useEffect(() => {
    notificationManager.setUserId(user?.id || null);
  }, [user?.id]);

  // Escutar mudanças do manager
  useEffect(() => {
    const unsubscribe = notificationManager.subscribe(() => {
      const newCount = notificationManager.getUnreadCount();
      const previousCount = unreadCount;

      console.log('[useNotifications] Contador atualizado:', { previousCount, newCount, isForScreen });

      setUnreadCount(newCount);

      // Se é para tela e houve mudança no contador, recarregar lista
      if (isForScreen && newCount !== previousCount) {
        console.log('[useNotifications] Recarregando lista devido a mudança no contador');
        shouldReloadList.current = true;
      }
    });

    return unsubscribe;
  }, [unreadCount, isForScreen]);

  // Recarregar lista quando necessário
  useEffect(() => {
    if (isForScreen && shouldReloadList.current && user?.id) {
      console.log('[useNotifications] Executando reload automático da lista');
      shouldReloadList.current = false;
      loadNotifications(currentFilters.current);
    }
  }, [unreadCount]); // Dependência no unreadCount para disparar quando ele mudar

  // Carregar notificações apenas se for para tela
  const loadNotifications = useCallback(async (filters: NotificationFilters = {}) => {
    if (!user?.id || !isForScreen) return;

    console.log('[useNotifications] Carregando notificações com filtros:', filters);

    // Atualizar filtros atuais
    currentFilters.current = filters;

    setLoading(true);
    try {
      const result = await NotificationService.getUserNotifications(user.id, 1, 20, filters);
      console.log('[useNotifications] Notificações carregadas:', result.data.length);
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
    console.log('[useNotifications] Marcando como lida:', notificationId);

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

    console.log('[useNotifications] Marcando todas como lidas');

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
    console.log('[useNotifications] Deletando notificação:', notificationId);

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
    console.log('[useNotifications] Refresh manual');
    await notificationManager.refresh();
    if (isForScreen) {
      await loadNotifications(currentFilters.current);
    }
  }, [isForScreen, loadNotifications]);

  // Método para forçar reload da lista (útil para debug)
  const forceReloadList = useCallback(async () => {
    if (isForScreen) {
      console.log('[useNotifications] Forçando reload da lista');
      await loadNotifications(currentFilters.current);
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
    forceReloadList,

    // Utils
    hasNotifications: isForScreen ? notifications.length > 0 : false,
  };
};

// Hook específico para badge
export const useNotificationCounter = () => {
  const {unreadCount, hasUnread} = useNotifications({isForScreen: false});
  return {unreadCount, hasUnread};
};
