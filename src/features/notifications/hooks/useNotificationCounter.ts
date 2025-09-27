import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { AppState, AppStateStatus } from 'react-native';
import {NotificationService} from '@/features/notifications/services/notificationService';

export const useNotificationCounter = () => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadUnreadCount = async () => {
    if (!user?.id) {
      setUnreadCount(0);
      return;
    }

    setLoading(true);
    try {
      const count = await NotificationService.getUnreadCount(user.id);
      setUnreadCount(count);
    } catch (error) {
      console.error('❌ Erro ao carregar contador:', error);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Decrementar contador localmente (otimistic update)
  const decrementCount = (amount: number = 1) => {
    setUnreadCount(prev => Math.max(0, prev - amount));
  };

  // Incrementar contador localmente
  const incrementCount = (amount: number = 1) => {
    setUnreadCount(prev => prev + amount);
  };

  // Zerar contador
  const resetCount = () => {
    setUnreadCount(0);
  };

  // Carregar na inicialização
  useEffect(() => {
    if (user?.id) {
      loadUnreadCount();
    } else {
      setUnreadCount(0);
    }
  }, [user?.id]);

  // Recarregar quando app volta do background
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active' && user?.id) {
        loadUnreadCount();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, [user?.id]);

  return {
    unreadCount,
    loading,
    loadUnreadCount,
    decrementCount,
    incrementCount,
    resetCount,
    hasUnread: unreadCount > 0
  };
};
