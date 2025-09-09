import {FormValidationError, SignInCredentials, SignUpCredentials} from '@/features/auth';

/**
 * Valida formato de email
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida senha (mínimo 6 caracteres)
 */
export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

/**
 * Valida formulário de Sign In
 */
export const validateSignInForm = (credentials: SignInCredentials): FormValidationError => {
  const errors: FormValidationError = {};

  if (!credentials.email.trim()) {
    errors.email = 'Email é obrigatório';
  } else if (!validateEmail(credentials.email)) {
    errors.email = 'Email inválido';
  }

  if (!credentials.password) {
    errors.password = 'Senha é obrigatória';
  } else if (!validatePassword(credentials.password)) {
    errors.password = 'Senha deve ter pelo menos 6 caracteres';
  }

  return errors;
};

/**
 * Valida formulário de Sign Up
 */
export const validateSignUpForm = (credentials: SignUpCredentials): FormValidationError => {
  const errors: FormValidationError = {};

  if (!credentials.email.trim()) {
    errors.email = 'Email é obrigatório';
  } else if (!validateEmail(credentials.email)) {
    errors.email = 'Email inválido';
  }

  if (!credentials.password) {
    errors.password = 'Senha é obrigatória';
  } else if (!validatePassword(credentials.password)) {
    errors.password = 'Senha deve ter pelo menos 6 caracteres';
  }

  if (!credentials.confirmPassword) {
    errors.confirmPassword = 'Confirmação de senha é obrigatória';
  } else if (credentials.password !== credentials.confirmPassword) {
    errors.confirmPassword = 'Senhas não coincidem';
  }

  if (credentials.firstName && credentials.firstName.trim().length < 2) {
    errors.firstName = 'Nome deve ter pelo menos 2 caracteres';
  }

  if (credentials.lastName && credentials.lastName.trim().length < 2) {
    errors.lastName = 'Sobrenome deve ter pelo menos 2 caracteres';
  }

  return errors;
};

/**
 * Formata erros do Supabase para mensagens amigáveis
 */
export const formatErrors = (error: any): string => {
  if (error?.message) {
    // Mensagens comuns do Supabase
    if (error.message.includes('Invalid login credentials')) {
      return 'Email ou senha incorretos';
    }
    if (error.message.includes('User already registered')) {
      return 'Este email já está cadastrado';
    }
    if (error.message.includes('Password should be at least 6 characters')) {
      return 'Senha deve ter pelo menos 6 caracteres';
    }
    if (error.message.includes('Unable to validate email address')) {
      return 'Email inválido';
    }
    return error.message;
  }
  return 'Erro inesperado. Tente novamente.';
};

/**
 * Obtém erro específico de um campo
 */
export const getFieldError = (errors: FormValidationError, field: keyof FormValidationError): string | undefined => {
  return errors[field];
};

/**
 * Debounce para validação em tempo real
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: number;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
