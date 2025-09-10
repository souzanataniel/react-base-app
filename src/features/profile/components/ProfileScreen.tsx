import React from 'react';
import {Avatar, Button, Card, ScrollView, Separator, Text, XStack, YStack} from 'tamagui';
import {Bell, Calendar, Edit3, Eye, Mail, MapPin, Shield} from '@tamagui/lucide-icons';
import {format} from '@/shared/utils';
import {BaseScreen} from '@/shared/components/layout';
import {useAuth} from '@/features/auth/hooks/useAuth';

export const ProfileScreen = () => {
  const {user, signOut} = useAuth();

  const profileItems = [
    {
      icon: Mail,
      label: 'E-mail',
      value: user?.email || 'Não informado',
      action: 'Alterar'
    },
    {
      icon: Calendar,
      label: 'Membro desde',
      value: user?.createdAt ? format.date(new Date(user.createdAt), 'long') : 'Não informado',
      action: null
    },
    {
      icon: MapPin,
      label: 'Localização',
      value: 'Não informado',
      action: 'Adicionar'
    },
  ];

  const settingsItems = [
    {
      icon: Shield,
      label: 'Segurança',
      description: 'Senha e autenticação',
      action: () => console.log('Abrir segurança')
    },
    {
      icon: Bell,
      label: 'Notificações',
      description: 'Preferências de notificação',
      action: () => console.log('Abrir notificações')
    },
    {
      icon: Eye,
      label: 'Privacidade',
      description: 'Controle de dados',
      action: () => console.log('Abrir privacidade')
    },
  ];

  return (
    <BaseScreen>

      <ScrollView flex={1} backgroundColor="$background">
        <YStack padding="$4" gap="$4">

          {/* Profile Header */}
          <Card
            backgroundColor="$background"
            borderColor="$borderColor"
            borderWidth={1}
            padding="$4"
          >
            <YStack alignItems="center" gap="$4">
              <Avatar circular size="$8" backgroundColor="$blue5">
                <Avatar.Image source={{uri: user?.avatar}}/>
                <Avatar.Fallback backgroundColor="$oceanDark">
                  <Text color="$white" fontSize="$8" fontWeight="bold">
                    {format.initials(user?.name || 'User')}
                  </Text>
                </Avatar.Fallback>
              </Avatar>

              <YStack alignItems="center" gap="$2">
                <Text fontSize="$7" fontWeight="bold" color="$color12">
                  {user?.name || 'Nome do Usuário'}
                </Text>
                <Text fontSize="$4" color="$color10">
                  {user?.email}
                </Text>
                {user?.emailVerified && (
                  <XStack alignItems="center" gap="$2">
                    <Shield size={16} color="$green10"/>
                    <Text fontSize="$3" color="$green10">
                      E-mail verificado
                    </Text>
                  </XStack>
                )}
              </YStack>

              <Button
                backgroundColor="$oceanDark"
                color="$white"
                size="$4"
                borderRadius="$3"
                pressStyle={{scale: 0.98}}
              >
                <XStack alignItems="center" gap="$2">
                  <Edit3 size={16} color="white"/>
                  <Text color="$white" fontSize="$4">Editar Perfil</Text>
                </XStack>
              </Button>
            </YStack>
          </Card>

          {/* Profile Information */}
          <YStack gap="$3">
            <Text fontSize="$5" fontWeight="600" color="$color12">
              Informações Pessoais
            </Text>

            <Card
              backgroundColor="$background"
              borderColor="$borderColor"
              borderWidth={1}
              padding="$3"
            >
              <YStack gap="$3">
                {profileItems.map((item, index) => (
                  <React.Fragment key={index}>
                    <XStack alignItems="center" justifyContent="space-between">
                      <XStack alignItems="center" gap="$3" flex={1}>
                        <item.icon size={20} color="$color10"/>
                        <YStack flex={1}>
                          <Text fontSize="$4" color="$color12" fontWeight="500">
                            {item.label}
                          </Text>
                          <Text fontSize="$3" color="$color10">
                            {item.value}
                          </Text>
                        </YStack>
                      </XStack>
                      {item.action && (
                        <Button
                          size="$2"
                          variant="outlined"
                          borderColor="$oceanDark"
                          color="$oceanDark"
                          pressStyle={{scale: 0.95}}
                        >
                          <Text fontSize="$2" color="$oceanDark">
                            {item.action}
                          </Text>
                        </Button>
                      )}
                    </XStack>
                    {index < profileItems.length - 1 && (
                      <Separator borderColor="$borderColor"/>
                    )}
                  </React.Fragment>
                ))}
              </YStack>
            </Card>
          </YStack>

          {/* Account Settings */}
          <YStack gap="$3">
            <Text fontSize="$5" fontWeight="600" color="$color12">
              Configurações da Conta
            </Text>

            <Card
              backgroundColor="$background"
              borderColor="$borderColor"
              borderWidth={1}
              padding="$3"
            >
              <YStack gap="$3">
                {settingsItems.map((item, index) => (
                  <React.Fragment key={index}>
                    <XStack
                      alignItems="center"
                      justifyContent="space-between"
                      pressStyle={{opacity: 0.7}}
                      onPress={item.action}
                    >
                      <XStack alignItems="center" gap="$3" flex={1}>
                        <item.icon size={20} color="$color10"/>
                        <YStack flex={1}>
                          <Text fontSize="$4" color="$color12" fontWeight="500">
                            {item.label}
                          </Text>
                          <Text fontSize="$3" color="$color10">
                            {item.description}
                          </Text>
                        </YStack>
                      </XStack>
                      <Text fontSize="$4" color="$color8">
                        →
                      </Text>
                    </XStack>
                    {index < settingsItems.length - 1 && (
                      <Separator borderColor="$borderColor"/>
                    )}
                  </React.Fragment>
                ))}
              </YStack>
            </Card>
          </YStack>

          {/* Account Stats */}
          <Card
            backgroundColor="$blue2"
            borderColor="$blue7"
            borderWidth={1}
            padding="$4"
          >
            <YStack gap="$3">
              <Text fontSize="$5" fontWeight="600" color="$blue12">
                Estatísticas da Conta
              </Text>

              <XStack justifyContent="space-between">
                <YStack alignItems="center">
                  <Text fontSize="$6" fontWeight="bold" color="$blue12">
                    {user?.createdAt ? Math.floor(
                      (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)
                    ) : 0}
                  </Text>
                  <Text fontSize="$2" color="$blue11">
                    Dias como membro
                  </Text>
                </YStack>

                <YStack alignItems="center">
                  <Text fontSize="$6" fontWeight="bold" color="$blue12">
                    {user?.lastLoginAt ? format.relativeTime(new Date(user.lastLoginAt)) : 'Agora'}
                  </Text>
                  <Text fontSize="$2" color="$blue11">
                    Último acesso
                  </Text>
                </YStack>

                <YStack alignItems="center">
                  <Text fontSize="$6" fontWeight="bold" color="$blue12">
                    100%
                  </Text>
                  <Text fontSize="$2" color="$blue11">
                    Perfil completo
                  </Text>
                </YStack>
              </XStack>
            </YStack>
          </Card>

          <Card
            backgroundColor="$background"
            borderColor="$borderColor"
            borderWidth={1}
            padding="$4"
          >
            <Button
              backgroundColor="$orange9"
              color="$white"
              size="$4"
              borderRadius="$3"
              pressStyle={{scale: 0.98}}
              onPress={signOut}
            >
              <Text color="$white" fontSize="$4" fontWeight="500">
                Sair da Conta
              </Text>
            </Button>
          </Card>

          {/* Danger Zone */}
          <Card
            backgroundColor="$red2"
            borderColor="$red7"
            borderWidth={1}
            padding="$4"
          >
            <YStack gap="$3">
              <Text fontSize="$5" fontWeight="600" color="$red12">
                Zona de Perigo
              </Text>

              <XStack justifyContent="space-between" alignItems="center">
                <YStack flex={1}>
                  <Text fontSize="$4" color="$red12" fontWeight="500">
                    Excluir Conta
                  </Text>
                  <Text fontSize="$3" color="$red11">
                    Esta ação não pode ser desfeita
                  </Text>
                </YStack>

                <Button
                  backgroundColor="$red9"
                  color="$white"
                  size="$3"
                  pressStyle={{scale: 0.95}}
                  onPress={() => console.log('Confirmar exclusão')}
                >
                  <Text color="$white" fontSize="$3">
                    Excluir
                  </Text>
                </Button>
              </XStack>
            </YStack>
          </Card>

        </YStack>
      </ScrollView>
    </BaseScreen>
  );
}
