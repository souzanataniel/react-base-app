import React, {useCallback, useState} from 'react';
import {Button, Card, ScrollView, Separator, Switch, Text, XStack, YStack} from 'tamagui';
import {
  Bell,
  Database,
  Download,
  Globe,
  HelpCircle,
  Info,
  MessageSquare,
  Moon,
  Shield,
  Trash2
} from '@tamagui/lucide-icons';

export const SettingsScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  // Memoizar as ações para evitar re-renderizações
  const handleLanguagePress = useCallback(() => {
    console.log('Abrir idiomas');
  }, []);

  const handleSecurityPress = useCallback(() => {
    console.log('Abrir segurança');
  }, []);

  const handleBackupPress = useCallback(() => {
    console.log('Fazer backup');
  }, []);

  const handleHelpPress = useCallback(() => {
    console.log('Abrir ajuda');
  }, []);

  const handleFeedbackPress = useCallback(() => {
    console.log('Enviar feedback');
  }, []);

  const handleAboutPress = useCallback(() => {
    console.log('Sobre o app');
  }, []);

  const handleExportPress = useCallback(() => {
    console.log('Exportar dados');
  }, []);

  const handleClearCachePress = useCallback(() => {
    console.log('Limpar cache');
  }, []);

  const handleClearStoragePress = useCallback(() => {
    console.log('Limpar AsyncStorage');
  }, []);

  const handleViewLogsPress = useCallback(() => {
    console.log('Ver logs');
  }, []);

  const generalSettings = [
    {
      icon: Bell,
      label: 'Notificações',
      description: 'Gerenciar todas as notificações',
      type: 'switch' as const,
      value: notificationsEnabled,
      onValueChange: setNotificationsEnabled
    },
    {
      icon: Moon,
      label: 'Modo Escuro',
      description: 'Ativar tema escuro',
      type: 'switch' as const,
      value: darkMode,
      onValueChange: setDarkMode
    },
    {
      icon: Globe,
      label: 'Idioma',
      description: 'Português (Brasil)',
      type: 'navigation' as const,
      action: handleLanguagePress
    },
  ];

  const notificationSettings = [
    {
      label: 'Notificações por E-mail',
      description: 'Receber atualizações por e-mail',
      value: emailNotifications,
      onValueChange: setEmailNotifications
    },
    {
      label: 'Notificações Push',
      description: 'Notificações no dispositivo',
      value: pushNotifications,
      onValueChange: setPushNotifications
    },
  ];

  const securitySettings = [
    {
      icon: Shield,
      label: 'Segurança',
      description: 'Senha e autenticação',
      action: handleSecurityPress
    },
    {
      icon: Database,
      label: 'Backup de Dados',
      description: 'Fazer backup das configurações',
      action: handleBackupPress
    },
  ];

  const supportSettings = [
    {
      icon: HelpCircle,
      label: 'Ajuda',
      description: 'Central de ajuda e FAQ',
      action: handleHelpPress
    },
    {
      icon: MessageSquare,
      label: 'Feedback',
      description: 'Enviar sugestões',
      action: handleFeedbackPress
    },
    {
      icon: Info,
      label: 'Sobre',
      description: 'Versão 1.0.0',
      action: handleAboutPress
    },
  ];

  const dataSettings = [
    {
      icon: Download,
      label: 'Exportar Dados',
      description: 'Baixar seus dados',
      action: handleExportPress,
      color: '$blue9'
    },
    {
      icon: Trash2,
      label: 'Limpar Cache',
      description: 'Limpar dados temporários',
      action: handleClearCachePress,
      color: '$orange9'
    },
  ];

  return (
    <ScrollView flex={1} backgroundColor="$baseBackground">
      <YStack padding="$4" gap="$4">

        {/* General Settings */}
        <YStack gap="$3">
          <Text fontSize="$5" fontWeight="600" color="$color12">
            Geral
          </Text>

          <Card
            backgroundColor="$baseBackground"
            borderColor="$borderColor"
            borderWidth={1}
            padding="$3"
          >
            <YStack gap="$3">
              {generalSettings.map((setting, index) => (
                <React.Fragment key={setting.label}>
                  <XStack alignItems="center" justifyContent="space-between">
                    <XStack alignItems="center" gap="$3" flex={1}>
                      <setting.icon size={20} color="$color10"/>
                      <YStack flex={1}>
                        <Text fontSize="$4" color="$color12" fontWeight="500">
                          {setting.label}
                        </Text>
                        <Text fontSize="$3" color="$color10">
                          {setting.description}
                        </Text>
                      </YStack>
                    </XStack>

                    {setting.type === 'switch' ? (
                      <Switch
                        checked={setting.value}
                        onCheckedChange={setting.onValueChange}
                        backgroundColor={setting.value ? '$oceanDark' : '$color5'}
                      />
                    ) : (
                      <XStack
                        alignItems="center"
                        pressStyle={{opacity: 0.7}}
                        onPress={setting.action}
                      >
                        <Text fontSize="$4" color="$color8">→</Text>
                      </XStack>
                    )}
                  </XStack>
                  {index < generalSettings.length - 1 && (
                    <Separator borderColor="$borderColor"/>
                  )}
                </React.Fragment>
              ))}
            </YStack>
          </Card>
        </YStack>

        {/* Notification Settings */}
        {notificationsEnabled && (
          <YStack gap="$3">
            <Text fontSize="$5" fontWeight="600" color="$color12">
              Configurações de Notificação
            </Text>

            <Card
              backgroundColor="$background"
              borderColor="$borderColor"
              borderWidth={1}
              padding="$3"
            >
              <YStack gap="$3">
                {notificationSettings.map((setting, index) => (
                  <React.Fragment key={setting.label}>
                    <XStack alignItems="center" justifyContent="space-between">
                      <YStack flex={1}>
                        <Text fontSize="$4" color="$color12" fontWeight="500">
                          {setting.label}
                        </Text>
                        <Text fontSize="$3" color="$color10">
                          {setting.description}
                        </Text>
                      </YStack>

                      <Switch
                        checked={setting.value}
                        onCheckedChange={setting.onValueChange}
                        backgroundColor={setting.value ? '$oceanDark' : '$color5'}
                      />
                    </XStack>
                    {index < notificationSettings.length - 1 && (
                      <Separator borderColor="$borderColor"/>
                    )}
                  </React.Fragment>
                ))}
              </YStack>
            </Card>
          </YStack>
        )}

        {/* Security Settings */}
        <YStack gap="$3">
          <Text fontSize="$5" fontWeight="600" color="$color12">
            Segurança e Privacidade
          </Text>

          <Card
            backgroundColor="$background"
            borderColor="$borderColor"
            borderWidth={1}
            padding="$3"
          >
            <YStack gap="$3">
              {securitySettings.map((setting, index) => (
                <React.Fragment key={setting.label}>
                  <XStack
                    alignItems="center"
                    justifyContent="space-between"
                    pressStyle={{opacity: 0.7}}
                    onPress={setting.action}
                  >
                    <XStack alignItems="center" gap="$3" flex={1}>
                      <setting.icon size={20} color="$color10"/>
                      <YStack flex={1}>
                        <Text fontSize="$4" color="$color12" fontWeight="500">
                          {setting.label}
                        </Text>
                        <Text fontSize="$3" color="$color10">
                          {setting.description}
                        </Text>
                      </YStack>
                    </XStack>
                    <Text fontSize="$4" color="$color8">→</Text>
                  </XStack>
                  {index < securitySettings.length - 1 && (
                    <Separator borderColor="$borderColor"/>
                  )}
                </React.Fragment>
              ))}
            </YStack>
          </Card>
        </YStack>

        {/* Support and Help */}
        <YStack gap="$3">
          <Text fontSize="$5" fontWeight="600" color="$color12">
            Suporte e Ajuda
          </Text>

          <Card
            backgroundColor="$background"
            borderColor="$borderColor"
            borderWidth={1}
            padding="$3"
          >
            <YStack gap="$3">
              {supportSettings.map((setting, index) => (
                <React.Fragment key={setting.label}>
                  <XStack
                    alignItems="center"
                    justifyContent="space-between"
                    pressStyle={{opacity: 0.7}}
                    onPress={setting.action}
                  >
                    <XStack alignItems="center" gap="$3" flex={1}>
                      <setting.icon size={20} color="$color10"/>
                      <YStack flex={1}>
                        <Text fontSize="$4" color="$color12" fontWeight="500">
                          {setting.label}
                        </Text>
                        <Text fontSize="$3" color="$color10">
                          {setting.description}
                        </Text>
                      </YStack>
                    </XStack>
                    <Text fontSize="$4" color="$color8">→</Text>
                  </XStack>
                  {index < supportSettings.length - 1 && (
                    <Separator borderColor="$borderColor"/>
                  )}
                </React.Fragment>
              ))}
            </YStack>
          </Card>
        </YStack>

        {/* Data Management */}
        <YStack gap="$3">
          <Text fontSize="$5" fontWeight="600" color="$color12">
            Gerenciamento de Dados
          </Text>

          <Card
            backgroundColor="$background"
            borderColor="$borderColor"
            borderWidth={1}
            padding="$3"
          >
            <YStack gap="$3">
              {dataSettings.map((setting, index) => (
                <React.Fragment key={setting.label}>
                  <XStack
                    alignItems="center"
                    justifyContent="space-between"
                    pressStyle={{opacity: 0.7}}
                    onPress={setting.action}
                  >
                    <XStack alignItems="center" gap="$3" flex={1}>
                      <setting.icon size={20} color={setting.color || '$color10'}/>
                      <YStack flex={1}>
                        <Text fontSize="$4" color="$color12" fontWeight="500">
                          {setting.label}
                        </Text>
                        <Text fontSize="$3" color="$color10">
                          {setting.description}
                        </Text>
                      </YStack>
                    </XStack>
                    <Text fontSize="$4" color="$color8">→</Text>
                  </XStack>
                  {index < dataSettings.length - 1 && (
                    <Separator borderColor="$borderColor"/>
                  )}
                </React.Fragment>
              ))}
            </YStack>
          </Card>
        </YStack>

        {/* App Info */}
        <Card
          backgroundColor="$gray2"
          borderColor="$gray7"
          borderWidth={1}
          padding="$4"
        >
          <YStack alignItems="center" gap="$2">
            <Text fontSize="$4" color="$gray12" fontWeight="600">
              App Version
            </Text>
            <Text fontSize="$3" color="$gray11">
              1.0.0 (Build 1)
            </Text>
            <Text fontSize="$2" color="$gray10" textAlign="center">
              © 2024 Seu App. Todos os direitos reservados.
            </Text>
          </YStack>
        </Card>

        {/* Developer Options */}
        {__DEV__ && (
          <Card
            backgroundColor="$yellow2"
            borderColor="$yellow7"
            borderWidth={1}
            padding="$4"
          >
            <YStack gap="$3">
              <Text fontSize="$4" color="$yellow12" fontWeight="600">
                Opções de Desenvolvedor
              </Text>

              <XStack justifyContent="space-between">
                <Button
                  size="$3"
                  backgroundColor="$yellow9"
                  color="$white"
                  onPress={handleClearStoragePress}
                >
                  <Text color="$white" fontSize="$3">Limpar Storage</Text>
                </Button>

                <Button
                  size="$3"
                  backgroundColor="$yellow9"
                  color="$white"
                  onPress={handleViewLogsPress}
                >
                  <Text color="$white" fontSize="$3">Ver Logs</Text>
                </Button>
              </XStack>
            </YStack>
          </Card>
        )}
      </YStack>
    </ScrollView>
  );
}
