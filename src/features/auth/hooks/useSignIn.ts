import {useEffect, useState} from 'react';
import {useAuth} from './useAuth';
import {useBaseAlert} from '@/shared/components/feedback/Alert/BaseAlertProvider';
import {FormValidationError, SignInCredentials} from '@/features/auth/types/auth.types';
import {debounce, validateSignInForm} from '@/features/auth/utils/authUtils';
import {useRouter} from 'expo-router';

/**
 * Hook para gerenciar formulário de login
 */
export const useSignIn = () => {
  const {signIn, isLoading, error, clearError} = useAuth();
  const useAlert = useBaseAlert();
  const router = useRouter();

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
  const canSubmit = !isLoading;

  /**
   * Submete formulário
   */
  const handleSubmit = async () => {
    setTouched({email: true, password: true});

    const validationErrors = validateSignInForm(credentials);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      useAlert.showError('Login', 'Preencha corretamente os campos de Email e Senha.');
      return {success: false};
    }

    const result = await signIn(credentials);

    if (result.success) {
      // Limpa formulário
      setCredentials({email: '', password: ''});
      setErrors({});
      setTouched({email: false, password: false});

      // REDIRECIONAMENTO IMEDIATO
      try {
        router.replace('/(app)/home');
        console.log('✅ Redirecionamento executado');
      } catch (redirectError) {
        console.error('❌ Erro no redirecionamento:', redirectError);
        // Fallback
        router.push('/(app)/home');
      }
    } else {
      // Mostra erro e PERMANECE na tela
      useAlert.showError('Erro no Login', result.error || 'Credenciais inválidas');
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
