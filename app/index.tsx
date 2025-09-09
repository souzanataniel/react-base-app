import {Redirect} from 'expo-router';
import {useAuth} from '@/features/auth';

export default function Index() {
  const {isAuthenticated, isInitialized} = useAuth();

  if (!isInitialized) {
    return null;
  }

  if (isAuthenticated) {
    return <Redirect href="/(app)/home"/>;
  }

  return <Redirect href="/(auth)/home"/>;
}
