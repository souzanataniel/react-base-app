import { supabase } from '@/lib/supabase';
import { NotificationService } from './notificationService';
import { networkMonitor } from './networkMonitor';

interface ManagerState {
  userId: string | null;
  unreadCount: number;
  isConnected: boolean;
  isConnecting: boolean;
  lastSyncTime: number;
  connectionAttempts: number;
}

class NotificationManager {
  private state: ManagerState = {
    userId: null,
    unreadCount: 0,
    isConnected: false,
    isConnecting: false,
    lastSyncTime: 0,
    connectionAttempts: 0
  };

  private listeners: Set<(count: number) => void> = new Set();
  private channel: any = null;
  private reconnectTimeout: number | null = null;
  private heartbeatInterval: number | null = null;
  private loadCounterDebounceTimeout: number | null = null;

  // Configurações
  private readonly MAX_RECONNECT_ATTEMPTS = 5;
  private readonly RECONNECT_BASE_DELAY = 1000; // 1s
  private readonly HEARTBEAT_INTERVAL = 30000; // 30s
  private readonly DEBOUNCE_DELAY = 300; // 300ms

  constructor() {
    this.setupNetworkMonitoring();
  }

  private setupNetworkMonitoring() {
    // Reconectar quando rede voltar
    networkMonitor.onNetworkChange((isConnected) => {
      console.log('[MANAGER] Mudança de rede detectada:', isConnected);

      if (isConnected && this.state.userId && !this.state.isConnected) {
        console.log('[MANAGER] Rede restaurada, reconectando...');
        this.reconnect();
      } else if (!isConnected && this.state.isConnected) {
        console.log('[MANAGER] Rede perdida, marcando como desconectado');
        this.state.isConnected = false;
      }
    });

    // Reconectar quando app voltar ao foreground
    networkMonitor.onAppStateChange((appState) => {
      if (appState === 'active' && this.state.userId && !this.state.isConnected) {
        console.log('[MANAGER] App voltou ao foreground, reconectando...');
        this.reconnect();
      }
    });
  }

  async setUserId(userId: string | null) {
    if (this.state.userId === userId) {
      console.log('[MANAGER] UserId já é o mesmo, ignorando');
      return;
    }

    console.log('[MANAGER] Mudando userId:', { from: this.state.userId, to: userId });

    // Limpar recursos do usuário anterior
    await this.cleanup();

    this.state.userId = userId;
    this.state.connectionAttempts = 0;

    if (userId) {
      await this.initialize();
    } else {
      this.updateCounter(0);
    }
  }

  private async initialize() {
    console.log('[MANAGER] Inicializando para userId:', this.state.userId);

    // Carregar contador inicial
    await this.loadCounterImmediate();

    // Conectar realtime
    await this.connect();

    // Iniciar heartbeat
    this.startHeartbeat();
  }

  private async cleanup() {
    console.log('[MANAGER] Limpando recursos');

    this.clearReconnectTimeout();
    this.stopHeartbeat();
    this.clearDebounceTimeout();
    await this.disconnect();

    this.state.isConnected = false;
    this.state.isConnecting = false;
    this.state.connectionAttempts = 0;
  }

  private async loadCounterImmediate() {
    if (!this.state.userId) return;

    try {
      console.log('[MANAGER] Carregando contador (imediato)');
      const count = await NotificationService.getUnreadCount(this.state.userId);
      this.updateCounter(count);
      this.state.lastSyncTime = Date.now();
    } catch (error) {
      console.error('[MANAGER] Erro ao carregar contador:', error);
    }
  }

  private loadCounterDebounced() {
    // Cancelar timeout anterior
    this.clearDebounceTimeout();

    // Criar novo timeout
    this.loadCounterDebounceTimeout = setTimeout(() => {
      this.loadCounterImmediate();
    }, this.DEBOUNCE_DELAY);
  }

  private clearDebounceTimeout() {
    if (this.loadCounterDebounceTimeout) {
      clearTimeout(this.loadCounterDebounceTimeout);
      this.loadCounterDebounceTimeout = null;
    }
  }

  private updateCounter(count: number) {
    if (this.state.unreadCount !== count) {
      console.log('[MANAGER] Contador atualizado:', { from: this.state.unreadCount, to: count });
      this.state.unreadCount = count;
      this.notifyListeners();
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => {
      try {
        listener(this.state.unreadCount);
      } catch (error) {
        console.error('[MANAGER] Erro ao notificar listener:', error);
      }
    });
  }

  subscribe(listener: (count: number) => void): () => void {
    this.listeners.add(listener);

    // Notificar imediatamente com valor atual
    try {
      listener(this.state.unreadCount);
    } catch (error) {
      console.error('[MANAGER] Erro ao notificar novo listener:', error);
    }

    return () => {
      this.listeners.delete(listener);
    };
  }

  private async connect() {
    if (!this.state.userId) {
      console.log('[MANAGER] Não conectando: userId não definido');
      return;
    }

    if (!networkMonitor.getIsConnected()) {
      console.log('[MANAGER] Não conectando: sem rede');
      return;
    }

    if (this.state.isConnecting) {
      console.log('[MANAGER] Já está conectando, aguardando...');
      return;
    }

    if (this.state.isConnected) {
      console.log('[MANAGER] Já está conectado');
      return;
    }

    // Desconectar canal anterior se existir
    if (this.channel) {
      await this.disconnect();
    }

    this.state.isConnecting = true;
    console.log('[MANAGER] Iniciando conexão realtime para userId:', this.state.userId);

    try {
      const channelName = `notifications_${this.state.userId}_${Date.now()}`;

      this.channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${this.state.userId}`
          },
          (payload) => {
            console.log('[MANAGER] Evento realtime recebido:', {
              event: payload.eventType,
              timestamp: new Date().toISOString()
            });

            // Usar debounce para evitar múltiplas chamadas
            this.loadCounterDebounced();
          }
        )
        .subscribe((status) => {
          console.log('[MANAGER] Status da subscription:', status);

          if (status === 'SUBSCRIBED') {
            this.state.isConnected = true;
            this.state.isConnecting = false;
            this.state.connectionAttempts = 0;
            console.log('[MANAGER] ✅ Conectado com sucesso!');
          } else if (status === 'CHANNEL_ERROR' || status === 'CLOSED') {
            this.state.isConnected = false;
            this.state.isConnecting = false;
            console.error('[MANAGER] ❌ Erro na conexão');
            this.scheduleReconnect();
          } else if (status === 'TIMED_OUT') {
            this.state.isConnected = false;
            this.state.isConnecting = false;
            console.error('[MANAGER] ⏱️ Timeout na conexão');
            this.scheduleReconnect();
          }
        });

    } catch (error) {
      console.error('[MANAGER] Erro ao conectar realtime:', error);
      this.state.isConnecting = false;
      this.state.isConnected = false;
      this.scheduleReconnect();
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

    this.state.isConnected = false;
    this.state.isConnecting = false;
  }

  private scheduleReconnect() {
    if (this.state.connectionAttempts >= this.MAX_RECONNECT_ATTEMPTS) {
      console.error('[MANAGER] Máximo de tentativas de reconexão atingido');
      return;
    }

    this.clearReconnectTimeout();

    // Backoff exponencial: 1s, 2s, 4s, 8s, 16s
    const delay = this.RECONNECT_BASE_DELAY * Math.pow(2, this.state.connectionAttempts);
    this.state.connectionAttempts++;

    console.log('[MANAGER] Agendando reconexão em', delay, 'ms (tentativa', this.state.connectionAttempts, ')');

    this.reconnectTimeout = setTimeout(() => {
      if (this.state.userId && !this.state.isConnected) {
        this.connect();
      }
    }, delay);
  }

  private clearReconnectTimeout() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }

  private startHeartbeat() {
    this.stopHeartbeat();

    this.heartbeatInterval = setInterval(() => {
      if (!this.state.isConnected && this.state.userId && networkMonitor.getIsConnected()) {
        console.log('[MANAGER] 💓 Heartbeat: conexão perdida, reconectando...');
        this.reconnect();
      }
    }, this.HEARTBEAT_INTERVAL);
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  // Métodos públicos
  getUnreadCount(): number {
    return this.state.unreadCount;
  }

  isConnected(): boolean {
    return this.state.isConnected;
  }

  async refresh() {
    console.log('[MANAGER] Refresh manual solicitado');
    await this.loadCounterImmediate();
  }

  async reconnect() {
    console.log('[MANAGER] Reconexão manual solicitada');
    this.state.connectionAttempts = 0;
    await this.disconnect();
    await this.connect();
  }

  getDebugInfo() {
    return {
      ...this.state,
      hasChannel: !!this.channel,
      channelState: this.channel?.state || 'none',
      listenersCount: this.listeners.size,
      networkConnected: networkMonitor.getIsConnected(),
      appActive: networkMonitor.isAppActive(),
      timeSinceLastSync: Date.now() - this.state.lastSyncTime
    };
  }
}

export const notificationManager = new NotificationManager();
