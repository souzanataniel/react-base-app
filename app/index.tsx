import {Redirect} from 'expo-router';
import {useAuthStore} from '@/features/auth/stores/authStore';

export default function Index() {
  const {isAuthenticated} = useAuthStore();

  return <Redirect href={isAuthenticated ? '/(app)/home' : '/(auth)/home'}/>;
}
