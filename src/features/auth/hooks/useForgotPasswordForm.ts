import {useState} from 'react';
import {useRouter} from 'expo-router';
import {z} from 'zod';
import {authService} from '../services';
import {useBaseAlert} from '@/shared/components/feedback/Alert/BaseAlertProvider';

// Schema de validação para forgot password
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'E-mail é obrigatório')
    .email('E-mail inválido')
    .toLowerCase(),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
type ForgotPasswordErrors = Partial<Record<keyof ForgotPasswordFormData, string>>;

interface UseForgotPasswordFormReturn {
  // Estados do formulário
  formData: ForgotPasswordFormData;
  errors: ForgotPasswordErrors;
  loading: boolean;
  success: boolean;

  // Funções de manipulação
  updateField: <K extends keyof ForgotPasswordFormData>(
    field: K,
    value: ForgotPasswordFormData[K]
  ) => void;

  validateField: (field: keyof ForgotPasswordFormData) => boolean;
  validateForm: () => boolean;
  clearErrors: () => void;
  resetForm: () => void;

  // Ação principal
  handleForgotPassword: () => Promise<boolean>;
  handleResendEmail: () => Promise<boolean>;

  // Estados derivados
  isFormValid: boolean;
  canSubmit: boolean;
  canResend: boolean;
}

export const useForgotPasswordForm = (): UseForgotPasswordFormReturn => {
  const router = useRouter();
  const baseAlert = useBaseAlert();

  // Estados locais
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: '',
  });

  const [errors, setErrors] = useState<ForgotPasswordErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [lastSentTime, setLastSentTime] = useState<number | null>(null);

  // Função para atualizar campo específico
  const updateField = <K extends keyof ForgotPasswordFormData>(
    field: K,
    value: ForgotPasswordFormData[K]
  ) => {
    setFormData(prev => ({...prev, [field]: value}));

    // Limpa erro do campo quando usuário digita
    if (errors[field]) {
      setErrors(prev => ({...prev, [field]: undefined}));
    }

    // Reset success state quando usuário edita
    if (success) {
      setSuccess(false);
    }
  };

  // Validação de campo específico
  const validateField = (field: keyof ForgotPasswordFormData): boolean => {
    try {
      forgotPasswordSchema.pick({[field]: true}).parse({[field]: formData[field]});
      setErrors(prev => ({...prev, [field]: undefined}));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.issues[0]?.message;
        setErrors(prev => ({...prev, [field]: fieldError}));
      }
      return false;
    }
  };

  // Validação completa do formulário
  const validateForm = (): boolean => {
    try {
      forgotPasswordSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: ForgotPasswordErrors = {};
        error.issues.forEach(err => {
          const field = err.path[0] as keyof ForgotPasswordFormData;
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
    setFormData({email: ''});
    setErrors({});
    setLoading(false);
    setSuccess(false);
    setLastSentTime(null);
  };

  // Ação principal de forgot password
  const handleForgotPassword = async (): Promise<boolean> => {
    try {
      setLoading(true);

      // Validação antes de enviar
      if (!validateForm()) {
        return false;
      }

      // Chamada para API
      const response = await authService.forgotPassword({
        email: formData.email,
      });

      // Sucesso
      setSuccess(true);
      setLastSentTime(Date.now());

      // Feedback positivo
      baseAlert.showSuccess('E-mail enviado!', 'Verifique sua caixa de entrada para redefinir a senha',);
      return true;

    } catch (error: any) {
      // Tratamento de erros específicos
      const errorMessage = getForgotPasswordErrorMessage(error);

      // Erros de validação do servidor
      if (error.status === 422 && error.fieldErrors) {
        setErrors(error.fieldErrors);
      } else {
        // Erros gerais
        baseAlert.showError('Erro ao enviar e-mail', errorMessage,);
      }

      return false;

    } finally {
      setLoading(false);
    }
  };

  // Ação para reenviar e-mail
  const handleResendEmail = async (): Promise<boolean> => {
    // Verifica se pode reenviar (cooldown de 60 segundos)
    if (!canResend) {
      baseAlert.showInfo('Aguarde', 'Você deve aguardar 1 minuto antes de reenviar');
      return false;
    }

    return await handleForgotPassword();
  };

  // Estados derivados
  const isFormValid = Object.keys(errors).length === 0 && formData.email.length > 0;
  const canSubmit = isFormValid && !loading;

  // Verifica se pode reenviar (60 segundos de cooldown)
  const canResend = !lastSentTime || (Date.now() - lastSentTime) > 60000;

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
    handleForgotPassword,
    handleResendEmail,

    // Estados derivados
    isFormValid,
    canSubmit,
    canResend,
  };
};

// Utilitário para tratar mensagens de erro
const getForgotPasswordErrorMessage = (error: any): string => {
  const errorMap: Record<string, string> = {
    'USER_NOT_FOUND': 'E-mail não encontrado',
    'INVALID_EMAIL': 'E-mail inválido',
    'TOO_MANY_REQUESTS': 'Muitas tentativas. Tente novamente em alguns minutos',
    'EMAIL_NOT_VERIFIED': 'Confirme seu e-mail antes de redefinir a senha',
    'NETWORK_ERROR': 'Erro de conexão. Verifique sua internet',
  };

  return errorMap[error.code] ||
    error.message ||
    'Erro inesperado. Tente novamente';
};
