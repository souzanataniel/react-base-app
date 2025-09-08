import {
  AuthResponse,
  AuthTokens,
  LoginFormData,
  LoginRequest,
  RegisterFormData,
  RegisterRequest,
  User
} from './auth.types';
import {FormActions, FormHookReturn, FormState, ValidatorFunction} from './form.types';

// ===== AUTH TYPES =====
export type {
  // Requests
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  VerifyEmailRequest,
  SocialAuthRequest,

  // Responses
  AuthResponse,
  RefreshTokenResponse,
  AuthMessageResponse,

  // Tokens
  AuthTokens,
  TokenPayload,

  // State
  AuthState,
  AuthActions,

  // Form Data
  LoginFormData,
  RegisterFormData,
  ForgotPasswordFormData,
  ResetPasswordFormData,

  // Form Errors
  LoginFormErrors,
  RegisterFormErrors,
  ForgotPasswordFormErrors,
  ResetPasswordFormErrors,

  // Validation
  PasswordStrength,
  ValidationResult,
  FieldValidation,

  // Session
  SessionInfo,
  ActiveSession,

  // Providers
  AuthProvider,
} from './auth.types';

// ===== USER TYPES =====
export type {
  // Core User
  User,
  UserGender,
  UserProfile,
  SocialLinks,
  UserPreferences,
  NotificationPreferences,
  PrivacyPreferences,
  AppearancePreferences,
  UserStats,

  // Updates
  UpdateUserRequest,
  UpdatePreferencesRequest,

  // State
  UserState,
  UserActions,
  UserHelpers,

  // Avatar
  AvatarUploadRequest,
  CropData,
  AvatarResponse,

  // Verification
  EmailVerificationRequest,
  PhoneVerificationRequest,
  VerificationCodeRequest,

  // Search
  UserSearchParams,
  UserOrderBy,
  UserSearchResult,

  // Deletion
  DeleteAccountRequest,
  AccountDeletionInfo,

  // Export
  UserDataExport,
} from './user.types';

// ===== FORM TYPES =====
export type {
  // Generic Form
  FormField,
  FormState,
  FormActions,
  FormHookReturn,

  // Validation
  ValidatorFunction,
  FieldValidator,
  FormValidators,
  FormConfig,

  // Input
  InputType,
  InputProps,

  // Auth Form States
  LoginFormState,
  RegisterFormState,
  ForgotPasswordFormState,
  ResetPasswordFormState,

  // Submission
  FormSubmissionResult,
  FormSubmissionConfig,
  FormAnalytics,

  // Multi-step
  FormStep,
  MultiStepFormState,
  MultiStepFormActions,

  // Accessibility
  FormAccessibility,

  // Layout
  FormLayout,
  FormSize,
  FormVariant,
  FormTheme,
} from './form.types';

// ===== CONVENIENCE TYPE GROUPS =====

// Auth related types (most commonly used)
export type AuthTypes = {
  LoginRequest: LoginRequest;
  RegisterRequest: RegisterRequest;
  AuthResponse: AuthResponse;
  AuthTokens: AuthTokens;
  User: User;
  LoginFormData: LoginFormData;
  RegisterFormData: RegisterFormData;
};

// Form related types
export type FormTypes = {
  FormState: FormState<any>;
  FormActions: FormActions<any>;
  FormHookReturn: FormHookReturn<any>;
  ValidatorFunction: ValidatorFunction;
};

// ===== TYPE UTILITIES =====

// Extract form data type from form
