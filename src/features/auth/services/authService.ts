import {apiClient} from '@/lib/api/client';
import {tokenService} from './tokenService';
import {
  AuthResponse,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest
} from '@/features/auth/types';


class AuthService {
  private readonly baseUrl = '/auth';

  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(`${this.baseUrl}/login`, data);

      await tokenService.storeTokens(response.tokens, data.rememberMe);

      return response;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(`${this.baseUrl}/register`, data);
      await tokenService.storeTokens(response.tokens, false);

      return response;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<{ message: string }> {
    try {
      return await apiClient.post(`${this.baseUrl}/forgot-password`, data);
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  async resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
    try {
      return await apiClient.post(`${this.baseUrl}/reset-password`, data);
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      const refreshToken = await tokenService.getRefreshToken();

      if (refreshToken) {
        await apiClient.post(`${this.baseUrl}/logout`, {refreshToken}).catch(() => {});
      }
    } finally {
      await tokenService.clearTokens();
    }
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    try {
      return await apiClient.post(`${this.baseUrl}/verify-email`, {token});
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  async resendVerificationEmail(): Promise<{ message: string }> {
    try {
      return await apiClient.post(`${this.baseUrl}/resend-verification`);
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  private handleAuthError(error: any): Error {
    const errorCode = error.response?.data?.code || error.code;
    const errorMessage = error.response?.data?.message || error.message;
    const authError = new Error(errorMessage) as any;

    authError.code = errorCode;
    authError.status = error.response?.status;
    authError.fieldErrors = error.response?.data?.fieldErrors;

    return authError;
  }
}

export const authService = new AuthService();
