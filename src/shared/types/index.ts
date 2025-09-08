import {ApiError, ApiResponse, PaginatedResponse, RequestConfig } from './api.types';

export type {
  ApiResponse,
  ApiError,
  PaginatedResponse,
  PaginationMeta,

  RequestConfig,
  ApiClientConfig,
  RetryConfig,
  RetryState,

  // Error Handling
  ApiErrorCode,
  ErrorHandler,
  GlobalErrorHandlers,

  UploadConfig,
  UploadProgress,
  UploadResponse,

  CacheConfig,
  CacheEntry,

  RequestInterceptor,
  ResponseInterceptor,

  ApiEndpoint,
  ApiEndpoints,

  ApiMetrics,
  RequestLog,
  HealthCheckResponse,
  ServiceHealth,

  ValidationRule,
  ValidationConstraint,
  ValidationError,

  ContentType,
  HttpStatusCode,
  HttpStatus,
} from './api.types';

export type ApiTypes = {
  ApiResponse: ApiResponse;
  ApiError: ApiError;
  RequestConfig: RequestConfig;
  PaginatedResponse: PaginatedResponse<any>;
};

export type ExtractApiData<T> = T extends ApiResponse<infer U> ? U : never;

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type SuccessStatusCode = 200 | 201 | 202 | 204;
export type ErrorStatusCode = 400 | 401 | 403 | 404 | 422 | 500 | 502 | 503;
