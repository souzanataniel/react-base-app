// src/features/auth/utils/validators.ts
import type { PasswordStrength, ValidationResult } from '../types';

// ===== EMAIL VALIDATORS =====
export const emailValidators = {
  // Validação básica de email
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validação robusta de email
  isValidEmailRobust: (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
  },

  // Verificar se é email corporativo
  isCorporateEmail: (email: string): boolean => {
    const personalDomains = [
      'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
      'icloud.com', 'live.com', 'msn.com', 'aol.com'
    ];
    const domain = email.split('@')[1]?.toLowerCase();
    return domain ? !personalDomains.includes(domain) : false;
  },

  // Verificar se é email descartável
  isDisposableEmail: (email: string): boolean => {
    const disposableDomains = [
      '10minutemail.com', 'tempmail.org', 'guerrillamail.com',
      'mailinator.com', 'yopmail.com', 'throwaway.email'
    ];
    const domain = email.split('@')[1]?.toLowerCase();
    return domain ? disposableDomains.includes(domain) : false;
  },

  // Sugerir correções de email
  suggestEmailCorrection: (email: string): string | null => {
    const commonDomains = {
      'gmial.com': 'gmail.com',
      'gmai.com': 'gmail.com',
      'yahooo.com': 'yahoo.com',
      'hotmial.com': 'hotmail.com',
      'outlok.com': 'outlook.com',
    };

    const domain = email.split('@')[1]?.toLowerCase();
    if (domain && commonDomains[domain]) {
      return email.replace(domain, commonDomains[domain]);
    }
    return null;
  }
};

// ===== PASSWORD VALIDATORS =====
export const passwordValidators = {
  // Validar força da senha
  getPasswordStrength: (password: string): PasswordStrength => {
    if (password.length < 6) return 'weak';

    let score = 0;

    // Critérios de força
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z\d]/.test(password)) score++;
    if (!/(.)\1{2,}/.test(password)) score++; // Sem repetições
    if (!/^(?:password|123456|qwerty)/i.test(password)) score++; // Não é senha comum

    if (score < 4) return 'weak';
    if (score < 6) return 'medium';
    return 'strong';
  },

  // Validar requisitos mínimos
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

  // Verificar senhas comuns
  isCommonPassword: (password: string): boolean => {
    const commonPasswords = [
      'password', '123456', '123456789', 'qwerty', 'abc123',
      'password123', 'admin', 'letmein', 'welcome', 'monkey',
      'dragon', 'master', 'shadow', 'superman', 'michael'
    ];

    return commonPasswords.includes(password.toLowerCase());
  },

  // Verificar se senha contém informações pessoais
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

  // Gerar sugestão de senha segura
  generateSecurePassword: (length: number = 12): string => {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    const allChars = lowercase + uppercase + numbers + symbols;
    let password = '';

    // Garantir pelo menos um de cada tipo
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];

    // Preencher o resto aleatoriamente
    for (let i = 4; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Embaralhar
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }
};

// ===== NAME VALIDATORS =====
export const nameValidators = {
  // Validar nome
  isValidName: (name: string): boolean => {
    // Aceita letras, espaços, acentos e hífens
    const nameRegex = /^[a-zA-ZÀ-ÿ\s\-']{2,50}$/;
    return nameRegex.test(name.trim());
  },

  // Limpar e formatar nome
  formatName: (name: string): string => {
    return name
      .trim()
      .replace(/\s+/g, ' ') // Remove espaços duplos
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  },

  // Validar se não é apenas números
  isNotOnlyNumbers: (name: string): boolean => {
    return !/^\d+$/.test(name.trim());
  },

  // Validar se não contém caracteres especiais inválidos
  hasValidCharacters: (name: string): boolean => {
    // Não permite números, símbolos (exceto hífen e apóstrofe)
    const invalidChars = /[0-9!@#$%^&*()_+=\[\]{}|\\:";.,<>?/`~]/;
    return !invalidChars.test(name);
  }
};

// ===== PHONE VALIDATORS =====
export const phoneValidators = {
  // Validar telefone brasileiro
  isValidBrazilianPhone: (phone: string): boolean => {
    // Remove caracteres não numéricos
    const cleanPhone = phone.replace(/\D/g, '');

    // Formatos válidos: (11) 99999-9999 ou (11) 9999-9999
    return /^(\+55)?(\d{2})(\d{4,5})(\d{4})$/.test(cleanPhone);
  },

  // Formatar telefone brasileiro
  formatBrazilianPhone: (phone: string): string => {
    const cleanPhone = phone.replace(/\D/g, '');

    if (cleanPhone.length === 11) {
      return `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2, 7)}-${cleanPhone.slice(7)}`;
    } else if (cleanPhone.length === 10) {
      return `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2, 6)}-${cleanPhone.slice(6)}`;
    }

    return phone;
  },

  // Validar telefone internacional
  isValidInternationalPhone: (phone: string): boolean => {
    const cleanPhone = phone.replace(/\D/g, '');
    return /^\+?[1-9]\d{6,14}$/.test(cleanPhone);
  }
};

// ===== FORM VALIDATORS =====
export const formValidators = {
  // Validar campo obrigatório
  required: (value: any): string | undefined => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return 'Campo obrigatório';
    }
    return undefined;
  },

  // Validar comprimento mínimo
  minLength: (min: number) => (value: string): string | undefined => {
    if (value && value.length < min) {
      return `Deve ter pelo menos ${min} caracteres`;
    }
    return undefined;
  },

  // Validar comprimento máximo
  maxLength: (max: number) => (value: string): string | undefined => {
    if (value && value.length > max) {
      return `Deve ter no máximo ${max} caracteres`;
    }
    return undefined;
  },

  // Validar padrão regex
  pattern: (regex: RegExp, message: string) => (value: string): string | undefined => {
    if (value && !regex.test(value)) {
      return message;
    }
    return undefined;
  },

  // Confirmar valor (para confirmação de senha)
  confirm: (originalValue: string, fieldName: string = 'campo') => (value: string): string | undefined => {
    if (value !== originalValue) {
      return `${fieldName} não confere`;
    }
    return undefined;
  },

  // Validar checkbox (termos de uso)
  mustBeTrue: (value: boolean): string | undefined => {
    if (!value) {
      return 'Você deve aceitar os termos';
    }
    return undefined;
  }
};

// ===== VALIDATION UTILITIES =====
export const validationUtils = {
  // Combinar múltiplos validadores
  combineValidators: (...validators: Array<(value: any) => string | undefined>) =>
    (value: any): string | undefined => {
      for (const validator of validators) {
        const error = validator(value);
        if (error) return error;
      }
      return undefined;
    },

  // Validação condicional
  when: (condition: () => boolean, validator: (value: any) => string | undefined) =>
    (value: any): string | undefined => {
      if (condition()) {
        return validator(value);
      }
      return undefined;
    },

  // Debounce para validação
  debounceValidation: <T>(
    validator: (value: T) => string | undefined,
    delay: number = 300
  ) => {
    let timeoutId: number;

    return (value: T): Promise<string | undefined> => {
      return new Promise((resolve) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          resolve(validator(value));
        }, delay);
      });
    };
  }
};
