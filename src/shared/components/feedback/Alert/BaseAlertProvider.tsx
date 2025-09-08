import React, {createContext, useContext} from 'react';
import {BaseAlert} from './BaseAlert';
import {useAlert} from './useBaseAlert';

const AlertContext = createContext<ReturnType<typeof useAlert> | null>(null);

export function BaseAlertProvider({children}: { children: React.ReactNode }) {
  const alert = useAlert();

  return (
    <AlertContext.Provider value={alert}>
      {children}
      <BaseAlert
        open={alert.isOpen}
        onOpenChange={alert.hide}
        {...alert.config}
      />
    </AlertContext.Provider>
  );
}

export const useBaseAlert = () => {
  const context = useContext(AlertContext);
  if (!context) throw new Error('useBaseAlert deve ser usado dentro de AlertProvider');
  return context;
};
