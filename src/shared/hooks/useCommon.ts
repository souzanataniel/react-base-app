import {useAuth} from '@/features/auth/hooks/useAuth';
import {useBaseAlert} from '@/shared/components/feedback/Alert/BaseAlertProvider';

export const useCommon = () => {
  const {signOut} = useAuth();
  const {showConfirm} = useBaseAlert();

  const logoutApp = async () => {
    showConfirm(
      'Sair do App',
      'Você tem certeza que deseja sair do app?',
      () => signOut(),
      () => {});
  };

  return {
    logoutApp
  }
}
