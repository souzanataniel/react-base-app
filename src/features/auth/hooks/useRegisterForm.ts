import {useState} from 'react';
import {useRouter} from 'expo-router';
import {z} from 'zod';
import {useCombinedAuth} from '../stores';
import {authService} from '../services';
import {useBaseAlert} from '@/shared/components/feedback/Alert/BaseAlertProvider';
import {registerSchema} from '@/features/auth/schemas/registerSchema';

type RegisterFormData = z.infer<typeof registerSchema>;
type RegisterErrors = Partial<Record<keyof RegisterFormData, string>>;

interface UseRegisterFormReturn {
  formData: RegisterFormData;
  errors: RegisterErrors;
  loading: boolean;

  updateField: <K extends keyof RegisterFormData>(
    field: K,
    value: RegisterFormData[K]
  ) => void;

  validateField: (field: keyof RegisterFormData) => boolean;
  validateForm: () => boolean;
  clearErrors: () => void;
  resetForm: () => void;

  handleRegister: () => Promise<boolean>;

  isFormValid: boolean;
  canSubmit: boolean;
  passwordStrength: 'weak' | 'medium' | 'strong';
}

export const useRegisterForm = (): UseRegisterFormReturn => {
  const router = useRouter();
  const baseAlert = useBaseAlert();

  const {login} = useCombinedAuth();

  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });

  const [errors, setErrors] = useState<RegisterErrors>({});
  const [loading, setLoading] = useState(false);

  const updateField = <K extends keyof RegisterFormData>(
    field: K,
    value: RegisterFormData[K]
  ) => {
    setFormData(prev => ({...prev, [field]: value}));

    if (errors[field]) {
      setErrors(prev => ({...prev, [field]: undefined}));
    }

    if (field === 'password' && formData.confirmPassword) {
      validateField('confirmPassword');
    }
  };

  const validateField = (field: keyof RegisterFormData): boolean => {
    try {
      if (field === 'confirmPassword') {
        registerSchema.parse(formData);
      } else {
        registerSchema.pick({[field]: true}).parse({[field]: formData[field]});
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

  const validateForm = (): boolean => {
    try {
      registerSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: RegisterErrors = {};
        error.issues.forEach(err => {
          const field = err.path[0] as keyof RegisterFormData;
          newErrors[field] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const clearErrors = () => setErrors({});

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    });
    setErrors({});
    setLoading(false);
  };

  const handleRegister = async (): Promise<boolean> => {
    try {
      setLoading(true);

      if (!validateForm()) {
        return false;
      }

      const response = await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        acceptTerms: formData.acceptTerms,
      });

      await login(response.user, response.tokens);

      baseAlert.showSuccess('Conta criada!',
        response.user.emailVerified
          ? `Bem-vindo, ${response.user.name}!`
          : 'Verifique seu e-mail para ativar sua conta'
      );

      router.dismissAll();
      if (response.user.emailVerified) {
        router.replace('/home');
      } else {
        router.replace('/verify-email');
      }

      return true;

    } catch (error: any) {
      const errorMessage = getRegisterErrorMessage(error);

      if (error.status === 422 && error.fieldErrors) {
        setErrors(error.fieldErrors);
      } else {
        baseAlert.showError('Erro no cadastro', errorMessage);
      }

      return false;

    } finally {
      setLoading(false);
    }
  };

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

  const isFormValid = Object.keys(errors).length === 0 &&
    formData.name.length > 0 &&
    formData.email.length > 0 &&
    formData.password.length > 0 &&
    formData.confirmPassword.length > 0 &&
    formData.acceptTerms;

  const canSubmit = isFormValid && !loading;

  return {
    formData,
    errors,
    loading,

    updateField,
    validateField,
    validateForm,
    clearErrors,
    resetForm,
    handleRegister,

    isFormValid,
    canSubmit,
    passwordStrength: passwordStrength(),
  };
};

const getRegisterErrorMessage = (error: any): string => {
  const errorMap: Record<string, string> = {
    'EMAIL_ALREADY_EXISTS': 'Este e-mail já está cadastrado',
    'WEAK_PASSWORD': 'Senha muito fraca. Tente uma senha mais forte',
    'INVALID_EMAIL': 'E-mail inválido',
    'NAME_TOO_SHORT': 'Nome muito curto',
    'TERMS_NOT_ACCEPTED': 'Você deve aceitar os termos de uso',
    'NETWORK_ERROR': 'Erro de conexão. Verifique sua internet',
  };

  return errorMap[error.code] ||
    error.message ||
    'Erro inesperado. Tente novamente';
};
