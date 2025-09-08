import {apiClient} from '@/lib/api/client';
import {storageService} from '@/lib/storage/storageService';
import {AuthTokens, RefreshTokenResponse} from '@/features/auth/types';

class TokenService {
  private readonly baseUrl = '/auth';

  async refreshToken(): Promise<AuthTokens> {
    try {
      const refreshToken = await this.getRefreshToken();

      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiClient.post<RefreshTokenResponse>(
        `${this.baseUrl}/refresh-token`,
        {refreshToken}
      );

      await this.storeTokens(response.tokens, true);

      return response.tokens;
    } catch (error) {
      await this.clearTokens();
      throw this.handleTokenError(error);
    }
  }

  async storeTokens(tokens: AuthTokens, persistent: boolean = false): Promise<void> {
    await Promise.all([
      storageService.setAccessToken(tokens.accessToken, persistent),
      storageService.setRefreshToken(tokens.refreshToken, persistent),
      storageService.setTokenExpiry(tokens.expiresIn, persistent),
    ]);
  }

  async clearTokens(): Promise<void> {
    await Promise.all([
      storageService.removeAccessToken(),
      storageService.removeRefreshToken(),
      storageService.removeTokenExpiry(),
    ]);
  }

  async getAccessToken(): Promise<string | null> {
    return await storageService.getAccessToken();
  }

  async getRefreshToken(): Promise<string | null> {
    return await storageService.getRefreshToken();
  }

  async getTokenExpiry(): Promise<number | null> {
    return await storageService.getTokenExpiry();
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await this.getAccessToken();
      return !!token && !await this.isTokenExpired();
    } catch {
      return false;
    }
  }

  async isTokenExpired(): Promise<boolean> {
    try {
      const expiry = await this.getTokenExpiry();
      return !expiry || Date.now() >= expiry;
    } catch {
      return true;
    }
  }

  async getValidToken(): Promise<string | null> {
    try {
      if (await this.isTokenExpired()) {
        await this.refreshToken();
      }
      return await this.getAccessToken();
    } catch {
      return null;
    }
  }

  private handleTokenError(error: any): Error {
    const errorCode = error.response?.data?.code || error.code;
    const errorMessage = error.response?.data?.message || error.message;

    const tokenError = new Error(errorMessage) as any;
    tokenError.code = errorCode;
    tokenError.status = error.response?.status;

    return tokenError;
  }
}

export const tokenService = new TokenService();
