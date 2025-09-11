export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  phone?: string;
  dateOfBirth?: string;
  avatarUrl?: string;
  country?: string;
  city?: string;
  timezone?: string;
  language?: string;
  isActive?: boolean;
  isVerified?: boolean;
  pushNotifications?: boolean;
  emailNotifications?: boolean;
  themePreference?: 'light' | 'dark' | 'system';
  firstLoginAt?: string;
  lastActiveAt?: string;
  loginCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
}

export interface AuthResponse {
  user: User | null;
  error: string | null;
}

export interface ForgotPasswordCredentials {
  email: string;
}

export interface ResetPasswordCredentials {
  password: string;
  confirmPassword: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  error?: string;
  message?: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  error?: string;
  message?: string;
}
