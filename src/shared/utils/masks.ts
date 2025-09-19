/**
 * Utilitários de máscaras e formatação para dados brasileiros
 */

// ===== CORE MASK UTILITIES =====
export const maskUtils = {
  // Remove todos os caracteres não numéricos
  cleanNumbers: (value: string): string => {
    return value.replace(/\D/g, '');
  },

  // Remove todos os caracteres não alfanuméricos
  cleanAlphanumeric: (value: string): string => {
    return value.replace(/[^a-zA-Z0-9]/g, '');
  },

  // Aplica máscara genérica baseada em padrão
  applyPattern: (value: string, pattern: string, placeholder: string = '#'): string => {
    const cleaned = maskUtils.cleanNumbers(value);
    let result = '';
    let valueIndex = 0;

    for (let i = 0; i < pattern.length && valueIndex < cleaned.length; i++) {
      if (pattern[i] === placeholder) {
        result += cleaned[valueIndex];
        valueIndex++;
      } else {
        result += pattern[i];
      }
    }

    return result;
  }
};

// ===== DATE MASKS =====
export const dateMasks = {
  // Máscara DD/MM/AAAA
  date: (value: string): string => {
    let masked = maskUtils.cleanNumbers(value);

    if (masked.length >= 2) {
      masked = masked.slice(0, 2) + '/' + masked.slice(2);
    }
    if (masked.length >= 5) {
      masked = masked.slice(0, 5) + '/' + masked.slice(5, 9);
    }

    return masked.slice(0, 10);
  },

  // Máscara MM/AAAA
  monthYear: (value: string): string => {
    let masked = maskUtils.cleanNumbers(value);

    if (masked.length >= 2) {
      masked = masked.slice(0, 2) + '/' + masked.slice(2, 6);
    }

    return masked;
  },

  // Máscara DD/MM
  dayMonth: (value: string): string => {
    let masked = maskUtils.cleanNumbers(value);

    if (masked.length >= 2) {
      masked = masked.slice(0, 2) + '/' + masked.slice(2, 4);
    }

    return masked;
  },

  // Validar formato DD/MM/AAAA
  isValidDate: (value: string): boolean => {
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;

    if (!dateRegex.test(value)) return false;

    const [, day, month, year] = value.match(dateRegex) || [];
    const dayNum = parseInt(day, 10);
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);

    if (monthNum < 1 || monthNum > 12) return false;
    if (dayNum < 1 || dayNum > 31) return false;

    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // Ano bissexto
    if ((yearNum % 4 === 0 && yearNum % 100 !== 0) || yearNum % 400 === 0) {
      daysInMonth[1] = 29;
    }

    return dayNum <= daysInMonth[monthNum - 1];
  }
};

// ===== PHONE MASKS =====
export const phoneMasks = {
  // Máscara (XX) XXXXX-XXXX
  mobile: (value: string): string => {
    let masked = maskUtils.cleanNumbers(value);

    if (masked.length >= 2) {
      masked = '(' + masked.slice(0, 2) + ') ' + masked.slice(2);
    }
    if (masked.length >= 10) {
      masked = masked.slice(0, 10) + '-' + masked.slice(10, 14);
    }

    return masked.slice(0, 15);
  },

  // Máscara (XX) XXXX-XXXX (telefone fixo)
  landline: (value: string): string => {
    let masked = maskUtils.cleanNumbers(value);

    if (masked.length >= 2) {
      masked = '(' + masked.slice(0, 2) + ') ' + masked.slice(2);
    }
    if (masked.length >= 9) {
      masked = masked.slice(0, 9) + '-' + masked.slice(9, 13);
    }

    return masked.slice(0, 14);
  },

  // Detectar e aplicar máscara correta
  auto: (value: string): string => {
    const cleaned = maskUtils.cleanNumbers(value);

    // Se tem 11 dígitos ou começou com DDD + 9, é celular
    if (cleaned.length === 11 || (cleaned.length >= 3 && cleaned[2] === '9')) {
      return phoneMasks.mobile(value);
    }

    return phoneMasks.landline(value);
  }
};

// ===== DOCUMENT MASKS =====
export const documentMasks = {
  // Máscara CPF: XXX.XXX.XXX-XX
  cpf: (value: string): string => {
    let masked = maskUtils.cleanNumbers(value);

    if (masked.length >= 3) {
      masked = masked.slice(0, 3) + '.' + masked.slice(3);
    }
    if (masked.length >= 7) {
      masked = masked.slice(0, 7) + '.' + masked.slice(7);
    }
    if (masked.length >= 11) {
      masked = masked.slice(0, 11) + '-' + masked.slice(11, 13);
    }

    return masked.slice(0, 14);
  },

  // Máscara CNPJ: XX.XXX.XXX/XXXX-XX
  cnpj: (value: string): string => {
    let masked = maskUtils.cleanNumbers(value);

    if (masked.length >= 2) {
      masked = masked.slice(0, 2) + '.' + masked.slice(2);
    }
    if (masked.length >= 6) {
      masked = masked.slice(0, 6) + '.' + masked.slice(6);
    }
    if (masked.length >= 10) {
      masked = masked.slice(0, 10) + '/' + masked.slice(10);
    }
    if (masked.length >= 15) {
      masked = masked.slice(0, 15) + '-' + masked.slice(15, 17);
    }

    return masked.slice(0, 18);
  },

  // Máscara RG: XX.XXX.XXX-X
  rg: (value: string): string => {
    let masked = value.replace(/[^\dXx]/g, '').toUpperCase();

    if (masked.length >= 2) {
      masked = masked.slice(0, 2) + '.' + masked.slice(2);
    }
    if (masked.length >= 6) {
      masked = masked.slice(0, 6) + '.' + masked.slice(6);
    }
    if (masked.length >= 10) {
      masked = masked.slice(0, 10) + '-' + masked.slice(10, 11);
    }

    return masked.slice(0, 12);
  },

  // Detectar e aplicar máscara CPF ou CNPJ
  cpfCnpj: (value: string): string => {
    const cleaned = maskUtils.cleanNumbers(value);

    if (cleaned.length <= 11) {
      return documentMasks.cpf(value);
    }

    return documentMasks.cnpj(value);
  }
};

// ===== FINANCIAL MASKS =====
export const financialMasks = {
  // Máscara de moeda BRL
  currency: (value: string, prefix: string = 'R$ '): string => {
    let cleaned = maskUtils.cleanNumbers(value);

    if (!cleaned) return '';

    // Converter para número
    const number = parseInt(cleaned, 10) / 100;

    // Formatar com 2 casas decimais
    const formatted = number.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    return prefix + formatted;
  },

  // Máscara de cartão de crédito: XXXX XXXX XXXX XXXX
  creditCard: (value: string): string => {
    const cleaned = maskUtils.cleanNumbers(value);
    const match = cleaned.match(/.{1,4}/g);

    return match ? match.join(' ').slice(0, 19) : '';
  },

  // Máscara de CVV: XXX ou XXXX
  cvv: (value: string): string => {
    return maskUtils.cleanNumbers(value).slice(0, 4);
  },

  // Máscara de validade: MM/AA
  cardExpiry: (value: string): string => {
    let masked = maskUtils.cleanNumbers(value);

    if (masked.length >= 2) {
      masked = masked.slice(0, 2) + '/' + masked.slice(2, 4);
    }

    return masked;
  }
};

// ===== ADDRESS MASKS =====
export const addressMasks = {
  // Máscara CEP: XXXXX-XXX
  cep: (value: string): string => {
    let masked = maskUtils.cleanNumbers(value);

    if (masked.length >= 5) {
      masked = masked.slice(0, 5) + '-' + masked.slice(5, 8);
    }

    return masked.slice(0, 9);
  },

  // Validar formato CEP
  isValidCep: (value: string): boolean => {
    return /^\d{5}-?\d{3}$/.test(value);
  }
};

// ===== OTHER MASKS =====
export const otherMasks = {
  // Máscara de placa de veículo (formato antigo): AAA-XXXX
  licensePlateOld: (value: string): string => {
    let masked = value.toUpperCase().replace(/[^A-Z0-9]/g, '');

    if (masked.length >= 3) {
      masked = masked.slice(0, 3) + '-' + masked.slice(3, 7);
    }

    return masked.slice(0, 8);
  },

  // Máscara de placa Mercosul: AAA-XAXX
  licensePlateMercosul: (value: string): string => {
    let masked = value.toUpperCase().replace(/[^A-Z0-9]/g, '');

    if (masked.length >= 3) {
      masked = masked.slice(0, 3) + '-' + masked.slice(3, 7);
    }

    return masked.slice(0, 8);
  },

  // Porcentagem: XX.XX%
  percentage: (value: string): string => {
    let cleaned = maskUtils.cleanNumbers(value);

    if (!cleaned) return '';

    // Limitar a 100.00
    let number = parseInt(cleaned, 10);
    if (number > 10000) number = 10000;

    const formatted = (number / 100).toFixed(2).replace('.', ',');
    return formatted + '%';
  },

  // Peso: XXX.XXX kg
  weight: (value: string): string => {
    let cleaned = maskUtils.cleanNumbers(value);

    if (!cleaned) return '';

    const number = parseInt(cleaned, 10) / 1000;
    return number.toLocaleString('pt-BR', {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3
    }) + ' kg';
  }
};

// ===== VALIDATORS =====
export const validators = {
  // Validar CPF
  cpf: (value: string): boolean => {
    const cleaned = maskUtils.cleanNumbers(value);

    if (cleaned.length !== 11) return false;
    if (/^(\d)\1+$/.test(cleaned)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleaned.charAt(i)) * (10 - i);
    }
    let digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(cleaned.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleaned.charAt(i)) * (11 - i);
    }
    digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;

    return digit === parseInt(cleaned.charAt(10));
  },

  // Validar CNPJ
  cnpj: (value: string): boolean => {
    const cleaned = maskUtils.cleanNumbers(value);

    if (cleaned.length !== 14) return false;
    if (/^(\d)\1+$/.test(cleaned)) return false;

    let length = cleaned.length - 2;
    let numbers = cleaned.substring(0, length);
    const digits = cleaned.substring(length);
    let sum = 0;
    let pos = length - 7;

    for (let i = length; i >= 1; i--) {
      sum += parseInt(numbers.charAt(length - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(0))) return false;

    length += 1;
    numbers = cleaned.substring(0, length);
    sum = 0;
    pos = length - 7;

    for (let i = length; i >= 1; i--) {
      sum += parseInt(numbers.charAt(length - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);

    return result === parseInt(digits.charAt(1));
  },

  // Validar telefone brasileiro
  phone: (value: string): boolean => {
    const cleaned = maskUtils.cleanNumbers(value);
    return cleaned.length === 10 || cleaned.length === 11;
  }
};

// ===== EXPORT FACADE =====
// Compatibilidade com a versão anterior
export const applyDateMask = dateMasks.date;
export const applyPhoneMask = phoneMasks.mobile;
export const applyCpfMask = documentMasks.cpf;
export const removeMask = maskUtils.cleanNumbers;
export const isValidDateFormat = dateMasks.isValidDate;
