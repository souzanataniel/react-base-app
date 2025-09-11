import {useState} from 'react';
import {forgotPasswordSchema} from '@/features/auth/schemas/forgotPasswordSchema';
import {forgotPassword} from '@/features/auth/services/authService';

type SubmitResult = {
  success: true;
  message: string;
} | {
  success: false;
  message: string;
};

export const useForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const updateEmail = (value: string) => {
    setEmail(value);
    clearError();
  };

  const validateEmail = (emailToValidate: string): string | null => {
    try {
      forgotPasswordSchema.parse({email: emailToValidate});
      return null;
    } catch (err: any) {
      return err.issues?.[0]?.message || 'Email inválido';
    }
  };

  const submit = async (): Promise<SubmitResult> => {
    try {
      // Validar email
      const validationError = validateEmail(email);
      if (validationError) {
        return {
          success: false,
          message: validationError
        };
      }

      setIsLoading(true);
      setError(null);

      const result = await forgotPassword({
        email: email.trim().toLowerCase(),
      });

      if (result.success) {
        setEmail('');
        return {
          success: true,
          message: result.message || 'Email de recuperação enviado com sucesso!'
        };
      }

      return {
        success: false,
        message: result.message || result.error || 'Erro ao enviar email de recuperação'
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

  const canSubmit = email.trim().length > 0 && email.includes('@') && !isLoading;

  return {
    email,
    updateEmail,
    submit,
    isLoading,
    canSubmit,
    error,
    clearError,
  };
};
