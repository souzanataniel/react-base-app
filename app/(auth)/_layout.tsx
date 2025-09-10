import {Stack} from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        animation: 'slide_from_right',
        gestureEnabled: false,
        headerShown: false,
      }}
    >
      <Stack.Screen name="home" options={{title: 'HomeAuth'}} />
      <Stack.Screen name="sign-in" options={{title: 'Login'}} />
      <Stack.Screen name="sign-up" options={{title: 'Registrar'}} />
      <Stack.Screen name="forgot-password" options={{title: 'Recuperar Senha'}} />
      <Stack.Screen name="forgot-password-sent" options={{title: 'Recuperar Senha'}} />
    </Stack>
  );
}
