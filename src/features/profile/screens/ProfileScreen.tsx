import React, {useState} from 'react';
import {BellRing, Info, Lock, LogOut, MapPin, PaintBucket, Phone, User, Vibrate} from '@tamagui/lucide-icons';
import {ListItem, ListSection} from '@/shared/components/lists';
import {useAuth} from '@/features/auth/hooks/useAuth';
import {router} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import {useThemeManager} from '@/shared/hooks/useTheme';
import {useCommon} from '@/shared/hooks/useCommon';
import {ScreenWithBlurHeader} from '@/shared/components/layout/ScreenWithBlurHeader';
import {ProfileHeader} from '@/features/profile/components/ProfileHeader';
import {useHaptic, useHapticFeedback} from '@/shared/components/feedback/Haptic/HapticContext';
import {updateProfileSingleField} from '@/features/profile/services/updateProfileService';

export function ProfileScreen() {
  const {user} = useAuth();

  const [enableLocation, setEnableLocation] = useState(user?.location);
  const [enableNotifications, setEnableNotifications] = useState(user?.pushNotifications);

  const {nextTheme, getModeDisplayName} = useThemeManager();

  const {logoutApp} = useCommon();
  const {isHapticEnabled, setHapticEnabled} = useHaptic();

  const haptic = useHapticFeedback();

  const changeTheme = async () => {
    await nextTheme();
  };

  const handleHapticToggle = (enabled: boolean) => {
    haptic.selection();
    setHapticEnabled(enabled);
  };

  const handleLocationToggle = (enabled: boolean) => {
    haptic.selection();
    setEnableLocation(enabled);
    void updateProfileSingleField(user!.id, 'location', enabled);
  };

  const handleNotificationsToggle = (enabled: boolean) => {
    haptic.selection();
    setEnableNotifications(enabled);
    void updateProfileSingleField(user!.id, 'push_notifications', enabled);
  };

  const handleAvatarUploadSuccess = (url: string) => {
    console.log('✅ Avatar uploaded successfully:', url);
    haptic.success(); // Simples e limpo
  };

  const handleAvatarUploadError = (error: Error) => {
    console.error('❌ Avatar upload error:', error);
    haptic.error(); // Simples e limpo
  };

  const handleEditProfile = () => {
    haptic.light();
    console.log('Edit profile pressed');
    router.push('/(app)/update-profile');
  };

  const handleNavigation = (route: string) => {
    haptic.light();
    router.push(route as any);
  };

  const handleLogout = () => {
    haptic.warning();
    logoutApp();
  };

  const handleThemeChange = async () => {
    haptic.selection();
    await changeTheme();
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
          name={user?.displayName ? user?.displayName : `${user?.firstName} ${user?.lastName}`}
          subtitle={user?.email}
          size="medium"
          showEditButton={true}
          enableAvatarUpload={true}
          onEditPress={handleEditProfile}
          onAvatarUploadSuccess={handleAvatarUploadSuccess}
          onAvatarUploadError={handleAvatarUploadError}
        />

        <ListSection title="Perfil">
          <ListItem
            icon={<User size={18} color="$colorInverse"/>}
            title="Informações Pessoais"
            onPress={() => handleNavigation('/(app)/update-profile')}
          />
          <ListItem
            icon={<Phone size={18} color="$colorInverse"/>}
            title="Informações de Contato"
            onPress={() => handleNavigation('/(app)/update-contacts')}
          />
          <ListItem
            icon={<Lock size={18} color="$colorInverse"/>}
            title="Alterar Senha"
            onPress={() => handleNavigation('/(app)/update-password')}
          />
        </ListSection>

        <ListSection title="Configurações">
          <ListItem
            icon={<MapPin size={18} color="$colorInverse"/>}
            title="Localização"
            showSwitch={true}
            switchValue={enableLocation}
            onSwitchChange={handleLocationToggle}
            showChevron={false}
          />

          <ListItem
            icon={<BellRing size={18} color="$colorInverse"/>}
            title="Notificações"
            showSwitch={true}
            switchValue={enableNotifications}
            onSwitchChange={handleNotificationsToggle}
            showChevron={false}
          />
        </ListSection>

        <ListSection title="Aplicação">
          <ListItem
            icon={<Vibrate size={18} color="$colorInverse"/>}
            title="Feedback Tátil"
            subtitle={isHapticEnabled ? 'Vibração ativada' : 'Vibração desativada'}
            showSwitch={true}
            switchValue={isHapticEnabled}
            onSwitchChange={handleHapticToggle}
            showChevron={false}
          />
          <ListItem
            icon={<PaintBucket size={18} color="$colorInverse"/>}
            title="Tema do App"
            valueText={getModeDisplayName()}
            onPress={handleThemeChange}
          />
        </ListSection>

        <ListSection title="Geral">
          <ListItem
            icon={<Info size={18} color="$colorInverse"/>}
            title="Sobre o App"
            onPress={() => {
              haptic.light();
              console.log('About app');
            }}
            showChevron={false}
          />
          <ListItem
            icon={<LogOut size={18} color="$colorInverse"/>}
            title="Sair do App"
            onPress={handleLogout}
            showChevron={false}
          />
        </ListSection>
      </ScreenWithBlurHeader>
    </>
  );
}
