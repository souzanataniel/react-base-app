import {useEffect, useState} from 'react';
import {debounce, FormValidationError, SignInCredentials, validateSignInForm} from '@/features/auth';
import {useAuth} from './useAuth';

/**
 * Hook para gerenciar formulário de login
 */
export const useSignIn = () => {
  const {signIn, isLoading, error, clearError} = useAuth();

  const [credentials, setCredentials] = useState<SignInCredentials>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<FormValidationError>({});
  const [touched, setTouched] = useState<Record<keyof SignInCredentials, boolean>>({
    email: false,
    password: false,
  });

  /**
   * Valida formulário com debounce
   */
  const debouncedValidate = debounce((creds: SignInCredentials) => {
    const validationErrors = validateSignInForm(creds);
    setErrors(validationErrors);
  }, 300);

  /**
   * Atualiza campo específico
   */
  const updateField = (field: keyof SignInCredentials, value: string) => {
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
  const markFieldAsTouched = (field: keyof SignInCredentials) => {
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
    const validationErrors = validateSignInForm(credentials);
    return Object.keys(validationErrors).length === 0;
  };

  /**
   * Verifica se pode submeter (válido + não está carregando)
   */
  const canSubmit = isValid() && !isLoading;

  /**
   * Submete formulário
   */
  const handleSubmit = async () => {
    // Marca todos os campos como tocados
    setTouched({email: true, password: true});

    // Valida formulário
    const validationErrors = validateSignInForm(credentials);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return {success: false};
    }

    // Faz login
    const result = await signIn(credentials);

    if (result.success) {
      // Reset form em caso de sucesso
      setCredentials({email: '', password: ''});
      setErrors({});
      setTouched({email: false, password: false});
    }

    return result;
  };

  /**
   * Reset do formulário
   */
  const reset = () => {
    setCredentials({email: '', password: ''});
    setErrors({});
    setTouched({email: false, password: false});
    clearError();
  };

  /**
   * Obtém erro de campo específico
   */
  const getFieldError = (field: keyof SignInCredentials): string | undefined => {
    return touched[field] ? errors[field] : undefined;
  };

  // Valida quando credentials mudam e todos os campos foram tocados
  useEffect(() => {
    if (touched.email && touched.password) {
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
    isFieldTouched: (field: keyof SignInCredentials) => touched[field],
    hasFieldError: (field: keyof SignInCredentials) => !!getFieldError(field),
  };
};
