import {
  dateFormatters,
  emailFormatters,
  errorFormatters,
  nameFormatters,
  phoneFormatters,
  stringFormatters
} from './formatters';
import {backupUtils, cacheUtils, securityUtils, storageManager, storageUtils, storageValidation} from './storage';
import {emailValidators, formValidators, nameValidators, phoneValidators, validationUtils} from './validators';

// ===== FORMATTERS =====
export {
  stringFormatters,
  emailFormatters,
  phoneFormatters,
  nameFormatters,
  dateFormatters,
  errorFormatters,
  privacyFormatters
} from './formatters';

// ===== VALIDATORS =====
export {
  emailValidators,
  phoneValidators,
  nameValidators,
  formValidators,
  validationUtils,
  type ValidationResult
} from './validators';

// ===== STORAGE UTILITIES =====
export {
  storageValidation,
  storageUtils,
  cacheUtils,
  migrationUtils,
  backupUtils,
  securityUtils,
  storageManager
} from './storage';

// ===== CONVENIENCE EXPORTS =====

// Format helpers (mais usados)
export const format = {
  // String formatters
  capitalize: stringFormatters.capitalize,
  titleCase: stringFormatters.titleCase,
  mask: stringFormatters.mask,
  truncate: stringFormatters.truncate,
  slugify: stringFormatters.slugify,

  // Email formatters
  email: emailFormatters.normalize,
  emailMask: emailFormatters.mask,
  emailDomain: emailFormatters.getDomain,

  // Phone formatters
  phone: phoneFormatters.formatBrazilian,
  phoneMask: phoneFormatters.mask,
  phoneClean: phoneFormatters.clean,

  // Name formatters
  name: nameFormatters.formatFullName,
  initials: nameFormatters.getInitials,
  firstName: nameFormatters.getFirstName,
  lastName: nameFormatters.getLastName,
  displayName: nameFormatters.getDisplayName,

  // Date formatters
  date: dateFormatters.formatDate,
  relativeTime: dateFormatters.getRelativeTime,
  timestamp: dateFormatters.formatTimestamp,
  age: dateFormatters.calculateAge,

  // Error formatters
  error: errorFormatters.formatUserError,
  logError: errorFormatters.formatLogError,
  errorCode: errorFormatters.getErrorCode
};

// Validation helpers (mais usados)
export const validate = {
  // Email validators
  email: emailValidators.isValidEmail,
  emailRobust: emailValidators.isValidEmailRobust,
  emailCorporate: emailValidators.isCorporateEmail,
  emailDisposable: emailValidators.isDisposableEmail,

  // Phone validators
  phone: phoneValidators.isValidBrazilianPhone,
  phoneInternational: phoneValidators.isValidInternationalPhone,

  // Name validators
  name: nameValidators.isValidName,
  nameCharacters: nameValidators.hasValidCharacters,

  // Form validators
  required: formValidators.required,
  minLength: formValidators.minLength,
  maxLength: formValidators.maxLength,
  pattern: formValidators.pattern,
  confirm: formValidators.confirm,
  mustBeTrue: formValidators.mustBeTrue,

  // Validation utilities
  combine: validationUtils.combineValidators,
  when: validationUtils.when,
  debounce: validationUtils.debounceValidation
};

// Storage helpers (mais usados)
export const storage = {
  // Validation
  isValid: storageValidation.isValidForStorage,
  isValidKey: storageValidation.isValidKey,

  // Utilities
  serialize: storageUtils.serialize,
  deserialize: storageUtils.deserialize,
  withMetadata: storageUtils.withMetadata,

  // Cache
  generateCacheKey: cacheUtils.generateCacheKey,
  isCacheValid: cacheUtils.isCacheValid,
  cleanCache: cacheUtils.cleanExpiredCache,

  // Backup
  createBackup: backupUtils.createBackup,
  restoreBackup: backupUtils.restoreBackup,

  // Security
  generateFingerprint: securityUtils.generateDeviceFingerprint,
  obfuscate: securityUtils.obfuscateSensitiveData,

  // Manager
  safeStore: storageManager.safeStore,
  safeRetrieve: storageManager.safeRetrieve
};

// ===== CONSTANTS =====
export const SHARED_CONSTANTS = {
  // Validation constants
  EMAIL_MAX_LENGTH: 255,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  PHONE_BR_LENGTH: 11,

  // Storage constants
  MAX_STORAGE_SIZE: 1024 * 1024, // 1MB
  CACHE_DEFAULT_TTL: 5 * 60 * 1000, // 5 minutos

  // Format constants
  MASK_CHAR: '*',
  DEFAULT_VISIBLE_CHARS: 4,
} as const;

// ===== PATTERNS =====
export const SHARED_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  EMAIL_ROBUST: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  PHONE_BR: /^(\+55)?(\d{2})(\d{4,5})(\d{4})$/,
  NAME: /^[a-zA-ZÀ-ÿ\s\-']{2,50}$/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
} as const;

// ===== FACTORY FUNCTIONS =====

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

// Criar formatador personalizado
export const createFormatter = (type: 'email' | 'phone' | 'name' | 'date') => {
  const formatters = {
    email: format.email,
    phone: format.phone,
    name: format.name,
    date: format.date
  };

  return formatters[type];
};

// ===== QUICK ACCESS UTILITIES =====

// Validações mais comuns
export const quickValidate = {
  email: (email: string) => validate.email(email),
  phone: (phone: string) => validate.phone(phone),
  name: (name: string) => validate.name(name),
  required: (value: any) => validate.required(value)
};

// Formatações mais comuns
export const quickFormat = {
  email: (email: string) => format.email(email),
  phone: (phone: string) => format.phone(phone),
  name: (name: string) => format.name(name),
  mask: (str: string) => format.mask(str)
};
