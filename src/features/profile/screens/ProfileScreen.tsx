import React, {useState} from 'react';
import {BellRing, Info, Lock, LogOut, MapPin, PaintBucket, Phone, User, Vibrate} from '@tamagui/lucide-icons';
import {ListItem, ListSection, ProfileHeader} from '@/shared/components/lists';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAuth} from '@/features/auth/hooks/useAuth';
import {router} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import {useThemeManager} from '@/shared/hooks/useTheme';
import {useCommon} from '@/shared/hooks/useCommon';
import {ScreenWithBlurHeader} from '@/shared/components/layout/ScreenWithBlurHeader';

export function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [enableLocation, setEnableLocation] = useState(false);
  const [enableTactileFeedback, setEnableTactileFeedback] = useState(false);
  const [enableNotifications, setEnableNotifications] = useState(false);
  const {nextTheme, getModeDisplayName} = useThemeManager();
  const {logoutApp} = useCommon();

  const {user} = useAuth();

  const changeTheme = async () => {
    await nextTheme();
  };

  return (
    <>
      <StatusBar style="auto"/>
      <ScreenWithBlurHeader
        title="Perfil"
        onBack={() => router.push('/(app)/profile')}
        hasKeyboardInputs={true}
        hideBackButton
      >

        <ProfileHeader
          name={user?.displayName ? user?.displayName : user?.firstName + ' ' + user?.lastName}
          subtitle={user?.email}
          avatarUri="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face"
          size="medium"
          onEditPress={() => console.log('Edit profile')}
        />

        <ListSection title="Perfil">
          <ListItem
            icon={<User size={18} color="$colorInverse"/>}
            title="Informações Pessoais"
            onPress={() => router.push('/(app)/update-profile')}
          />
          <ListItem
            icon={<Phone size={18} color="$colorInverse"/>}
            title="Informações de Contato"
            onPress={() => router.push('/(app)/update-contacts')}
          />
          <ListItem
            icon={<Lock size={18} color="$colorInverse"/>}
            title="Alterar Senha"
            onPress={() => router.push('/(app)/update-password')}
          />
        </ListSection>

        {/* Seção Security */}
        <ListSection title="Segurança">
          <ListItem
            icon={<MapPin size={18} color="$colorInverse"/>}
            title="Localização"
            showSwitch={true}
            switchValue={enableLocation}
            onSwitchChange={setEnableLocation}
            showChevron={false}
          />

          <ListItem
            icon={<Vibrate size={18} color="$colorInverse"/>}
            title="Feedback Tátil"
            showSwitch={true}
            switchValue={enableTactileFeedback}
            onSwitchChange={setEnableTactileFeedback}
            showChevron={false}
          />
          <ListItem
            icon={<BellRing size={18} color="$colorInverse"/>}
            title="Notificações"
            showSwitch={true}
            switchValue={enableNotifications}
            onSwitchChange={setEnableNotifications}
            showChevron={false}
          />
        </ListSection>

        <ListSection title="Aplicação">
          <ListItem
            icon={<PaintBucket size={18} color="$colorInverse"/>}
            title="Tema do App"
            valueText={getModeDisplayName()}
            onPress={() => changeTheme()}
          />
          <ListItem
            icon={<Info size={18} color="$colorInverse"/>}
            title="Sobre o App"
            onPress={() => console.log('Privacy & Security')}
            showChevron={false}
          />
          <ListItem
            icon={<LogOut size={18} color="$colorInverse"/>}
            title="Sair do App"
            onPress={() => logoutApp()}
            showChevron={false}
          />
        </ListSection>


      </ScreenWithBlurHeader>

    </>
  );
}
