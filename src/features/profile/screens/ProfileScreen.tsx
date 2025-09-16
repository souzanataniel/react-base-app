import {ProfileComponent} from '@/features/profile/components/ProfileComponent';
import {useAuth} from '@/features/auth/hooks/useAuth';
import {router} from 'expo-router';

export const ProfileScreen = () => {
  const {user, signOut} = useAuth();

  return <ProfileComponent
    userName={user?.firstName + ' ' + user?.lastName}
    userImage="https://exemplo.com/foto.jpg"
    onEditProfile={() => router.push('/(app)/update-profile')}
    onChangePassword={() => {}}
    onChangeEmail={() => {}}
    onSettings={() => {}}
    onLogout={() => signOut()}
  />;
}
