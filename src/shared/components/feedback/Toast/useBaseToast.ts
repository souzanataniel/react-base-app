import {useToastController} from '@tamagui/toast';

export function useBaseToast() {
  const toast = useToastController();

  const showSuccess = (title: string, message?: string) => {
    toast.show(title, {
      message,
      duration: 2000,
    });
  };

  const showError = (title: string, message?: string) => {
    toast.show(title, {
      message,
      duration: 2000,
    });
  };

  const showInfo = (title: string, message?: string) => {
    toast.show(title, {
      duration: 2000,
      message,
    });
  };

  const hide = () => {
    toast.hide();
  };

  return {
    showSuccess,
    showError,
    showInfo,
    hide,
  };
}
