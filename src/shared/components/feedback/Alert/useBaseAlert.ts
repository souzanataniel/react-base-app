import {useState} from 'react';
import {BaseAlertConfig} from './BaseAlert.types';

export function useAlert() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<BaseAlertConfig>({
    title: '',
    description: '',
    type: 'info',
    confirmText: 'OK',
    cancelText: 'Cancelar',
    showCancel: false,
  });

  const show = (alertConfig: BaseAlertConfig) => {
    setConfig({...config, ...alertConfig});
    setIsOpen(true);
  };

  const hide = () => {
    setIsOpen(false);
  };

  const showSuccess = (title: string, description?: string, onConfirm?: () => void) => {
    show({
      title,
      description,
      type: 'success',
      confirmText: 'OK',
      showCancel: false,
      onConfirm,
    });
  };

  const showError = (title: string, description?: string, onConfirm?: () => void) => {
    show({
      title,
      description,
      type: 'error',
      confirmText: 'OK',
      showCancel: false,
      onConfirm,
    });
  };

  const showConfirm = (
    title: string,
    description?: string,
    onConfirm?: () => void,
    onCancel?: () => void
  ) => {
    show({
      title,
      description,
      type: 'warning',
      confirmText: 'Confirmar',
      cancelText: 'Cancelar',
      showCancel: true,
      onConfirm,
      onCancel,
    });
  };

  const showInfo = (title: string, description?: string, onConfirm?: () => void) => {
    show({
      title,
      description,
      type: 'info',
      confirmText: 'OK',
      showCancel: false,
      onConfirm,
    });
  };

  return {
    isOpen,
    config,
    show,
    hide,
    showSuccess,
    showError,
    showConfirm,
    showInfo,
  };
}
