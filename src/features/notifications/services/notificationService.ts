import {Platform} from 'react-native';
import {getApp} from '@react-native-firebase/app';
import {AuthorizationStatus, getMessaging, getToken, requestPermission} from '@react-native-firebase/messaging';
import * as Notifications from 'expo-notifications';
import {supabase} from '@/lib/supabase';
import {NotificationData, NotificationFilters, NotificationStats} from '@/features/notifications/types/notification';

export class NotificationService {

  // Configurar canal Android (chamado apenas uma vez no app)
  static async initialize() {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        showBadge: true,
        enableLights: true,
        enableVibrate: true,
      });
    }
  }

  // MÉTODO PRINCIPAL - Solicitar permissão e obter token
  static async requestPermissionAndGetToken(): Promise<{ success: boolean; token?: string }> {
    try {
      await this.initialize();

      // 1. Permissão Expo Notifications
      const {status} = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        return {success: false};
      }

      // 2. Permissão Firebase Messaging
      const messaging = getMessaging(getApp());
      const authStatus = await requestPermission(messaging, {
        alert: true,
        badge: true,
        sound: true,
      });

      const isAuthorized = (
        authStatus === AuthorizationStatus.AUTHORIZED ||
        authStatus === AuthorizationStatus.PROVISIONAL
      );

      if (!isAuthorized) {
        return {success: false};
      }

      // 3. Obter token FCM
      const token = await getToken(messaging);

      return {success: true, token};

    } catch (error) {
      console.error('Erro ao solicitar permissão de notificação:', error);
      return {success: false};
    }
  }

  static async getUserNotifications(
    userId: string,
    page: number = 1,
    limit: number = 20,
    filters: NotificationFilters = {}
  ): Promise<{ data: NotificationData[]; count: number; hasMore: boolean }> {
    try {
      if (!userId) {
        return {data: [], count: 0, hasMore: false};
      }

      let query = supabase
        .from('notifications')
        .select('*', {count: 'exact'})
        .eq('user_id', userId);

      // Aplicar filtros
      if (filters.unreadOnly) {
        query = query.eq('is_read', false);
      }

      if (filters.type) {
        query = query.eq('type', filters.type);
      }

      if (filters.category) {
        query = query.eq('category', filters.category);
      }

      if (filters.priority) {
        query = query.eq('priority', filters.priority);
      }

      if (filters.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }

      if (filters.dateTo) {
        query = query.lte('created_at', filters.dateTo);
      }

      // Excluir notificações expiradas
      query = query.or('expires_at.is.null,expires_at.gt.' + new Date().toISOString());

      // Ordenação e paginação
      const startRange = (page - 1) * limit;
      const endRange = startRange + limit - 1;

      query = query
        .order('created_at', {ascending: false})
        .range(startRange, endRange);

      const {data, error, count} = await query;

      if (error) {
        console.error('Erro ao buscar notificações:', error.message);
        throw error;
      }

      const hasMore = count ? count > (page * limit) : false;

      return {
        data: data || [],
        count: count || 0,
        hasMore
      };

    } catch (error) {
      console.error('Erro no getUserNotifications:', error instanceof Error ? error.message : 'Erro desconhecido');
      return {data: [], count: 0, hasMore: false};
    }
  }

  static async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const {data, error} = await supabase.rpc('mark_notification_as_read', {
        notification_id: notificationId
      });

      if (error) {
        console.error('Erro ao marcar como lida:', error.message);
        return false;
      }

      return data === true;
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error instanceof Error ? error.message : 'Erro desconhecido');
      return false;
    }
  }

  static async getUnreadCount(userId: string): Promise<number> {
    try {
      const {data, error} = await supabase.rpc('get_unread_notifications_count');

      if (error) {
        console.error('Erro ao obter contagem:', error.message);
        return 0;
      }

      return data || 0;
    } catch (error) {
      console.error('Erro ao obter contagem de não lidas:', error instanceof Error ? error.message : 'Erro desconhecido');
      return 0;
    }
  }

  static async getUnreadNotifications(userId: string): Promise<NotificationData[]> {
    const {data} = await this.getUserNotifications(userId, 1, 50, {unreadOnly: true});
    return data;
  }

  static async getNotificationsByType(
    userId: string,
    type: string,
    limit: number = 20
  ): Promise<NotificationData[]> {
    const {data} = await this.getUserNotifications(userId, 1, limit, {type});
    return data;
  }

  static async getNotificationById(notificationId: string): Promise<NotificationData | null> {
    try {
      const {data, error} = await supabase
        .from('notifications')
        .select('*')
        .eq('id', notificationId)
        .single();

      if (error) {
        console.error('Erro ao buscar notificação:', error.message);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Erro ao buscar notificação por ID:', error instanceof Error ? error.message : 'Erro desconhecido');
      return null;
    }
  }

  static async markAllAsRead(userId: string): Promise<number> {
    try {
      const {data, error} = await supabase.rpc('mark_all_notifications_as_read');

      if (error) {
        console.error('Erro ao marcar todas como lidas:', error.message);
        return 0;
      }

      return data || 0;
    } catch (error) {
      console.error('Erro ao marcar todas as notificações como lidas:', error instanceof Error ? error.message : 'Erro desconhecido');
      return 0;
    }
  }

  static async deleteNotification(notificationId: string): Promise<boolean> {
    try {
      const {error} = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) {
        console.error('Erro ao deletar notificação:', error.message);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao deletar notificação:', error instanceof Error ? error.message : 'Erro desconhecido');
      return false;
    }
  }

  static async getUserStats(userId: string): Promise<NotificationStats | null> {
    try {
      const {data, error} = await supabase
        .from('user_notification_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        // Se não há estatísticas (usuário sem notificações), retornar estrutura vazia
        if (error.code === 'PGRST116') {
          return {
            user_id: userId,
            total_notifications: 0,
            unread_count: 0,
            read_count: 0,
            last_24h_count: 0,
            last_week_count: 0,
            last_month_count: 0
          };
        }
        console.error('Erro ao obter estatísticas:', error.message);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Erro ao obter estatísticas do usuário:', error instanceof Error ? error.message : 'Erro desconhecido');
      return null;
    }
  }

  static async syncNotifications(
    userId: string,
    lastSyncDate?: string
  ): Promise<NotificationData[]> {
    try {
      let query = supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', {ascending: false});

      if (lastSyncDate) {
        query = query.gt('created_at', lastSyncDate);
      }

      const {data, error} = await query;

      if (error) {
        console.error('Erro na sincronização:', error.message);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Erro ao sincronizar notificações:', error instanceof Error ? error.message : 'Erro desconhecido');
      return [];
    }
  }

  static subscribeToNotifications(
    userId: string,
    onNotification: (notification: NotificationData) => void,
    onUpdate: (notification: NotificationData) => void,
    onDelete: (notificationId: string) => void
  ) {
    const subscription = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          onNotification(payload.new as NotificationData);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          onUpdate(payload.new as NotificationData);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          onDelete(payload.old.id);
        }
      )
      .subscribe();

    return subscription;
  }

  static unsubscribeFromNotifications(subscription: any) {
    if (subscription) {
      supabase.removeChannel(subscription);
    }
  }
}
