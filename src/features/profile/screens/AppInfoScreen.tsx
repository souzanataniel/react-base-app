import React from 'react';
import {Linking, Platform, TouchableOpacity,} from 'react-native';
import {Separator, Text, useTheme, XStack, YStack,} from 'tamagui';
import {Calendar, ChevronRight, FileText, Mail, Package, Shield, Smartphone, Star,} from '@tamagui/lucide-icons';
import Constants from 'expo-constants';
import * as Application from 'expo-application';
import {LogoMediumDark} from '@/shared/components/ui/Background/Logo';

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  onPress?: () => void;
}

const InfoRow: React.FC<InfoRowProps> = ({icon, label, value, onPress}) => {
  const theme = useTheme();

  const Content = (
    <XStack
      alignItems="center"
      justifyContent="space-between"
      paddingVertical="$2"
      paddingHorizontal="$3"
      backgroundColor="$background"
      borderRadius="$3"
      pressStyle={onPress ? {
        backgroundColor: '$backgroundPress',
        scale: 0.98,
      } : undefined}
    >
      <XStack alignItems="center" gap="$2.5" flex={1}>
        {icon}
        <YStack flex={1}>
          <Text fontSize="$1" color="$colorSecondary" marginBottom="$0.5">
            {label}
          </Text>
          <Text fontSize="$3" fontWeight="600" color="$color">
            {value}
          </Text>
        </YStack>
      </XStack>
      {onPress && (
        <ChevronRight size={18} color={theme.colorSecondary?.val}/>
      )}
    </XStack>
  );

  if (onPress) {
    return <TouchableOpacity onPress={onPress}>{Content}</TouchableOpacity>;
  }

  return Content;
};

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({icon, label, onPress}) => (
  <TouchableOpacity onPress={onPress} style={{flex: 1}}>
    <XStack
      alignItems="center"
      justifyContent="center"
      paddingVertical="$2.5"
      paddingHorizontal="$3"
      backgroundColor="$background"
      borderRadius="$4"
      gap="$2"
      pressStyle={{
        backgroundColor: '$backgroundPress',
        scale: 0.98,
      }}
    >
      {icon}
      <Text fontSize="$2" fontWeight="500" color="$color">
        {label}
      </Text>
    </XStack>
  </TouchableOpacity>
);

export const AppInfoScreen: React.FC = () => {
  const theme = useTheme();

  const appVersion = Constants.expoConfig?.version || '1.0.0';
  const buildNumber = Application.nativeBuildVersion || '1';
  const appName = Constants.expoConfig?.name || 'Meu App';
  const releaseDate = '2024';

  const handleOpenUrl = (url: string) => {
    Linking.openURL(url).catch(err => console.error('Error opening URL:', err));
  };

  const handleRateApp = () => {
    const storeUrl = Platform.select({
      ios: `itms-apps://apps.apple.com/app/id${Application.applicationId}`,
      android: `market://details?id=${Application.applicationId}`,
    });
    if (storeUrl) handleOpenUrl(storeUrl);
  };

  return (
    <YStack flex={1} gap="$2.5" padding="$4">
      <YStack alignItems="center" gap="$2">
        <YStack
          width={120}
          height={120}
          borderRadius="$4"
          backgroundColor="$iconPlaceholder"
          alignItems="center"
          justifyContent="center"
        >
          <LogoMediumDark/>
        </YStack>

        <YStack alignItems="center" gap="$0.5">
          <Text fontSize="$6" fontWeight="700" color="$color">
            {appName}
          </Text>
          <Text fontSize="$2" color="$colorSecondary">
            v{appVersion} ({buildNumber})
          </Text>
        </YStack>
      </YStack>

      <Separator marginVertical="$1"/>

      {/* Informações do App */}
      <YStack gap="$1.5">
        <InfoRow
          icon={<Package size={16} color={theme.colorSecondary?.val}/>}
          label="Versão"
          value={`${appVersion} (${buildNumber})`}
        />

        <InfoRow
          icon={<Smartphone size={16} color={theme.colorSecondary?.val}/>}
          label="Plataforma"
          value={Platform.OS === 'ios' ? 'iOS' : 'Android'}
        />

        <InfoRow
          icon={<Calendar size={16} color={theme.colorSecondary?.val}/>}
          label="Lançamento"
          value={releaseDate}
        />
      </YStack>

      <Separator marginVertical="$1"/>

      {/* Ações Rápidas */}
      <XStack gap="$2">
        <ActionButton
          icon={<Star size={18} color={theme.button?.val}/>}
          label="Avaliar"
          onPress={handleRateApp}
        />
        <ActionButton
          icon={<Mail size={18} color={theme.button?.val}/>}
          label="Suporte"
          onPress={() => handleOpenUrl('mailto:contato@seuapp.com')}
        />
      </XStack>

      <Separator marginVertical="$1"/>

      {/* Links Úteis */}
      <YStack gap="$1.5">
        <InfoRow
          icon={<Shield size={16} color={theme.colorSecondary?.val}/>}
          label="Política de Privacidade"
          value="Ver documento"
          onPress={() => handleOpenUrl('https://seusite.com/privacy')}
        />

        <InfoRow
          icon={<FileText size={16} color={theme.colorSecondary?.val}/>}
          label="Termos de Uso"
          value="Ver documento"
          onPress={() => handleOpenUrl('https://seusite.com/terms')}
        />
      </YStack>

      {/* Footer */}
      <YStack alignItems="center" gap="$1" paddingTop="$2">
        <Text fontSize="$1" color="$colorSecondary" textAlign="center">
          Pac Sistemas
        </Text>
        <Text fontSize="$1" color="$colorTertiary" textAlign="center">
          © {new Date().getFullYear()}
        </Text>
      </YStack>
    </YStack>
  );
};
