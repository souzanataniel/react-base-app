import React, {useEffect} from 'react';
import {useAuthStore} from '@/features/auth/stores/authStore';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const cleanup = useAuthStore(state => state.cleanup);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  return <>{children}</>;
};
