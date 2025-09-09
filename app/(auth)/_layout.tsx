import {Stack} from 'expo-router';
import {AuthGuard} from '@/features/auth';

export default function AuthLayout() {
  return (
    <AuthGuard requireAuth={false}>
      <Stack
        screenOptions={{
          animation: 'slide_from_right',
          gestureEnabled: false,
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="home"
          options={{title: 'HomeAuth',}}
        />
        <Stack.Screen
          name="sign-in"
          options={{title: 'Login'}}
        />
        <Stack.Screen
          name="sign-up"
          options={{title: 'Registrar'}}
        />
      </Stack>
    </AuthGuard>
  );
}
