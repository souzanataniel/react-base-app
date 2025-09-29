import {AppState} from 'react-native';
import {supabase} from '@/lib/supabase';
import {NotificationService} from './notificationService';

class NotificationManager {
  private userId: string | null = null;
  private unreadCount: number = 0;
  private listeners: Set<() => void> = new Set();
  private channel: any = null;
  private isConnecting: boolean = false;

  setUserId(userId: string | null) {
    if (this.userId === userId) return;

    console.log('[MANAGER] Mudando userId de', this.userId, 'para', userId);
    this.userId = userId;
    this.disconnect();

    if (userId) {
      this.loadCounter();
      this.connect();
    } else {
      this.updateCounter(0);
    }
  }

  private async loadCounter() {
    if (!this.userId) return;

    try {
      const count = await NotificationService.getUnreadCount(this.userId);
      this.updateCounter(count);
    } catch (error) {
      console.error('Erro ao carregar contador:', error);
    }
  }

  private updateCounter(count: number) {
    if (this.unreadCount !== count) {
      console.log('[MANAGER] Contador atualizado de', this.unreadCount, 'para', count);
      this.unreadCount = count;
      this.notifyListeners();
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => {
      try {
        listener();
      } catch (error) {
        console.error('[MANAGER] Erro ao notificar listener:', error);
      }
    });
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    listener();

    return () => {
      this.listeners.delete(listener);
    };
  }

  private async connect() {
    if (!this.userId) {
      console.log('[MANAGER] Não conectando: userId não definido');
      return;
    }

    if (this.channel) {
      console.log('[MANAGER] Já existe um canal ativo, desconectando primeiro');
      await this.disconnect();
    }

    if (this.isConnecting) {
      console.log('[MANAGER] Já está conectando, aguardando...');
      return;
    }

    this.isConnecting = true;
    console.log('[MANAGER] Conectando realtime para userId:', this.userId);

    try {
      // Usar nome único para o canal baseado no userId
      const channelName = `notifications-${this.userId}`;

      this.channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${this.userId}`
          },
          (payload) => {
            console.log('[MANAGER] Evento realtime recebido:', {
              eventType: payload.eventType,
              userId: this.userId,
              timestamp: new Date().toISOString()
            });

            // Recarregar contador para qualquer mudança
            this.loadCounter();
          }
        )
        .subscribe((status) => {
          console.log('[MANAGER] Status da subscription:', status);
          this.isConnecting = false;

          if (status === 'CHANNEL_ERROR' || status === 'CLOSED') {
            console.error('[MANAGER] Erro na subscription, tentando reconectar em 5s...');
            setTimeout(() => {
              if (this.userId) {
                this.connect();
              }
            }, 5000);
          }
        });

    } catch (error) {
      console.error('[MANAGER] Erro ao conectar realtime:', error);
      this.isConnecting = false;
    }
  }

  private async disconnect() {
    if (this.channel) {
      console.log('[MANAGER] Desconectando canal realtime');

      try {
        await supabase.removeChannel(this.channel);
      } catch (error) {
        console.error('[MANAGER] Erro ao remover canal:', error);
      }

      this.channel = null;
    }
    this.isConnecting = false;
  }

  // Métodos públicos
  getUnreadCount(): number {
    return this.unreadCount;
  }

  async refresh() {
    console.log('[MANAGER] Refresh manual solicitado');
    await this.loadCounter();
  }

  async triggerUpdate() {
    console.log('[MANAGER] Trigger update manual');
    this.notifyListeners();
  }

  async reconnect() {
    console.log('[MANAGER] Reconexão manual solicitada');
    if (this.userId) {
      await this.disconnect();
      await this.connect();
    }
  }

  getDebugInfo() {
    return {
      userId: this.userId,
      unreadCount: this.unreadCount,
      isConnected: !!this.channel,
      isConnecting: this.isConnecting,
      hasSubscription: !!this.channel,
      listenersCount: this.listeners.size,
      appState: AppState.currentState,
      channelState: this.channel?.state || 'none'
    };
  }

  async insertTestNotification() {
    if (!this.userId) {
      console.error('[MANAGER] Não é possível inserir: userId não definido');
      return;
    }

    try {
      const testNotification = {
        user_id: this.userId,
        title: `Teste Manager ${new Date().getTime()}`,
        body: 'Notificação de teste do NotificationManager',
        type: 'system',
        priority: 'normal',
        is_read: false,
        push_sent: false
      };

      console.log('[MANAGER] Inserindo notificação de teste:', testNotification);

      const { data, error } = await supabase
        .from('notifications')
        .insert(testNotification)
        .select()
        .single();

      if (error) {
        console.error('[MANAGER] Erro ao inserir teste:', error);
      } else {
        console.log('[MANAGER] Notificação de teste inserida:', data);
      }
    } catch (error) {
      console.error('[MANAGER] Erro no teste de inserção:', error);
    }
  }
}

export const notificationManager = new NotificationManager();
