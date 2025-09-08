// src/features/auth/hooks/useResetPasswordForm.ts
import {useState} from 'react';
import {useRouter} from 'expo-router';
import {z} from 'zod';
import {authService} from '../services';
import {useBaseAlert} from '@/shared/components/feedback/Alert/BaseAlertProvider';

// Schema de validação para reset password
const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .max(100, 'Senha muito longa')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Senha deve ter ao menos: 1 minúscula, 1 maiúscula e 1 número'),

  confirmPassword: z
    .string()
    .min(1, 'Confirmação de senha é obrigatória'),
})
  .refine(data => data.password === data.confirmPassword, {
    message: 'Senhas não coincidem',
    path: ['confirmPassword'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
type ResetPasswordErrors = Partial<Record<keyof ResetPasswordFormData, string>>;

interface UseResetPasswordFormReturn {
  // Estados do formulário
  formData: ResetPasswordFormData;
  errors: ResetPasswordErrors;
  loading: boolean;
  success: boolean;

  // Funções de manipulação
  updateField: <K extends keyof ResetPasswordFormData>(
    field: K,
    value: ResetPasswordFormData[K]
  ) => void;

  validateField: (field: keyof ResetPasswordFormData) => boolean;
  validateForm: () => boolean;
  clearErrors: () => void;
  resetForm: () => void;

  // Ação principal
  handleResetPassword: (token: string) => Promise<boolean>;

  // Estados derivados
  isFormValid: boolean;
  canSubmit: boolean;
  passwordStrength: 'weak' | 'medium' | 'strong';
}

export const useResetPasswordForm = (): UseResetPasswordFormReturn => {
  const router = useRouter();
  const baseAlert = useBaseAlert();

  // Estados locais
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<ResetPasswordErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Função para atualizar campo específico
  const updateField = <K extends keyof ResetPasswordFormData>(
    field: K,
    value: ResetPasswordFormData[K]
  ) => {
    setFormData(prev => ({...prev, [field]: value}));

    // Limpa erro do campo quando usuário digita
    if (errors[field]) {
      setErrors(prev => ({...prev, [field]: undefined}));
    }

    // Revalida confirmPassword quando password muda
    if (field === 'password' && formData.confirmPassword) {
      validateField('confirmPassword');
    }
  };

  // Validação de campo específico
  const validateField = (field: keyof ResetPasswordFormData): boolean => {
    try {
      if (field === 'confirmPassword') {
        // Validação especial para confirmPassword
        resetPasswordSchema.parse(formData);
      } else {
        resetPasswordSchema.pick({[field]: true}).parse({[field]: formData[field]});
      }
      setErrors(prev => ({...prev, [field]: undefined}));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.issues.find(issue =>
          issue.path.includes(field)
        )?.message;
        setErrors(prev => ({...prev, [field]: fieldError}));
      }
      return false;
    }
  };

  // Validação completa do formulário
  const validateForm = (): boolean => {
    try {
      resetPasswordSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: ResetPasswordErrors = {};
        error.issues.forEach(err => {
          const field = err.path[0] as keyof ResetPasswordFormData;
          newErrors[field] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  // Limpar todos os erros
  const clearErrors = () => setErrors({});

  // Reset completo do formulário
  const resetForm = () => {
    setFormData({
      password: '',
      confirmPassword: '',
    });
    setErrors({});
    setLoading(false);
    setSuccess(false);
  };

  // Ação principal de reset password
  const handleResetPassword = async (token: string): Promise<boolean> => {
    try {
      setLoading(true);

      // Validação antes de enviar
      if (!validateForm()) {
        return false;
      }

      // Chamada para API
      const response = await authService.resetPassword({
        token,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      // Sucesso
      setSuccess(true);

      // Feedback positivo
      baseAlert.showSuccess('Senha redefinida!', 'Sua senha foi alterada com sucesso');

      // Navegação com delay para mostrar sucesso
      setTimeout(() => {
        router.dismissAll();
        router.replace('/(auth)/login');
      }, 2000);

      return true;

    } catch (error: any) {
      // Tratamento de erros específicos
      const errorMessage = getResetPasswordErrorMessage(error);

      // Erros de validação do servidor
      if (error.status === 422 && error.fieldErrors) {
        setErrors(error.fieldErrors);
      } else {
        // Erros gerais
        baseAlert.showError('Erro ao redefinir senha', errorMessage);

        // Se token inválido, volta para forgot password
        if (error.code === 'INVALID_TOKEN' || error.code === 'TOKEN_EXPIRED') {
          setTimeout(() => {
            router.replace('/(auth)/forgot-password');
          }, 3000);
        }
      }

      return false;

    } finally {
      setLoading(false);
    }
  };

  // Calcular força da senha
  const passwordStrength = (): 'weak' | 'medium' | 'strong' => {
    const password = formData.password;
    if (password.length < 6) return 'weak';

    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z\d]/.test(password)) score++;

    if (score < 3) return 'weak';
    if (score < 4) return 'medium';
    return 'strong';
  };

  // Estados derivados
  const isFormValid = Object.keys(errors).length === 0 &&
    formData.password.length > 0 &&
    formData.confirmPassword.length > 0;

  const canSubmit = isFormValid && !loading && !success;

  return {
    // Estados
    formData,
    errors,
    loading,
    success,

    // Funções
    updateField,
    validateField,
    validateForm,
    clearErrors,
    resetForm,
    handleResetPassword,

    // Estados derivados
    isFormValid,
    canSubmit,
    passwordStrength: passwordStrength(),
  };
};

// Utilitário para tratar mensagens de erro
const getResetPasswordErrorMessage = (error: any): string => {
  const errorMap: Record<string, string> = {
    'INVALID_TOKEN': 'Token inválido ou expirado. Solicite novamente',
    'TOKEN_EXPIRED': 'Token expirado. Solicite um novo link',
    'WEAK_PASSWORD': 'Senha muito fraca. Tente uma senha mais forte',
    'USER_NOT_FOUND': 'Usuário não encontrado',
    'NETWORK_ERROR': 'Erro de conexão. Verifique sua internet',
  };

  return errorMap[error.code] ||
    error.message ||
    'Erro inesperado. Tente novamente';
};
