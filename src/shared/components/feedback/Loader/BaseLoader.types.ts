import React from 'react';

export interface LoadingContextType {
  visible: boolean;
  message: string;
  show: (message?: string) => void;
  hide: () => void;
  isAnimating: boolean;
}

export interface LoadingProviderProps {
  children: React.ReactNode;
}
