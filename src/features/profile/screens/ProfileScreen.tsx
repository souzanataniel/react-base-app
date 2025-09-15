import {ProfileComponent} from '@/features/profile/components/ProfileComponent';
import {useAuth} from '@/features/auth/hooks/useAuth';

export default function ProfileScreen() {
  const {user} = useAuth();

  return <ProfileComponent
    userName={user?.firstName + ' ' + user?.lastName}
    userImage="https://exemplo.com/foto.jpg"
    onEditProfile={() => {/* navegar para edição */}}
    onChangePassword={() => {/* alterar senha */}}
    onChangeEmail={() => {/* alterar email */}}
    onSettings={() => {/* abrir configurações */}}
    onLogout={() => {/* fazer logout */}}
  />;
}
