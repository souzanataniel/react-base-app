// ===== STRING FORMATTERS =====
export const stringFormatters = {
  // Capitalizar primeira letra
  capitalize: (str: string): string => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  // Title Case (cada palavra com primeira letra maiúscula)
  titleCase: (str: string): string => {
    if (!str) return '';
    return str
      .split(' ')
      .map(word => stringFormatters.capitalize(word))
      .join(' ');
  },

  // Limpar espaços extras
  cleanSpaces: (str: string): string => {
    return str.trim().replace(/\s+/g, ' ');
  },

  // Remover acentos
  removeAccents: (str: string): string => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  },

  // Gerar slug (URL-friendly)
  slugify: (str: string): string => {
    return stringFormatters.removeAccents(str)
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  },

  // Truncar string com ellipsis
  truncate: (str: string, length: number, suffix: string = '...'): string => {
    if (str.length <= length) return str;
    return str.slice(0, length - suffix.length) + suffix;
  },

  // Mascarar string (para logs)
  mask: (str: string, visibleChars: number = 4, maskChar: string = '*'): string => {
    if (str.length <= visibleChars * 2) {
      return maskChar.repeat(str.length);
    }

    const start = str.slice(0, visibleChars);
    const end = str.slice(-visibleChars);
    const masked = maskChar.repeat(str.length - (visibleChars * 2));

    return start + masked + end;
  }
};

// ===== EMAIL FORMATTERS =====
export const emailFormatters = {
  // Normalizar email
  normalize: (email: string): string => {
    return email.toLowerCase().trim();
  },

  // Mascarar email para exibição
  mask: (email: string): string => {
    const [username, domain] = email.split('@');
    if (!username || !domain) return email;

    const maskedUsername = username.length > 3
      ? username.slice(0, 2) + '*'.repeat(username.length - 2)
      : '*'.repeat(username.length);

    return `${maskedUsername}@${domain}`;
  },

  // Extrair domínio
  getDomain: (email: string): string => {
    return email.split('@')[1] || '';
  },

  // Extrair username
  getUsername: (email: string): string => {
    return email.split('@')[0] || '';
  },

  // Gerar avatar placeholder baseado no email
  getAvatarPlaceholder: (email: string): string => {
    const username = emailFormatters.getUsername(email);
    return username.slice(0, 2).toUpperCase();
  }
};

// ===== PHONE FORMATTERS =====
export const phoneFormatters = {
  // Limpar telefone (apenas números)
  clean: (phone: string): string => {
    return phone.replace(/\D/g, '');
  },

  // Formatar telefone brasileiro
  formatBrazilian: (phone: string): string => {
    const cleaned = phoneFormatters.clean(phone);

    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    } else if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    }

    return phone;
  },

  // Formatar telefone internacional
  formatInternational: (phone: string, countryCode: string = '+55'): string => {
    const cleaned = phoneFormatters.clean(phone);
    return `${countryCode} ${cleaned}`;
  },

  // Mascarar telefone
  mask: (phone: string): string => {
    const cleaned = phoneFormatters.clean(phone);
    if (cleaned.length < 4) return phone;

    const lastFour = cleaned.slice(-4);
    const masked = '*'.repeat(cleaned.length - 4);

    return phoneFormatters.formatBrazilian(masked + lastFour);
  }
};

// ===== NAME FORMATTERS =====
export const nameFormatters = {
  // Formatar nome completo
  formatFullName: (name: string): string => {
    return stringFormatters.cleanSpaces(name)
      .split(' ')
      .map(word => {
        // Preposições e artigos em minúsculo
        const lowercase = ['de', 'da', 'do', 'das', 'dos', 'e', 'del', 'von', 'van'];
        return lowercase.includes(word.toLowerCase())
          ? word.toLowerCase()
          : stringFormatters.capitalize(word);
      })
      .join(' ');
  },

  // Extrair primeiro nome
  getFirstName: (fullName: string): string => {
    return fullName.split(' ')[0] || '';
  },

  // Extrair último nome
  getLastName: (fullName: string): string => {
    const parts = fullName.split(' ');
    return parts[parts.length - 1] || '';
  },

  // Gerar iniciais
  getInitials: (fullName: string, maxInitials: number = 2): string => {
    return fullName
      .split(' ')
      .filter(word => word.length > 0)
      .slice(0, maxInitials)
      .map(word => word.charAt(0).toUpperCase())
      .join('');
  },

  // Gerar nome de exibição (primeiro + último)
  getDisplayName: (fullName: string): string => {
    const parts = fullName.split(' ').filter(word => word.length > 0);
    if (parts.length === 1) return parts[0];
    if (parts.length === 2) return fullName;

    return `${parts[0]} ${parts[parts.length - 1]}`;
  },

  // Gerar nome formal (Sr./Sra. + nome)
  getFormalName: (fullName: string, gender?: 'male' | 'female'): string => {
    const prefix = gender === 'female' ? 'Sra.' : 'Sr.';
    return `${prefix} ${nameFormatters.getLastName(fullName)}`;
  }
};

// ===== DATE FORMATTERS =====
export const dateFormatters = {
  // Formatar data para exibição
  formatDate: (date: string | Date, format: 'short' | 'long' | 'relative' = 'short'): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (format === 'relative') {
      return dateFormatters.getRelativeTime(dateObj);
    }

    const options: Intl.DateTimeFormatOptions = format === 'long'
      ? {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      }
      : {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit'
      };

    return dateObj.toLocaleDateString('pt-BR', options);
  },

  // Tempo relativo (há 2 horas, ontem, etc.)
  getRelativeTime: (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return 'agora';
    if (diffMins < 60) return `há ${diffMins}m`;
    if (diffHours < 24) return `há ${diffHours}h`;
    if (diffDays === 1) return 'ontem';
    if (diffDays < 7) return `há ${diffDays} dias`;
    if (diffDays < 30) return `há ${Math.floor(diffDays / 7)} semanas`;
    if (diffDays < 365) return `há ${Math.floor(diffDays / 30)} meses`;

    return `há ${Math.floor(diffDays / 365)} anos`;
  },

  // Formatar timestamp
  formatTimestamp: (timestamp: number): string => {
    return dateFormatters.formatDate(new Date(timestamp), 'short');
  },

  // Calcular idade
  calculateAge: (birthDate: string | Date): number => {
    const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  }
};

// ===== ERROR FORMATTERS =====
export const errorFormatters = {
  // Formatar mensagem de erro para usuário
  formatUserError: (error: any): string => {
    if (typeof error === 'string') return error;

    const errorMessages: Record<string, string> = {
      'NETWORK_ERROR': 'Problema de conexão. Verifique sua internet.',
      'VALIDATION_ERROR': 'Dados inválidos. Verifique os campos.',
      'UNAUTHORIZED': 'Acesso não autorizado. Faça login novamente.',
      'FORBIDDEN': 'Você não tem permissão para esta ação.',
      'NOT_FOUND': 'Recurso não encontrado.',
      'SERVER_ERROR': 'Erro interno. Tente novamente em alguns minutos.',
      'TIMEOUT': 'Operação demorou muito. Tente novamente.'
    };

    const code = error.code || error.name;
    return errorMessages[code] || error.message || 'Erro inesperado';
  },

  // Formatar erro para logs
  formatLogError: (error: any, context?: string): string => {
    const timestamp = new Date().toISOString();
    const contextStr = context ? `[${context}] ` : '';

    if (error instanceof Error) {
      return `${timestamp} ${contextStr}${error.name}: ${error.message}\n${error.stack}`;
    }

    return `${timestamp} ${contextStr}${JSON.stringify(error)}`;
  },

  // Extrair código de erro
  getErrorCode: (error: any): string => {
    return error?.code || error?.name || 'UNKNOWN_ERROR';
  }
};

// ===== PRIVACY FORMATTERS =====
export const privacyFormatters = {
  // Mascarar dados sensíveis para logs
  maskSensitiveData: (data: any): any => {
    if (typeof data !== 'object' || data === null) return data;

    const sensitiveFields = [
      'password', 'token', 'secret', 'key', 'auth',
      'ssn', 'cpf', 'credit', 'card', 'bank'
    ];

    const masked = {...data};

    Object.keys(masked).forEach(key => {
      const lowerKey = key.toLowerCase();
      const isSensitive = sensitiveFields.some(field => lowerKey.includes(field));

      if (isSensitive && typeof masked[key] === 'string') {
        masked[key] = stringFormatters.mask(masked[key]);
      }
    });

    return masked;
  },

  // Remover dados sensíveis completamente
  removeSensitiveData: (data: any): any => {
    if (typeof data !== 'object' || data === null) return data;

    const sensitiveFields = [
      'password', 'token', 'refreshToken', 'accessToken',
      'secret', 'key', 'auth', 'credential'
    ];

    const cleaned = {...data};

    Object.keys(cleaned).forEach(key => {
      const lowerKey = key.toLowerCase();
      const isSensitive = sensitiveFields.some(field => lowerKey.includes(field));

      if (isSensitive) {
        delete cleaned[key];
      }
    });

    return cleaned;
  }
};
