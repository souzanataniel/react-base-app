import React from 'react';
import {Avatar, Button, Card, ScrollView, Separator, Text, XStack, YStack} from 'tamagui';
import {Activity, Bell, Calendar, Clock, TrendingUp, Users} from '@tamagui/lucide-icons';
import {useAuth} from '@/features/auth';
import {format} from '@/shared/utils';
import {BaseScreen} from '@/shared/components/layout';
import {HomeHeader} from '@/features/home/components/HomeHeader';

export const HomeScreen = () => {
  const {user, userName} = useAuth();

  // Dados mock para demonstração
  const stats = [
    {label: 'Atividades', value: '12', icon: Activity, color: '$blue9'},
    {label: 'Notificações', value: '3', icon: Bell, color: '$orange9'},
    {label: 'Progresso', value: '85%', icon: TrendingUp, color: '$green9'},
  ];

  const recentActivities = [
    {title: 'Login realizado', time: '2 min atrás', type: 'auth'},
    {title: 'Perfil atualizado', time: '1 hora atrás', type: 'profile'},
    {title: 'Nova configuração', time: '3 horas atrás', type: 'settings'},
  ];

  const handleSearch = () => {
    // Sua lógica de pesquisa
    console.log('Abrir pesquisa');
  };

  const handleNotifications = () => {
    // Sua lógica de notificações
    console.log('Abrir notificações');
  };

  return (
    <BaseScreen>
      <HomeHeader
        onSearchPress={handleSearch}
        onNotificationPress={handleNotifications}
        title={user?.name}
      />
      <ScrollView
        flex={1}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <YStack padding="$4" gap="$4">
          {/* Welcome Card */}
          <Card
            backgroundColor="$oceanDark"
            padding="$4"
            borderRadius="$4"
            elevate
          >
            <XStack alignItems="center" gap="$4">
              <Avatar circular size="$6" backgroundColor="$blue5">
                <Avatar.Image source={{uri: user?.avatar}}/>
                <Avatar.Fallback backgroundColor="$blue9">
                  <Text color="$white" fontSize="$6" fontWeight="bold">
                    {format.initials(user?.name || 'User')}
                  </Text>
                </Avatar.Fallback>
              </Avatar>

              <YStack flex={1}>
                <Text color="$white" fontSize="$6" fontWeight="bold">
                  Bem-vindo de volta!
                </Text>
                <Text color="$white" fontSize="$4" opacity={0.8}>
                  {user?.name || 'Usuário'}
                </Text>
                <Text color="$white" fontSize="$3" opacity={0.6}>
                  {user?.email}
                </Text>
                {user?.lastLoginAt && (
                  <Text color="$white" fontSize="$2" opacity={0.5} marginTop="$1">
                    Último acesso: {format.relativeTime(new Date(user.lastLoginAt))}
                  </Text>
                )}
              </YStack>
            </XStack>
          </Card>

          {/* Stats Cards */}
          <YStack gap="$3">
            <Text fontSize="$5" fontWeight="600" color="$color12">
              Resumo
            </Text>

            <XStack gap="$3">
              {stats.map((stat, index) => (
                <Card
                  key={index}
                  flex={1}
                  padding="$3"
                  backgroundColor="$background"
                  borderColor="$borderColor"
                  borderWidth={1}
                  pressStyle={{scale: 0.98}}
                >
                  <YStack alignItems="center" gap="$2">
                    <stat.icon size={24} color={stat.color}/>
                    <Text fontSize="$6" fontWeight="bold" color="$color12">
                      {stat.value}
                    </Text>
                    <Text fontSize="$2" color="$color10" textAlign="center">
                      {stat.label}
                    </Text>
                  </YStack>
                </Card>
              ))}
            </XStack>
          </YStack>

          {/* Quick Actions */}
          <YStack gap="$3">
            <Text fontSize="$5" fontWeight="600" color="$color12">
              Ações Rápidas
            </Text>

            <XStack gap="$3">
              <Button
                flex={1}
                backgroundColor="$blue9"
                pressStyle={{scale: 0.98}}
                borderRadius="$3"
              >
                <XStack alignItems="center" gap="$2">
                  <Calendar size={16} color="white"/>
                  <Text color="$white" fontSize="$3">Agenda</Text>
                </XStack>
              </Button>

              <Button
                flex={1}
                backgroundColor="$green9"
                pressStyle={{scale: 0.98}}
                borderRadius="$3"
              >
                <XStack alignItems="center" gap="$2">
                  <Users size={16} color="white"/>
                  <Text color="$white" fontSize="$3">Contatos</Text>
                </XStack>
              </Button>
            </XStack>
          </YStack>

          {/* Recent Activities */}
          <YStack gap="$3">
            <Text fontSize="$5" fontWeight="600" color="$color12">
              Atividades Recentes
            </Text>

            <Card
              backgroundColor="$background"
              borderColor="$borderColor"
              borderWidth={1}
              padding="$3"
            >
              <YStack gap="$3">
                {recentActivities.map((activity, index) => (
                  <React.Fragment key={index}>
                    <XStack alignItems="center" gap="$3">
                      <Clock size={16} color="$color10"/>
                      <YStack flex={1}>
                        <Text fontSize="$4" color="$color12" fontWeight="500">
                          {activity.title}
                        </Text>
                        <Text fontSize="$2" color="$color10">
                          {activity.time}
                        </Text>
                      </YStack>
                    </XStack>
                    {index < recentActivities.length - 1 && (
                      <Separator borderColor="$borderColor"/>
                    )}
                  </React.Fragment>
                ))}
              </YStack>
            </Card>
          </YStack>

          {/* Status Info */}
          <Card
            backgroundColor="$green2"
            borderColor="$green7"
            borderWidth={1}
            padding="$4"
          >
            <XStack alignItems="center" gap="$3">
              <TrendingUp size={20} color="$green10"/>
              <YStack flex={1}>
                <Text fontSize="$4" color="$green12" fontWeight="600">
                  Tudo funcionando perfeitamente
                </Text>
                <Text fontSize="$3" color="$green11">
                  Sistema operando normalmente
                </Text>
              </YStack>
            </XStack>
          </Card>

        </YStack>
      </ScrollView>
    </BaseScreen>
  );
}
