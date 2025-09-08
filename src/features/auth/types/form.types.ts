import {
  ForgotPasswordFormData,
  LoginFormData,
  PasswordStrength,
  RegisterFormData,
  ResetPasswordFormData
} from './auth.types';

export interface FormField<T = any> {
  name: string;
  value: T;
  error?: string;
  touched: boolean;
  dirty: boolean;
  required?: boolean;
}

export interface FormState<T extends Record<string, any>> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  dirty: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isSubmitting: boolean;
  submitCount: number;
}

export interface FormActions<T extends Record<string, any>> {
  updateField: <K extends keyof T>(field: K, value: T[K]) => void;
  setFieldError: <K extends keyof T>(field: K, error: string) => void;
  clearFieldError: <K extends keyof T>(field: K) => void;
  setFieldTouched: <K extends keyof T>(field: K, touched?: boolean) => void;
  validateField: <K extends keyof T>(field: K) => boolean;
  validateForm: () => boolean;
  resetForm: () => void;
  setFormValues: (values: Partial<T>) => void;
  submitForm: () => Promise<boolean>;
}

export interface FormHookReturn<T extends Record<string, any>> {
  formState: FormState<T>;
  formActions: FormActions<T>;
  values: T;
  errors: Partial<Record<keyof T, string>>;
  isValid: boolean;
  isSubmitting: boolean;
  canSubmit: boolean;
}

export type ValidatorFunction<T = any> = (value: T) => string | undefined;

export interface FieldValidator<T = any> {
  validator: ValidatorFunction<T>;
  message: string;
  when?: (values: any) => boolean; // Conditional validation
}

export type FormValidators<T extends Record<string, any>> = {
  [K in keyof T]?: Array<FieldValidator<T[K]>>;
}

export interface FormConfig<T extends Record<string, any>> {
  initialValues: T;
  validators?: FormValidators<T>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  resetOnSubmit?: boolean;
  submitOnEnter?: boolean;
}

export type InputType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'search'
  | 'date'
  | 'time'
  | 'datetime-local'
  | 'checkbox'
  | 'radio'
  | 'select'
  | 'textarea'
  | 'file';

export interface InputProps {
  type: InputType;
  name: string;
  value?: any;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
  tabIndex?: number;
}

export interface LoginFormState extends FormState<LoginFormData> {
  rememberMeChecked: boolean;
  showPassword: boolean;
}

export interface RegisterFormState extends FormState<RegisterFormData> {
  showPassword: boolean;
  showConfirmPassword: boolean;
  passwordStrength: PasswordStrength;
  termsAccepted: boolean;
}

export interface ForgotPasswordFormState extends FormState<ForgotPasswordFormData> {
  emailSent: boolean;
  canResend: boolean;
  resendCooldown: number;
}

export interface ResetPasswordFormState extends FormState<ResetPasswordFormData> {
  showPassword: boolean;
  showConfirmPassword: boolean;
  passwordStrength: PasswordStrength;
  resetComplete: boolean;
}

export interface FormSubmissionResult {
  success: boolean;
  data?: any;
  errors?: Record<string, string>;
  message?: string;
}

export interface FormSubmissionConfig {
  preventDefaultSubmit?: boolean;
  showLoadingState?: boolean;
  resetOnSuccess?: boolean;
  redirectOnSuccess?: string;
  showSuccessMessage?: boolean;
  showErrorMessage?: boolean;
}

export interface FormAnalytics {
  formName: string;
  startTime: number;
  endTime?: number;
  fieldsInteracted: string[];
  errorsEncountered: Record<string, string[]>;
  submitAttempts: number;
  completed: boolean;
  abandonedAt?: string;
  timeToComplete?: number;
}

export interface FormStep {
  name: string;
  title: string;
  description?: string;
  fields: string[];
  isValid: boolean;
  isComplete: boolean;
  isOptional?: boolean;
}

export interface MultiStepFormState<T extends Record<string, any>> extends FormState<T> {
  currentStep: number;
  steps: FormStep[];
  canGoNext: boolean;
  canGoPrev: boolean;
  progress: number;
}

export interface MultiStepFormActions<T extends Record<string, any>> extends FormActions<T> {
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  skipStep: () => void;
  validateStep: (step?: number) => boolean;
}

export interface FormAccessibility {
  labelId?: string;
  errorId?: string;
  describedBy?: string;
  ariaInvalid?: boolean;
  ariaRequired?: boolean;
  role?: string;
}

export type FormLayout = 'vertical' | 'horizontal' | 'inline';
export type FormSize = 'small' | 'medium' | 'large';
export type FormVariant = 'default' | 'outlined' | 'filled' | 'minimal';

export interface FormTheme {
  layout: FormLayout;
  size: FormSize;
  variant: FormVariant;
  spacing: number;
  borderRadius: number;
  colorScheme: 'light' | 'dark';
}

export type {
  LoginFormData,
  RegisterFormData,
  ForgotPasswordFormData,
  ResetPasswordFormData,
  PasswordStrength
} from './auth.types';
