import {AppState} from 'react-native';
import {supabase} from '@/lib/supabase';
import {NotificationService} from './notificationService';

class NotificationManager {
  private userId: string | null = null;
  private unreadCount: number = 0;
  private listeners: Set<() => void> = new Set();
  private channel: any = null;

  setUserId(userId: string | null) {
    if (this.userId === userId) return;

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
      this.unreadCount = count;
      this.notifyListeners();
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    // Chamar imediatamente com estado atual
    listener();

    return () => {
      this.listeners.delete(listener);
    };
  }

  private connect() {
    if (!this.userId || this.channel) return;

    console.log('[MANAGER] Conectando realtime...');

    this.channel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${this.userId}`
        },
        (payload) => {
          console.log('[MANAGER] Evento recebido:', payload.eventType);
          // Recarregar contador para qualquer mudança
          this.loadCounter();
        }
      )
      .subscribe((status) => {
        console.log('[MANAGER] Status subscription:', status);
      });
  }

  private disconnect() {
    if (this.channel) {
      supabase.removeChannel(this.channel);
      this.channel = null;
    }
  }

  // Métodos públicos
  getUnreadCount(): number {
    return this.unreadCount;
  }

  async refresh() {
    await this.loadCounter();
  }

  // Método para forçar atualização da tela
  async triggerUpdate() {
    this.notifyListeners();
  }

  getDebugInfo() {
    return {
      userId: this.userId,
      unreadCount: this.unreadCount,
      isConnected: !!this.channel,
      hasSubscription: !!this.channel,
      listenersCount: this.listeners.size,
      appState: AppState.currentState
    };
  }
}

export const notificationManager = new NotificationManager();
