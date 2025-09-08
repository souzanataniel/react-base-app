import {tokenManager, tokenRefreshUtils, tokenSecurityUtils, tokenUtils} from './tokenUtils';
import {
  cacheUtils,
  dateFormatters,
  emailFormatters,
  emailValidators,
  errorFormatters,
  formValidators,
  nameFormatters,
  nameValidators,
  phoneFormatters,
  phoneValidators,
  privacyFormatters,
  storageManager,
  storageUtils,
  stringFormatters,
  validationUtils
} from '@/shared/utils';
import {passwordValidators} from '@/features/auth/utils/passwordUtils';
import {storageKeys, storageValidation} from '@/features/auth/utils/storageUtils';

// ===== TOKEN UTILITIES =====
export {
  tokenUtils,
  tokenStorageUtils,
  tokenRefreshUtils,
  tokenSecurityUtils,
  tokenDebugUtils,
  tokenManager
} from './tokenUtils';


// Validation helpers (mais usados)
export const validate = {
  email: emailValidators.isValidEmail,
  emailRobust: emailValidators.isValidEmailRobust,
  password: passwordValidators.validatePasswordRequirements,
  passwordStrength: passwordValidators.getPasswordStrength,
  name: nameValidators.isValidName,
  phone: phoneValidators.isValidBrazilianPhone,
  required: formValidators.required,
  minLength: formValidators.minLength,
  maxLength: formValidators.maxLength,
  combine: validationUtils.combineValidators
};

// Format helpers (mais usados)
export const format = {
  email: emailFormatters.normalize,
  emailMask: emailFormatters.mask,
  phone: phoneFormatters.formatBrazilian,
  phoneMask: phoneFormatters.mask,
  name: nameFormatters.formatFullName,
  initials: nameFormatters.getInitials,
  date: dateFormatters.formatDate,
  relativeTime: dateFormatters.getRelativeTime,
  error: errorFormatters.formatUserError,
  mask: stringFormatters.mask,
  capitalize: stringFormatters.capitalize,
  titleCase: stringFormatters.titleCase
};

// Token helpers (mais usados)
export const token = {
  parse: tokenUtils.parseJWT,
  isExpired: tokenUtils.isTokenExpired,
  timeRemaining: tokenUtils.getTokenTimeRemaining,
  shouldRefresh: tokenRefreshUtils.shouldRefreshToken,
  isValid: tokenSecurityUtils.validateTokenIntegrity,
  getUser: tokenUtils.getUserFromToken,
  status: tokenManager.getAuthStatus
};

// Storage helpers (mais usados)
export const storage = {
  keys: storageKeys,
  serialize: storageUtils.serialize,
  deserialize: storageUtils.deserialize,
  isValid: storageValidation.isValidForStorage,
  safeStore: storageManager.safeStore,
  safeRetrieve: storageManager.safeRetrieve,
  generateKey: cacheUtils.generateCacheKey,
  cleanCache: cacheUtils.cleanExpiredCache
};

// Criar validador de email personalizado
export const createEmailValidator = (options?: {
  allowPersonal?: boolean;
  allowDisposable?: boolean;
  requireCorporate?: boolean;
}) => (email: string): string | undefined => {
  if (!emailValidators.isValidEmail(email)) {
    return 'E-mail inválido';
  }

  if (options?.requireCorporate && !emailValidators.isCorporateEmail(email)) {
    return 'E-mail corporativo necessário';
  }

  if (options?.allowDisposable === false && emailValidators.isDisposableEmail(email)) {
    return 'E-mail temporário não permitido';
  }

  return undefined;
};

// Criar validador de senha personalizado
export const createPasswordValidator = (options?: {
  minLength?: number;
  requireSpecialChar?: boolean;
  allowPersonalInfo?: boolean;
  userInfo?: { name?: string; email?: string };
}) => (password: string): string | undefined => {
  const minLength = options?.minLength || 8;

  if (password.length < minLength) {
    return `Senha deve ter pelo menos ${minLength} caracteres`;
  }

  if (options?.requireSpecialChar && !/[^a-zA-Z\d]/.test(password)) {
    return 'Senha deve conter caractere especial';
  }

  if (options?.allowPersonalInfo === false && options?.userInfo) {
    if (passwordValidators.containsPersonalInfo(password, options.userInfo)) {
      return 'Senha não deve conter informações pessoais';
    }
  }

  if (passwordValidators.isCommonPassword(password)) {
    return 'Senha muito comum, escolha outra';
  }

  return undefined;
};

// Criar helpers de formulário específicos
export const createFormHelpers = <T extends Record<string, any>>(config: {
  initialValues: T;
  validators?: Record<keyof T, ((value: any) => string | undefined)[]>;
}) => ({
  validate: (field: keyof T, value: any): string | undefined => {
    const fieldValidators = config.validators?.[field];
    if (!fieldValidators) return undefined;

    for (const validator of fieldValidators) {
      const error = validator(value);
      if (error) return error;
    }

    return undefined;
  },

  validateAll: (values: T): Partial<Record<keyof T, string>> => {
    const errors = {} as Partial<Record<keyof T, string>>;

    Object.keys(config.validators || {}).forEach(field => {
      const fieldKey = field as keyof T;
      const fieldValidators = config.validators?.[fieldKey];

      if (fieldValidators) {
        const errorMessage = fieldValidators
          .map(validator => validator(values[fieldKey]))
          .find(error => error !== undefined);

        if (errorMessage) {
          errors[fieldKey] = errorMessage;
        }
      }
    });

    return errors;
  },

  format: (field: keyof T, value: any): any => {
    // Auto-format baseado no tipo de campo
    const fieldName = String(field).toLowerCase();

    if (fieldName.includes('email')) {
      return format.email(value);
    }

    if (fieldName.includes('phone')) {
      return format.phone(value);
    }

    if (fieldName.includes('name')) {
      return format.name(value);
    }

    return value;
  }
});

// ===== DEBUGGING HELPERS =====
export const debugUtils = {
  // Log formatado para desenvolvimento
  logAuthEvent: (event: string, data?: any) => {
    if (process.env.NODE_ENV !== 'development') return;

    console.group(`🔐 Auth: ${event}`);
    if (data) {
      console.log('Data:', privacyFormatters.maskSensitiveData(data));
    }
    console.log('Timestamp:', new Date().toISOString());
    console.groupEnd();
  },

  // Validar estado completo de auth
  validateAuthState: (state: any) => {
    const issues: string[] = [];

    if (!state) {
      issues.push('Auth state is null/undefined');
      return {isValid: false, issues};
    }

    if (state.tokens && !storageValidation.validateAuthTokens(state.tokens)) {
      issues.push('Invalid token structure');
    }

    if (state.user && !storageValidation.validateUserData(state.user)) {
      issues.push('Invalid user data structure');
    }

    return {
      isValid: issues.length === 0,
      issues,
      suggestions: issues.length > 0 ? [
        'Clear storage and re-authenticate',
        'Check network connection',
        'Update app version'
      ] : []
    };
  },

  // Performance timing
  createTimer: (label: string) => {
    const start = performance.now();

    return {
      end: () => {
        const duration = performance.now() - start;
        debugUtils.logAuthEvent(`Timer: ${label}`, {duration: `${duration.toFixed(2)}ms`});
        return duration;
      }
    };
  }
};

// Helper types para inferência automática
export type ExtractValidatorType<T> = T extends (value: infer U) => any ? U : never;
export type ExtractFormatterType<T> = T extends (value: infer U, ...args: any[]) => any ? U : never;

// Validation chain builder
export class ValidationChain<T = string> {
  private validators: Array<(value: T) => string | undefined> = [];

  required(message?: string) {
    this.validators.push((value: T) => {
      if (!value || (typeof value === 'string' && !value.trim())) {
        return message || 'Campo obrigatório';
      }
      return undefined;
    });
    return this;
  }

  email(message?: string) {
    this.validators.push((value: T) => {
      if (typeof value === 'string' && !emailValidators.isValidEmail(value)) {
        return message || 'E-mail inválido';
      }
      return undefined;
    });
    return this;
  }

  minLength(length: number, message?: string) {
    this.validators.push((value: T) => {
      if (typeof value === 'string' && value.length < length) {
        return message || `Deve ter pelo menos ${length} caracteres`;
      }
      return undefined;
    });
    return this;
  }

  maxLength(length: number, message?: string) {
    this.validators.push((value: T) => {
      if (typeof value === 'string' && value.length > length) {
        return message || `Deve ter no máximo ${length} caracteres`;
      }
      return undefined;
    });
    return this;
  }

  custom(validator: (value: T) => string | undefined) {
    this.validators.push(validator);
    return this;
  }

  build() {
    return validationUtils.combineValidators(...this.validators);
  }
}

// Factory para criar validation chain
export const createValidationChain = <T = any>() => new ValidationChain<T>();

// ===== QUICK ACCESS UTILITIES =====

// Validações mais comuns em uma função
export const quickValidate = {
  loginForm: (email: string, password: string) => ({
    email: validate.email(email) ? undefined : 'E-mail inválido',
    password: password.length < 6 ? 'Senha muito curta' : undefined
  }),

  registerForm: (name: string, email: string, password: string, confirmPassword: string) => ({
    name: validate.name(name) ? undefined : 'Nome inválido',
    email: validate.email(email) ? undefined : 'E-mail inválido',
    password: validate.passwordStrength(password) === 'weak' ? 'Senha muito fraca' : undefined,
    confirmPassword: password !== confirmPassword ? 'Senhas não coincidem' : undefined
  }),

  forgotPasswordForm: (email: string) => ({
    email: validate.email(email) ? undefined : 'E-mail inválido'
  })
};

// Formatações mais comuns em uma função
export const quickFormat = {
  userDisplayData: (user: any) => ({
    displayName: format.name(user.name),
    initials: format.initials(user.name),
    maskedEmail: format.emailMask(user.email),
    formattedPhone: user.phone ? format.phone(user.phone) : undefined,
    lastSeen: user.lastLoginAt ? format.relativeTime(new Date(user.lastLoginAt)) : 'Nunca'
  }),

  authSummary: (tokens: any) => ({
    isValid: token.isValid(tokens?.accessToken),
    expiresIn: tokens?.accessToken ? format.relativeTime(new Date(Date.now() + token.timeRemaining(tokens.accessToken) * 1000)) : 'N/A',
    user: tokens?.accessToken ? token.getUser(tokens.accessToken) : null
  })
};

// ===== EXPORT SUMMARY =====

// Constantes úteis
export const AUTH_CONSTANTS = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  TOKEN_REFRESH_BUFFER: 300, // 5 minutos
  MAX_LOGIN_ATTEMPTS: 5,
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 horas
} as const;

// Regex patterns úteis
export const AUTH_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  STRONG_PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/,
  PHONE_BR: /^(\+55)?(\d{2})(\d{4,5})(\d{4})$/,
  NAME: /^[a-zA-ZÀ-ÿ\s\-']{2,50}$/,
} as const;

// Messages templates
export const AUTH_MESSAGES = {
  VALIDATION: {
    REQUIRED: 'Campo obrigatório',
    INVALID_EMAIL: 'E-mail inválido',
    WEAK_PASSWORD: 'Senha muito fraca',
    PASSWORDS_DONT_MATCH: 'Senhas não coincidem',
    INVALID_NAME: 'Nome inválido',
    INVALID_PHONE: 'Telefone inválido'
  },
  SUCCESS: {
    LOGIN: 'Login realizado com sucesso',
    REGISTER: 'Conta criada com sucesso',
    PASSWORD_RESET: 'Senha alterada com sucesso',
    EMAIL_SENT: 'E-mail enviado com sucesso'
  },
  ERROR: {
    NETWORK: 'Erro de conexão',
    UNAUTHORIZED: 'Acesso não autorizado',
    INVALID_CREDENTIALS: 'E-mail ou senha incorretos',
    USER_NOT_FOUND: 'Usuário não encontrado',
    EMAIL_EXISTS: 'E-mail já cadastrado'
  }
} as const;
