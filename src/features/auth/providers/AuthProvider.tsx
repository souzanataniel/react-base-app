import React, {useEffect} from 'react';
import * as authService from '../services/authService';
import {useAuth} from '@/features/auth/hooks/useAuth';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const {initialize, setUser, user} = useAuth();

  useEffect(() => {
    initialize();

    const {data: {subscription}} = authService.onAuthStateChange((newUser) => {
      if (user?.id !== newUser?.id) {
        setUser(newUser);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  return <>{children}</>;
};
