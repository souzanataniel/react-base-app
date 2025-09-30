// useNotification.ts - Versão refatorada sem race conditions
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { NotificationData, NotificationFilters } from '@/features/notifications/types/notification';
import { notificationManager } from '@/features/notifications/services/notificationManager';
import { NotificationService } from '@/features/notifications/services/notificationService';

interface UseNotificationsOptions {
  isForScreen?: boolean;
  autoLoad?: boolean;
}

export const useNotifications = (options: UseNotificationsOptions = {}) => {
  const { isForScreen = false, autoLoad = true } = options;
  const { user } = useAuth();

  // Estados
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<NotificationFilters>({});

  // Refs para controle
  const pendingActionsRef = useRef<Set<string>>(new Set());
  const isMountedRef = useRef(true);
  const lastLoadTimeRef = useRef(0);

  // Configurar userId no manager
  useEffect(() => {
    notificationManager.setUserId(user?.id || null);
  }, [user?.id]);

  // Subscrever ao contador do manager
  useEffect(() => {
    const unsubscribe = notificationManager.subscribe((newCount) => {
      console.log('[useNotifications] Contador do manager mudou:', newCount);

      if (isMountedRef.current) {
        setUnreadCount(newCount);

        // Recarregar lista apenas se for para tela e não há ações pendentes
        if (isForScreen && pendingActionsRef.current.size === 0) {
          const timeSinceLastLoad = Date.now() - lastLoadTimeRef.current;

          // Evitar reloads muito frequentes (mínimo 1 segundo)
          if (timeSinceLastLoad > 1000) {
            console.log('[useNotifications] Recarregando lista devido a mudança no contador');
            loadNotifications(filters);
          } else {
            console.log('[useNotifications] Reload ignorado (muito recente)');
          }
        }
      }
    });

    return unsubscribe;
  }, [isForScreen, filters]);

  // Carregar notificações
  const loadNotifications = useCallback(
    async (filtersToApply: NotificationFilters = {}) => {
      if (!user?.id || !isForScreen) {
        return;
      }

      console.log('[useNotifications] Carregando notificações:', filtersToApply);

      setLoading(true);
      setFilters(filtersToApply);
      lastLoadTimeRef.current = Date.now();

      try {
        const result = await NotificationService.getUserNotifications(
          user.id,
          1,
          20,
          filtersToApply
        );

        if (isMountedRef.current) {
          console.log('[useNotifications] Notificações carregadas:', result.data.length);
          setNotifications(result.data);
        }
      } catch (error) {
        console.error('[useNotifications] Erro ao carregar notificações:', error);
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    },
    [user?.id, isForScreen]
  );

  // Carregar notificações ao montar (apenas para tela)
  useEffect(() => {
    if (isForScreen && user?.id && autoLoad) {
      loadNotifications(filters);
    }
  }, [user?.id, isForScreen, autoLoad]);

  // Cleanup ao desmontar
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Marcar como lida
  const markAsRead = useCallback(
    async (notificationId: string): Promise<boolean> => {
      if (!user?.id) return false;

      console.log('[useNotifications] Marcando como lida:', notificationId);

      // Adicionar à lista de ações pendentes
      pendingActionsRef.current.add(notificationId);

      try {
        // Update otimista (apenas visual)
        if (isForScreen) {
          setNotifications((prev) =>
            prev.map((n) =>
              n.id === notificationId
                ? { ...n, is_read: true, read_at: new Date().toISOString() }
                : n
            )
          );
        }

        // Chamar API
        const success = await NotificationService.markAsRead(notificationId);

        if (success) {
          // Forçar refresh do contador (consistência)
          await notificationManager.refresh();
        } else {
          // Rollback do update otimista
          if (isForScreen) {
            console.warn('[useNotifications] Falha ao marcar como lida, fazendo rollback');
            await loadNotifications(filters);
          }
        }

        return success;
      } catch (error) {
        console.error('[useNotifications] Erro ao marcar como lida:', error);

        // Rollback em caso de erro
        if (isForScreen) {
          await loadNotifications(filters);
        }

        return false;
      } finally {
        // Remover da lista de ações pendentes após um delay
        setTimeout(() => {
          pendingActionsRef.current.delete(notificationId);
        }, 500);
      }
    },
    [user?.id, isForScreen, filters, loadNotifications]
  );

  // Marcar todas como lidas
  const markAllAsRead = useCallback(async (): Promise<number> => {
    if (!user?.id) return 0;

    console.log('[useNotifications] Marcando todas como lidas');

    // Adicionar marcador global de ação pendente
    pendingActionsRef.current.add('mark_all');

    try {
      // Update otimista
      if (isForScreen) {
        setNotifications((prev) =>
          prev.map((n) => ({
            ...n,
            is_read: true,
            read_at: new Date().toISOString(),
          }))
        );
      }

      // Chamar API
      const count = await NotificationService.markAllAsRead(user.id);

      if (count > 0) {
        // Forçar refresh do contador
        await notificationManager.refresh();
      }

      return count;
    } catch (error) {
      console.error('[useNotifications] Erro ao marcar todas como lidas:', error);

      // Rollback
      if (isForScreen) {
        await loadNotifications(filters);
      }

      return 0;
    } finally {
      setTimeout(() => {
        pendingActionsRef.current.delete('mark_all');
      }, 500);
    }
  }, [user?.id, isForScreen, filters, loadNotifications]);

  // Deletar notificação
  const deleteNotification = useCallback(
    async (notificationId: string): Promise<boolean> => {
      console.log('[useNotifications] Deletando notificação:', notificationId);

      pendingActionsRef.current.add(notificationId);

      try {
        // Update otimista
        if (isForScreen) {
          setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
        }

        // Chamar API
        const success = await NotificationService.deleteNotification(notificationId);

        if (success) {
          // Forçar refresh do contador
          await notificationManager.refresh();
        } else {
          // Rollback
          if (isForScreen) {
            await loadNotifications(filters);
          }
        }

        return success;
      } catch (error) {
        console.error('[useNotifications] Erro ao deletar notificação:', error);

        // Rollback
        if (isForScreen) {
          await loadNotifications(filters);
        }

        return false;
      } finally {
        setTimeout(() => {
          pendingActionsRef.current.delete(notificationId);
        }, 500);
      }
    },
    [isForScreen, filters, loadNotifications]
  );

  // Refresh manual
  const refresh = useCallback(async () => {
    console.log('[useNotifications] Refresh manual');

    // Limpar ações pendentes
    pendingActionsRef.current.clear();

    // Refresh do contador
    await notificationManager.refresh();

    // Recarregar lista se for tela
    if (isForScreen) {
      await loadNotifications(filters);
    }
  }, [isForScreen, filters, loadNotifications]);

  return {
    // Dados básicos
    unreadCount,
    hasUnread: unreadCount > 0,

    // Dados da tela
    notifications: isForScreen ? notifications : [],
    loading: isForScreen ? loading : false,
    hasNotifications: isForScreen ? notifications.length > 0 : false,

    // Ações
    loadNotifications: isForScreen ? loadNotifications : async () => {},
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh,

    // Estado da conexão
    isConnected: notificationManager.isConnected(),
  };
};

// Hook especializado para badge
export const useNotificationCounter = () => {
  const { unreadCount, hasUnread, isConnected } = useNotifications({
    isForScreen: false,
    autoLoad: false,
  });

  return {
    unreadCount,
    hasUnread,
    isConnected,
  };
};
