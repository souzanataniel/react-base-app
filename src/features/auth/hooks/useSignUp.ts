import {useEffect, useState} from 'react';
import {debounce, FormValidationError, SignUpCredentials, validateSignUpForm} from '@/features/auth';
import {useAuth} from './useAuth';

/**
 * Hook para gerenciar formulário de cadastro
 */
export const useSignUp = () => {
  const {signUp, isLoading, error, clearError} = useAuth();

  const [credentials, setCredentials] = useState<SignUpCredentials>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });

  const [errors, setErrors] = useState<FormValidationError>({});
  const [touched, setTouched] = useState<Record<keyof SignUpCredentials, boolean>>({
    email: false,
    password: false,
    confirmPassword: false,
    firstName: false,
    lastName: false,
  });

  /**
   * Valida formulário com debounce
   */
  const debouncedValidate = debounce((creds: SignUpCredentials) => {
    const validationErrors = validateSignUpForm(creds);
    setErrors(validationErrors);
  }, 300);

  /**
   * Atualiza campo específico
   */
  const updateField = (field: keyof SignUpCredentials, value: string) => {
    const newCredentials = {...credentials, [field]: value};
    setCredentials(newCredentials);

    // Limpa erro geral quando usuário começa a digitar
    if (error) {
      clearError();
    }

    // Valida apenas se campo foi tocado
    if (touched[field]) {
      debouncedValidate(newCredentials);
    }
  };

  /**
   * Marca campo como tocado
   */
  const markFieldAsTouched = (field: keyof SignUpCredentials) => {
    if (!touched[field]) {
      setTouched(prev => ({...prev, [field]: true}));
      // Valida imediatamente quando campo é tocado
      debouncedValidate(credentials);
    }
  };

  /**
   * Verifica se formulário é válido
   */
  const isValid = () => {
    const validationErrors = validateSignUpForm(credentials);
    return Object.keys(validationErrors).length === 0;
  };

  /**
   * Verifica se pode submeter (válido + não está carregando)
   */
  const canSubmit = isValid() && !isLoading;

  /**
   * Calcula força da senha
   */
  const getPasswordStrength = (): 'weak' | 'medium' | 'strong' => {
    const {password} = credentials;

    if (password.length < 6) return 'weak';

    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score >= 3) return 'strong';
    if (score >= 1) return 'medium';
    return 'weak';
  };

  /**
   * Submete formulário
   */
  const handleSubmit = async () => {
    // Marca todos os campos obrigatórios como tocados
    const requiredFields: (keyof SignUpCredentials)[] = ['email', 'password', 'confirmPassword'];
    const newTouched = {...touched};
    requiredFields.forEach(field => {
      newTouched[field] = true;
    });
    // Marca campos opcionais como tocados se preenchidos
    if (credentials.firstName) newTouched.firstName = true;
    if (credentials.lastName) newTouched.lastName = true;

    setTouched(newTouched);

    // Valida formulário
    const validationErrors = validateSignUpForm(credentials);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return {success: false};
    }

    // Faz cadastro
    const result = await signUp(credentials);

    if (result.success) {
      // Reset form em caso de sucesso
      setCredentials({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
      });
      setErrors({});
      setTouched({
        email: false,
        password: false,
        confirmPassword: false,
        firstName: false,
        lastName: false,
      });
    }

    return result;
  };

  /**
   * Reset do formulário
   */
  const reset = () => {
    setCredentials({
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
    });
    setErrors({});
    setTouched({
      email: false,
      password: false,
      confirmPassword: false,
      firstName: false,
      lastName: false,
    });
    clearError();
  };

  /**
   * Obtém erro de campo específico
   */
  const getFieldError = (field: keyof SignUpCredentials): string | undefined => {
    return touched[field] ? errors[field] : undefined;
  };

  // Valida quando credentials mudam e campos obrigatórios foram tocados
  useEffect(() => {
    const hasRequiredTouched = touched.email || touched.password || touched.confirmPassword;
    if (hasRequiredTouched) {
      debouncedValidate(credentials);
    }
  }, [credentials, touched]);

  return {
    // Estado
    credentials,
    errors,
    touched,
    isValid: isValid(),
    canSubmit,
    isLoading,
    error,

    // Actions
    updateField,
    markFieldAsTouched,
    handleSubmit,
    reset,
    getFieldError,
    clearError,

    // Helpers
    isFieldTouched: (field: keyof SignUpCredentials) => touched[field],
    hasFieldError: (field: keyof SignUpCredentials) => !!getFieldError(field),
    getPasswordStrength,
  };
};
