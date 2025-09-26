import {useAuth} from '@/features/auth/hooks/useAuth';
import {useGlobalAlert} from '@/shared/components/feedback/BaseAlert/BaseAlert';

export const useCommon = () => {
  const {signOut} = useAuth();
  const {showConfirm} = useGlobalAlert();

  const logoutApp = async () => {
    showConfirm(
      'Sair do App ?',
      'Você tem certeza que deseja sair do app?',
      'Sair',
      'Cancelar',
      () => signOut(),
      () => {},
      'logout'
    )
  };

  return {
    logoutApp
  }
}
