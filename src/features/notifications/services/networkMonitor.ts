// networkMonitor.ts - Monitora estado da rede e notifica mudanças
import NetInfo from '@react-native-community/netinfo';
import { AppState, AppStateStatus } from 'react-native';

type NetworkCallback = (isConnected: boolean) => void;
type AppStateCallback = (state: AppStateStatus) => void;

class NetworkMonitor {
  private isConnected: boolean = true;
  private appState: AppStateStatus = 'active';
  private networkListeners: Set<NetworkCallback> = new Set();
  private appStateListeners: Set<AppStateCallback> = new Set();
  private unsubscribeNetInfo: (() => void) | null = null;
  private appStateSubscription: any = null;

  initialize() {
    // Monitorar conexão de rede
    this.unsubscribeNetInfo = NetInfo.addEventListener(state => {
      const wasConnected = this.isConnected;
      this.isConnected = state.isConnected ?? false;

      console.log('[NETWORK] Estado da rede:', {
        isConnected: this.isConnected,
        type: state.type,
        changed: wasConnected !== this.isConnected
      });

      if (wasConnected !== this.isConnected) {
        this.notifyNetworkListeners(this.isConnected);
      }
    });

    // Monitorar estado do app
    this.appStateSubscription = AppState.addEventListener('change', (nextAppState) => {
      const previousState = this.appState;
      this.appState = nextAppState;

      console.log('[NETWORK] App state mudou:', {
        from: previousState,
        to: nextAppState
      });

      if (previousState.match(/inactive|background/) && nextAppState === 'active') {
        console.log('[NETWORK] App voltou ao foreground');
      }

      this.notifyAppStateListeners(nextAppState);
    });
  }

  cleanup() {
    if (this.unsubscribeNetInfo) {
      this.unsubscribeNetInfo();
      this.unsubscribeNetInfo = null;
    }
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
      this.appStateSubscription = null;
    }
  }

  private notifyNetworkListeners(isConnected: boolean) {
    this.networkListeners.forEach(callback => {
      try {
        callback(isConnected);
      } catch (error) {
        console.error('[NETWORK] Erro ao notificar listener de rede:', error);
      }
    });
  }

  private notifyAppStateListeners(state: AppStateStatus) {
    this.appStateListeners.forEach(callback => {
      try {
        callback(state);
      } catch (error) {
        console.error('[NETWORK] Erro ao notificar listener de app state:', error);
      }
    });
  }

  onNetworkChange(callback: NetworkCallback): () => void {
    this.networkListeners.add(callback);
    return () => this.networkListeners.delete(callback);
  }

  onAppStateChange(callback: AppStateCallback): () => void {
    this.appStateListeners.add(callback);
    return () => this.appStateListeners.delete(callback);
  }

  getIsConnected(): boolean {
    return this.isConnected;
  }

  getAppState(): AppStateStatus {
    return this.appState;
  }

  isAppActive(): boolean {
    return this.appState === 'active';
  }
}

export const networkMonitor = new NetworkMonitor();
