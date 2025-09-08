import {useForgotPasswordForm} from './useForgotPasswordForm';
import {useLoginForm} from './useLoginForm';
import {useRegisterForm} from '@/features/auth';
import {useResetPasswordForm} from './useResetPasswordForm';

export {useLoginForm} from './useLoginForm';
export {useRegisterForm} from './useRegisterForm';
export {useForgotPasswordForm} from './useForgotPasswordForm';
export {useResetPasswordForm} from './useResetPasswordForm';


export const authHooks = {
  useLoginForm,
  useRegisterForm,
  useForgotPasswordForm,
  useResetPasswordForm,
};

