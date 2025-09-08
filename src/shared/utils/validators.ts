export type ValidationResult = {
  isValid: boolean;
  errors: string[];
};

export const emailValidators = {
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isValidEmailRobust: (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
  },

  isCorporateEmail: (email: string): boolean => {
    const personalDomains = [
      'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
      'icloud.com', 'live.com', 'msn.com', 'aol.com'
    ];
    const domain = email.split('@')[1]?.toLowerCase();
    return domain ? !personalDomains.includes(domain) : false;
  },

  isDisposableEmail: (email: string): boolean => {
    const disposableDomains = [
      '10minutemail.com', 'tempmail.org', 'guerrillamail.com',
      'mailinator.com', 'yopmail.com', 'throwaway.email'
    ];
    const domain = email.split('@')[1]?.toLowerCase();
    return domain ? disposableDomains.includes(domain) : false;
  },

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

export const phoneValidators = {
  isValidBrazilianPhone: (phone: string): boolean => {
    const cleanPhone = phone.replace(/\D/g, '');
    return /^(\+55)?(\d{2})(\d{4,5})(\d{4})$/.test(cleanPhone);
  },

  formatBrazilianPhone: (phone: string): string => {
    const cleanPhone = phone.replace(/\D/g, '');

    if (cleanPhone.length === 11) {
      return `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2, 7)}-${cleanPhone.slice(7)}`;
    } else if (cleanPhone.length === 10) {
      return `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2, 6)}-${cleanPhone.slice(6)}`;
    }

    return phone;
  },

  isValidInternationalPhone: (phone: string): boolean => {
    const cleanPhone = phone.replace(/\D/g, '');
    return /^\+?[1-9]\d{6,14}$/.test(cleanPhone);
  }
};

export const nameValidators = {
  isValidName: (name: string): boolean => {
    const nameRegex = /^[a-zA-ZÀ-ÿ\s\-']{2,50}$/;
    return nameRegex.test(name.trim());
  },

  formatName: (name: string): string => {
    return name
      .trim()
      .replace(/\s+/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  },

  // Validar se não é apenas números
  isNotOnlyNumbers: (name: string): boolean => {
    return !/^\d+$/.test(name.trim());
  },

  hasValidCharacters: (name: string): boolean => {
    const invalidChars = /[0-9!@#$%^&*()_+=\[\]{}|\\:";.,<>?/`~]/;
    return !invalidChars.test(name);
  }
};

export const formValidators = {
  required: (value: any): string | undefined => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return 'Campo obrigatório';
    }
    return undefined;
  },

  minLength: (min: number) => (value: string): string | undefined => {
    if (value && value.length < min) {
      return `Deve ter pelo menos ${min} caracteres`;
    }
    return undefined;
  },

  maxLength: (max: number) => (value: string): string | undefined => {
    if (value && value.length > max) {
      return `Deve ter no máximo ${max} caracteres`;
    }
    return undefined;
  },

  pattern: (regex: RegExp, message: string) => (value: string): string | undefined => {
    if (value && !regex.test(value)) {
      return message;
    }
    return undefined;
  },

  confirm: (originalValue: string, fieldName: string = 'campo') => (value: string): string | undefined => {
    if (value !== originalValue) {
      return `${fieldName} não confere`;
    }
    return undefined;
  },

  mustBeTrue: (value: boolean): string | undefined => {
    if (!value) {
      return 'Você deve aceitar os termos';
    }
    return undefined;
  }
};

export const validationUtils = {
  combineValidators: (...validators: Array<(value: any) => string | undefined>) =>
    (value: any): string | undefined => {
      for (const validator of validators) {
        const error = validator(value);
        if (error) return error;
      }
      return undefined;
    },

  when: (condition: () => boolean, validator: (value: any) => string | undefined) =>
    (value: any): string | undefined => {
      if (condition()) {
        return validator(value);
      }
      return undefined;
    },

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
