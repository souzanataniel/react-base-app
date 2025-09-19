import React, {useState} from 'react';
import {Alert, ScrollView} from 'react-native';
import {YStack} from 'tamagui';
import {BellRing, Info, Lock, LogOut, Mail, MapPin, Phone, User, Vibrate} from '@tamagui/lucide-icons';
import {CollapsibleScreen} from '@/shared/components/layout/CollapsibleScreen';
import {ListItem, ListSection, ProfileHeader} from '@/shared/components/lists';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAuth} from '@/features/auth/hooks/useAuth';
import {PaintBrushIcon} from 'react-native-heroicons/mini';
import {router} from 'expo-router';
import {StatusBar} from 'expo-status-bar';

export function ProfileScreen() {
  const [enableLocation, setEnableLocation] = useState(false);
  const [enableTactileFeedback, setEnableTactileFeedback] = useState(false);
  const [enableNotifications, setEnableNotifications] = useState(false);

  const insets = useSafeAreaInsets();
  const {user, signOut} = useAuth();

  const logoffAction = () => {
    Alert.alert(
      'Sair do App',
      'Você tem certeza que deseja sair do app?',
      [
        {
          text: 'Cancelar',
          onPress: () => console.log('Cancelado'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => signOut(),
        },
      ],
      {cancelable: true}
    );
  };

  return (
    <>
      <StatusBar style="auto"/>
      <YStack flex={1} backgroundColor="$background">
        <CollapsibleScreen title="Account" backgroundColor="$background">
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: insets.bottom + 80,
            }}>

            <ProfileHeader
              name={user?.displayName ? user?.displayName : user?.firstName + ' ' + user?.lastName}
              subtitle={user?.email}
              avatarUri="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face"
              size="medium"
              onEditPress={() => console.log('Edit profile')}
            />

            <ListSection title="Perfil">
              <ListItem
                icon={<User size={18} color="white"/>}
                iconBg="#2873FF"
                title="Informações Pessoais"
                onPress={() => router.push('/(app)/update-profile')}
              />
              <ListItem
                icon={<Phone size={18} color="white"/>}
                iconBg="#059669"
                title="Informações de Contato"
                onPress={() => console.log('Account Details')}
              />
              <ListItem
                icon={<Lock size={18} color="white"/>}
                iconBg="#D97706"
                title="Alterar Senha"
                onPress={() => console.log('Transaction History')}
              />
              <ListItem
                icon={<Mail size={18} color="white"/>}
                iconBg="#7C3AED"
                title="Alterar Email"
                onPress={() => console.log('Documents')}
              />
            </ListSection>

            {/* Seção Security */}
            <ListSection title="Segurança">
              <ListItem
                icon={<MapPin size={18} color="white"/>}
                iconBg="#DC2626"
                title="Localização"
                showSwitch={true}
                switchValue={enableLocation}
                onSwitchChange={setEnableLocation}
                showChevron={false}
              />

              <ListItem
                icon={<Vibrate size={18} color="white"/>}
                iconBg="#059669"
                title="Feedback Tátil"
                showSwitch={true}
                switchValue={enableTactileFeedback}
                onSwitchChange={setEnableTactileFeedback}
                showChevron={false}
              />
              <ListItem
                icon={<BellRing size={18} color="white"/>}
                iconBg="#6B7280"
                title="Notificações"
                showSwitch={true}
                switchValue={enableNotifications}
                onSwitchChange={setEnableNotifications}
                showChevron={false}
              />
            </ListSection>

            <ListSection title="Aplicação">
              <ListItem
                icon={<PaintBrushIcon size={18} color="white"/>}
                iconBg="#7C3AED"
                title="Tema do App"
                valueText="Automático"
                onPress={() => console.log('Documents')}
              />
              <ListItem
                icon={<Info size={18} color="white"/>}
                iconBg="#0891B2"
                title="Sobre o App"
                onPress={() => console.log('Privacy & Security')}
                showChevron={false}
              />
              <ListItem
                icon={<LogOut size={18} color="white"/>}
                iconBg="#DC2626"
                title="Sair do App"
                onPress={() => logoffAction()}
                showChevron={false}
              />
            </ListSection>
          </ScrollView>
        </CollapsibleScreen>
      </YStack>
    </>
  );
}
