// RealtimeDebugTest.tsx - Componente para testar realtime
import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/features/auth/hooks/useAuth';

export const RealtimeDebugTest = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);

  // Teste 1: Subscription básica SEM filtro
  const testBasicSubscription = () => {
    console.log('=== TESTE 1: Subscription básica SEM filtro ===');

    if (subscription) {
      supabase.removeChannel(subscription);
    }

    const newSub = supabase
      .channel('notifications_test_basic')
      .on('postgres_changes', {
        event: '*', // Todos os eventos
        schema: 'public',
        table: 'notifications'
        // SEM filtro de user_id
      }, (payload) => {
        console.log('EVENTO BÁSICO RECEBIDO:', payload);
        setEvents(prev => [...prev, {
          type: 'basic',
          event: payload.eventType,
          timestamp: new Date().toISOString(),
          data: payload
        }]);
      })
      .subscribe((status) => {
        console.log('Status subscription básica:', status);
      });

    setSubscription(newSub);
  };

  // Teste 2: Subscription COM filtro
  const testFilteredSubscription = () => {
    console.log('=== TESTE 2: Subscription COM filtro ===');
    console.log('User ID:', user?.id);

    if (subscription) {
      supabase.removeChannel(subscription);
    }

    const newSub = supabase
      .channel('notifications_test_filtered')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user?.id}`
      }, (payload) => {
        console.log('EVENTO FILTRADO RECEBIDO:', payload);
        setEvents(prev => [...prev, {
          type: 'filtered',
          event: payload.eventType,
          timestamp: new Date().toISOString(),
          data: payload
        }]);
      })
      .subscribe((status) => {
        console.log('Status subscription filtrada:', status);
      });

    setSubscription(newSub);
  };

  // Teste 3: Inserir notificação de teste
  const insertTestNotification = async () => {
    console.log('=== TESTE 3: Inserindo notificação de teste ===');

    if (!user?.id) {
      console.log('Usuário não logado');
      return;
    }

    try {
      const testNotification = {
        user_id: user.id,
        title: `Teste Realtime ${new Date().getTime()}`,
        body: 'Esta é uma notificação de teste para realtime',
        type: 'system',
        priority: 'normal',
        is_read: false,
        push_sent: false
      };

      console.log('Inserindo:', testNotification);

      const { data, error } = await supabase
        .from('notifications')
        .insert(testNotification)
        .select()
        .single();

      if (error) {
        console.error('Erro ao inserir:', error);
      } else {
        console.log('Notificação inserida:', data);
      }
    } catch (error) {
      console.error('Erro no teste de inserção:', error);
    }
  };

  // Teste 4: Atualizar notificação existente
  const updateTestNotification = async () => {
    console.log('=== TESTE 4: Atualizando notificação existente ===');

    if (!user?.id) return;

    try {
      // Buscar uma notificação não lida
      const { data: notifications } = await supabase
        .from('notifications')
        .select('id')
        .eq('user_id', user.id)
        .eq('is_read', false)
        .limit(1);

      if (notifications && notifications.length > 0) {
        const notificationId = notifications[0].id;
        console.log('Atualizando notificação:', notificationId);

        const { error } = await supabase
          .from('notifications')
          .update({ is_read: true, read_at: new Date().toISOString() })
          .eq('id', notificationId);

        if (error) {
          console.error('Erro ao atualizar:', error);
        } else {
          console.log('Notificação atualizada com sucesso');
        }
      } else {
        console.log('Nenhuma notificação não lida encontrada');
      }
    } catch (error) {
      console.error('Erro no teste de atualização:', error);
    }
  };

  // Teste 5: Verificar RLS
  const checkRLS = async () => {
    console.log('=== TESTE 5: Verificando RLS ===');

    try {
      const { data, error } = await supabase
        .rpc('check_notifications_rls');

      console.log('Resultado RLS:', { data, error });
    } catch (error) {
      console.log('Função RLS não existe (normal)');
    }

    // Teste simples de leitura
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('id, user_id, title')
        .eq('user_id', user?.id)
        .limit(1);

      console.log('Teste de leitura:', { data, error });
    } catch (error) {
      console.error('Erro no teste de leitura:', error);
    }
  };

  const clearEvents = () => {
    setEvents([]);
  };

  const stopSubscription = () => {
    if (subscription) {
      supabase.removeChannel(subscription);
      setSubscription(null);
      console.log('Subscription removida');
    }
  };

  useEffect(() => {
    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, [subscription]);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20 }}>
        Debug Supabase Realtime
      </Text>

      <Text>User ID: {user?.id || 'Não logado'}</Text>
      <Text>Eventos recebidos: {events.length}</Text>

      <View style={{ marginVertical: 20 }}>
        <Button title="1. Teste Básico (sem filtro)" onPress={testBasicSubscription} />
        <Button title="2. Teste com Filtro" onPress={testFilteredSubscription} />
        <Button title="3. Inserir Teste" onPress={insertTestNotification} />
        <Button title="4. Atualizar Teste" onPress={updateTestNotification} />
        <Button title="5. Verificar RLS" onPress={checkRLS} />
        <Button title="Parar Subscription" onPress={stopSubscription} />
        <Button title="Limpar Eventos" onPress={clearEvents} />
      </View>

      <Text style={{ fontWeight: 'bold' }}>Eventos recebidos:</Text>
      {events.map((event, index) => (
        <View key={index} style={{ marginVertical: 5, padding: 10, backgroundColor: '#f0f0f0' }}>
          <Text>Tipo: {event.type}</Text>
          <Text>Evento: {event.event}</Text>
          <Text>Hora: {event.timestamp}</Text>
          <Text>Data: {JSON.stringify(event.data, null, 2)}</Text>
        </View>
      ))}
    </View>
  );
};
