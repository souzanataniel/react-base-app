import {useState} from 'react';
import {useRouter} from 'expo-router';
import {z} from 'zod';
import {useBaseAlert} from '@/shared/components/feedback/Alert/BaseAlertProvider';
import {authService, useAuthStore} from '@/features/auth';
import {loginSchema} from '@/features/auth/schemas/loginSchema';

type LoginFormData = z.infer<typeof loginSchema>;
type LoginErrors = Partial<Record<keyof LoginFormData, string>>;

interface UseLoginFormReturn {
  // Estados do formulário
  formData: LoginFormData;
  errors: LoginErrors;
  loading: boolean;

  // Funções de manipulação
  updateField: <K extends keyof LoginFormData>(
    field: K,
    value: LoginFormData[K]
  ) => void;

  validateField: (field: keyof LoginFormData) => boolean;
  validateForm: () => boolean;
  clearErrors: () => void;
  resetForm: () => void;

  // Ação principal
  handleLogin: () => Promise<boolean>;

  // Estados derivados
  isFormValid: boolean;
  canSubmit: boolean;
}

export const useLoginForm = (): UseLoginFormReturn => {
  const router = useRouter();
  const baseAlert = useBaseAlert();

  const {login: setAuthUser} = useAuthStore();

  // Estados locais
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState<LoginErrors>({});
  const [loading, setLoading] = useState(false);

  // Função para atualizar campo específico
  const updateField = <K extends keyof LoginFormData>(
    field: K,
    value: LoginFormData[K]
  ) => {
    setFormData(prev => ({...prev, [field]: value}));

    // Limpa erro do campo quando usuário digita
    if (errors[field]) {
      setErrors(prev => ({...prev, [field]: undefined}));
    }
  };

  // Validação de campo específico
  const validateField = (field: keyof LoginFormData): boolean => {
    try {
      loginSchema.pick({[field]: true}).parse({[field]: formData[field]});
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
      loginSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: LoginErrors = {};
        error.issues.forEach(err => {
          const field = err.path[0] as keyof LoginFormData;
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
      email: '',
      password: '',
      rememberMe: false,
    });
    setErrors({});
    setLoading(false);
  };

  // Ação principal de login
  const handleLogin = async (): Promise<boolean> => {
    try {
      setLoading(true);

      // Validação antes de enviar
      if (!validateForm()) {
        return false;
      }

      // Chamada para API
      const response = await authService.login({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      });

      // Sucesso - atualiza store global
      await setAuthUser(response.tokens);

      // Feedback positivo
      baseAlert.showSuccess('Login realizado!', `Bem-vindo, ${response.user.name}!`);

      // Navegação
      router.dismissAll(); // Limpa stack
      router.push('/(app)/home'); // Vai para home

      return true;

    } catch (error: any) {
      // Tratamento de erros específicos
      const errorMessage = getErrorMessage(error);

      // Erros de validação do servidor
      if (error.status === 422 && error.fieldErrors) {
        setErrors(error.fieldErrors);
      } else {
        // Erros gerais
        baseAlert.showError('Erro no login', errorMessage);
      }

      return false;

    } finally {
      setLoading(false);
    }
  };

  // Estados derivados
  const isFormValid = Object.keys(errors).length === 0 &&
    formData.email.length > 0 &&
    formData.password.length > 0;

  const canSubmit = isFormValid && !loading;

  return {
    // Estados
    formData,
    errors,
    loading,

    // Funções
    updateField,
    validateField,
    validateForm,
    clearErrors,
    resetForm,
    handleLogin,

    // Estados derivados
    isFormValid,
    canSubmit,
  };
};

// Utilitário para tratar mensagens de erro
const getErrorMessage = (error: any): string => {
  // Mapeamento de erros comuns
  const errorMap: Record<string, string> = {
    'INVALID_CREDENTIALS': 'E-mail ou senha incorretos',
    'USER_NOT_FOUND': 'Usuário não encontrado',
    'USER_BLOCKED': 'Conta bloqueada. Entre em contato com o suporte',
    'TOO_MANY_ATTEMPTS': 'Muitas tentativas. Tente novamente em alguns minutos',
    'NETWORK_ERROR': 'Erro de conexão. Verifique sua internet',
  };

  return errorMap[error.code] ||
    error.message ||
    'Erro inesperado. Tente novamente';
};
