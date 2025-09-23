import {useMemo, useState} from 'react';
import {updatePassword} from '@/features/auth/services/authService';
import {updatePasswordSchema} from '@/features/profile/schema/updatePasswordSchema';

type SubmitResult = {
  success: true;
  message: string;
} | {
  success: false;
  message: string;
};

export const useUpdatePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordValidation = useMemo(() => {
    const hasNewPassword = newPassword.length > 0;
    const hasConfirmPassword = confirmPassword.length > 0;
    const passwordsMatch = newPassword === confirmPassword;

    return {
      passwordsMatch: hasNewPassword && hasConfirmPassword ? passwordsMatch : null,
      showMatchError: hasNewPassword && hasConfirmPassword && !passwordsMatch,
      showMatchSuccess: hasNewPassword && hasConfirmPassword && passwordsMatch
    };
  }, [newPassword, confirmPassword]);

  const clearError = () => setError(null);

  const updateCurrentPassword = (value: string) => {
    setCurrentPassword(value);
    clearError();
  };

  const updateNewPassword = (value: string) => {
    setNewPassword(value);
    clearError();
  };

  const updateConfirmPassword = (value: string) => {
    setConfirmPassword(value);
    clearError();
  };

  const validatePasswords = (): string | null => {
    if (newPassword !== confirmPassword) {
      return 'As senhas não coincidem';
    }

    try {
      updatePasswordSchema.parse({
        currentPassword,
        newPassword,
        confirmPassword
      });
      return null;
    } catch (err: any) {
      return err.issues?.[0]?.message || 'Dados inválidos';
    }
  };

  const submit = async (): Promise<SubmitResult> => {
    try {
      // Validar senhas
      const validationError = validatePasswords();
      if (validationError) {
        return {
          success: false,
          message: validationError
        };
      }

      setIsLoading(true);
      setError(null);

      const result = await updatePassword({
        currentPassword: currentPassword.trim(),
        newPassword: newPassword.trim()
      });

      if (result.success) {
        // Limpar campos após sucesso
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');

        return {
          success: true,
          message: result.message || 'Senha atualizada com sucesso!'
        };
      }

      return {
        success: false,
        message: result.message || result.error || 'Erro ao atualizar senha'
      };
    } catch (err) {
      return {
        success: false,
        message: 'Erro inesperado. Tente novamente.'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const canSubmit =
    currentPassword.trim().length >= 6 &&
    newPassword.trim().length >= 6 &&
    confirmPassword.trim().length >= 6 &&
    passwordValidation.passwordsMatch === true &&
    !isLoading;

  const reset = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError(null);
  };

  return {
    // Estados
    currentPassword,
    newPassword,
    confirmPassword,
    isLoading,
    error,

    // Validações
    passwordValidation,

    // Ações
    updateCurrentPassword,
    updateNewPassword,
    updateConfirmPassword,
    submit,
    canSubmit,
    clearError,
    reset,
  };
};
