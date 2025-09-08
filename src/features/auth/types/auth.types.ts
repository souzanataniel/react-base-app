import {User} from './user.types';

// ===== AUTHENTICATION REQUESTS =====
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface VerifyEmailRequest {
  token: string;
}

// ===== AUTHENTICATION RESPONSES =====
export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
  message: string;
}

export interface RefreshTokenResponse {
  tokens: AuthTokens;
}

export interface AuthMessageResponse {
  message: string;
  success: boolean;
}

// ===== TOKEN TYPES =====
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // em segundos
  tokenType?: string; // 'Bearer'
}

export interface TokenPayload {
  sub: string; // user id
  email: string;
  iat: number; // issued at
  exp: number; // expires at
  iss?: string; // issuer
}

export interface AuthActions {
  login: (tokens: AuthTokens) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
  checkAuthStatus: () => Promise<boolean>;
}

// ===== FORM DATA TYPES =====
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

// ===== FORM ERROR TYPES =====
export type LoginFormErrors = Partial<Record<keyof LoginFormData, string>>;
export type RegisterFormErrors = Partial<Record<keyof RegisterFormData, string>>;
export type ForgotPasswordFormErrors = Partial<Record<keyof ForgotPasswordFormData, string>>;
export type ResetPasswordFormErrors = Partial<Record<keyof ResetPasswordFormData, string>>;

// ===== VALIDATION TYPES =====
export type PasswordStrength = 'weak' | 'medium' | 'strong';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  customValidator?: (value: any) => ValidationResult;
}

// ===== AUTH PROVIDER TYPES =====
export type AuthProvider = 'email' | 'google' | 'apple' | 'facebook';

export interface SocialAuthRequest {
  provider: AuthProvider;
  token: string;
  email?: string;
  name?: string;
}

// ===== SESSION TYPES =====
export interface SessionInfo {
  deviceId: string;
  deviceName: string;
  ipAddress: string;
  userAgent: string;
  lastActiveAt: string;
  createdAt: string;
  isCurrent: boolean;
}

export interface ActiveSession {
  id: string;
  user: User;
  tokens: AuthTokens;
  sessionInfo: SessionInfo;
}

// Re-export User type (será definido em user.types.ts)
export type {User} from './user.types';

export interface AuthState {
  // Estado de autenticação
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;

  // Actions de autenticação
  login: (tokens: AuthTokens) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
  checkAuthStatus: () => Promise<boolean>;
}
