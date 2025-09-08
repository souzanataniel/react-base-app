import type {ValidationResult} from '@/shared/utils';

export type PasswordStrength = 'weak' | 'medium' | 'strong';

export const passwordValidators = {
  getPasswordStrength: (password: string): PasswordStrength => {
    if (password.length < 6) return 'weak';

    let score = 0;

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z\d]/.test(password)) score++;
    if (!/(.)\1{2,}/.test(password)) score++;
    if (!/^(?:password|123456|qwerty)/i.test(password)) score++;

    if (score < 4) return 'weak';
    if (score < 6) return 'medium';
    return 'strong';
  },

  validatePasswordRequirements: (password: string): ValidationResult => {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Senha deve ter pelo menos 8 caracteres');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Senha deve conter pelo menos uma letra minúscula');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Senha deve conter pelo menos uma letra maiúscula');
    }

    if (!/\d/.test(password)) {
      errors.push('Senha deve conter pelo menos um número');
    }

    if (password.length > 128) {
      errors.push('Senha muito longa (máximo 128 caracteres)');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  isCommonPassword: (password: string): boolean => {
    const commonPasswords = [
      'password', '123456', '123456789', 'qwerty', 'abc123',
      'password123', 'admin', 'letmein', 'welcome', 'monkey',
      'dragon', 'master', 'shadow', 'superman', 'michael'
    ];

    return commonPasswords.includes(password.toLowerCase());
  },

  containsPersonalInfo: (password: string, userInfo: { name?: string; email?: string }): boolean => {
    const lowerPassword = password.toLowerCase();

    if (userInfo.name) {
      const names = userInfo.name.toLowerCase().split(' ');
      if (names.some(name => name.length > 2 && lowerPassword.includes(name))) {
        return true;
      }
    }

    if (userInfo.email) {
      const emailPart = userInfo.email.split('@')[0].toLowerCase();
      if (emailPart.length > 2 && lowerPassword.includes(emailPart)) {
        return true;
      }
    }

    return false;
  },

  generateSecurePassword: (length: number = 12): string => {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    const allChars = lowercase + uppercase + numbers + symbols;
    let password = '';

    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];

    for (let i = 4; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    return password.split('').sort(() => Math.random() - 0.5).join('');
  }
};

export const passwordPolicy = {
  createPolicy: (config: {
    minLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumbers?: boolean;
    requireSymbols?: boolean;
    forbidPersonalInfo?: boolean;
    forbidCommonPasswords?: boolean;
    maxLength?: number;
  }) => ({
    validate: (password: string, userInfo?: { name?: string; email?: string }): ValidationResult => {
      const errors: string[] = [];

      if (config.minLength && password.length < config.minLength) {
        errors.push(`Senha deve ter pelo menos ${config.minLength} caracteres`);
      }

      if (config.maxLength && password.length > config.maxLength) {
        errors.push(`Senha deve ter no máximo ${config.maxLength} caracteres`);
      }

      if (config.requireUppercase && !/[A-Z]/.test(password)) {
        errors.push('Senha deve conter pelo menos uma letra maiúscula');
      }

      if (config.requireLowercase && !/[a-z]/.test(password)) {
        errors.push('Senha deve conter pelo menos uma letra minúscula');
      }

      if (config.requireNumbers && !/\d/.test(password)) {
        errors.push('Senha deve conter pelo menos um número');
      }

      if (config.requireSymbols && !/[^a-zA-Z\d]/.test(password)) {
        errors.push('Senha deve conter pelo menos um símbolo');
      }

      if (config.forbidCommonPasswords && passwordValidators.isCommonPassword(password)) {
        errors.push('Senha muito comum, escolha outra');
      }

      if (config.forbidPersonalInfo && userInfo && passwordValidators.containsPersonalInfo(password, userInfo)) {
        errors.push('Senha não deve conter informações pessoais');
      }

      return {
        isValid: errors.length === 0,
        errors
      };
    },

    getStrength: passwordValidators.getPasswordStrength,
    generateSuggestion: passwordValidators.generateSecurePassword
  }),

  basic: {
    minLength: 6,
    maxLength: 128,
    requireUppercase: false,
    requireLowercase: false,
    requireNumbers: false,
    requireSymbols: false,
    forbidPersonalInfo: false,
    forbidCommonPasswords: true
  },

  standard: {
    minLength: 8,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSymbols: false,
    forbidPersonalInfo: true,
    forbidCommonPasswords: true
  },

  strong: {
    minLength: 12,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSymbols: true,
    forbidPersonalInfo: true,
    forbidCommonPasswords: true
  }
};
