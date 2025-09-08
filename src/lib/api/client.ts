// lib/api/client.ts
import {storageService} from '../storage/storageService';
import type {ApiError, RequestConfig} from '@/shared/types';

class ApiClient {
  private baseUrl: string;
  private defaultTimeout = 10000; // 10 segundos
  private defaultRetries = 3;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
  }

  // Generic request method
  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const {
      timeout = this.defaultTimeout,
      retries = this.defaultRetries,
      ...fetchConfig
    } = config;

    const url = `${this.baseUrl}${endpoint}`;

    // Headers padrão
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...config.headers,
    };

    // Adiciona token de autorização se disponível
    const token = await storageService.getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const requestConfig: RequestInit = {
      ...fetchConfig,
      headers,
    };

    return this.executeWithRetry(url, requestConfig, retries, timeout);
  }

  // Execute request with retry logic
  private async executeWithRetry<T>(
    url: string,
    config: RequestInit,
    retries: number,
    timeout: number
  ): Promise<T> {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          ...config,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          await this.handleErrorResponse(response);
        }

        const result = await response.json();

        if (result && typeof result === 'object' && 'data' in result) {
          return result.data as T;
        }

        return result as T;

      } catch (error: any) {
        // Se não é o último retry e é erro de rede, tenta novamente
        if (attempt < retries && this.isRetryableError(error)) {
          await this.delay(Math.pow(2, attempt) * 1000); // Exponential backoff
          continue;
        }

        throw this.createApiError(error);
      }
    }

    throw new Error('Max retries exceeded');
  }

  // Handle error responses
  private async handleErrorResponse(response: Response): Promise<never> {
    let errorData: any = {};

    try {
      errorData = await response.json();
    } catch {
      errorData = {
        message: response.statusText,
        code: `HTTP_${response.status}`,
      };
    }

    // Token expirado - lança erro especial para retry
    if (response.status === 401 && errorData.code === 'TOKEN_EXPIRED') {
      await this.handleTokenRefresh();
      throw {
        shouldRetry: true,
        code: 'TOKEN_REFRESHED',
        message: 'Token refreshed, retry request'
      };
    }

    const apiError: ApiError = {
      status: response.status,
      code: errorData.code || `HTTP_${response.status}`,
      message: errorData.message || 'Request failed',
      fieldErrors: errorData.fieldErrors,
    };

    throw apiError;
  }

  // Handle token refresh
  private async handleTokenRefresh(): Promise<void> {
    try {
      // Import dinâmico para evitar circular dependency
      const {tokenService} = await import('@/src/features/auth/services/tokenService');
      await tokenService.refreshToken();
    } catch (error) {
      // Se refresh falha, limpa tokens e força relogin
      await storageService.clearAuthStorage();
      throw new Error('Authentication expired');
    }
  }

  // Create standardized API error
  private createApiError(error: any): ApiError {
    if (error.name === 'AbortError') {
      return {
        status: 408,
        code: 'TIMEOUT',
        message: 'Request timeout',
      };
    }

    if (!navigator.onLine) {
      return {
        status: 0,
        code: 'NETWORK_ERROR',
        message: 'No internet connection',
      };
    }

    return {
      status: error.status || 500,
      code: error.code || 'UNKNOWN_ERROR',
      message: error.message || 'An unexpected error occurred',
      fieldErrors: error.fieldErrors,
    };
  }

  // Check if error is retryable
  private isRetryableError(error: any): boolean {
    // Retry on network errors, timeouts, and 5xx server errors
    return (
      error.name === 'AbortError' ||
      !navigator.onLine ||
      (error.status >= 500 && error.status < 600)
    );
  }

  // Delay utility for retries
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // HTTP Methods
  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {...config, method: 'GET'});
  }

  async post<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {...config, method: 'DELETE'});
  }

  // Upload method for files
  async upload<T>(
    endpoint: string,
    formData: FormData,
    config?: RequestConfig
  ): Promise<T> {
    const {headers, ...restConfig} = config || {};

    return this.request<T>(endpoint, {
      ...restConfig,
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
        ...headers,
      },
    });
  }
}

// Create and export client instance
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://7b34cf5407a6.ngrok-free.app';
export const apiClient = new ApiClient(API_BASE_URL);
