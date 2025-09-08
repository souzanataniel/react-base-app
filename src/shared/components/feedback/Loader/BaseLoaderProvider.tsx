import React, {createContext, useContext, useState} from 'react';
import {LoadingContextType, LoadingProviderProps} from './BaseLoader.types';
import {BaseLoader} from './BaseLoader';

const LoadingContext = createContext<LoadingContextType | null>(null);

export function BaseLoaderProvider({children}: LoadingProviderProps) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('Carregando...');
  const [isAnimating, setIsAnimating] = useState(false);

  const show = (newMessage = 'Carregando...') => {
    setMessage(newMessage);
    setVisible(true);
    setIsAnimating(true);
  };

  const hide = () => {
    setVisible(false);
    setTimeout(() => {
      setIsAnimating(false);
    }, 250);
  };

  const handleAnimationComplete = () => {
    if (visible) {
      setIsAnimating(false);
    }
  };

  const value = {
    visible,
    message,
    show,
    hide,
    isAnimating,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
      <BaseLoader
        visible={visible}
        message={message}
        onAnimationComplete={handleAnimationComplete}
      />
    </LoadingContext.Provider>
  );
}

export const useGlobalLoader = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useGlobalLoader deve ser usado dentro de LoadingProvider');
  }
  return context;
};
