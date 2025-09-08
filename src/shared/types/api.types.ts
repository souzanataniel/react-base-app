export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  timestamp?: string;
  requestId?: string;
}

export interface ApiError {
  code: string;
  message: string;
  status: number;
  details?: any;
  fieldErrors?: Record<string, string>;
  timestamp?: string;
  requestId?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
  success: boolean;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface RequestConfig extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  skipAuthRefresh?: boolean;
  skipErrorHandling?: boolean;
}

export interface ApiClientConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
  retryDelay: number;
  headers?: Record<string, string>;
}

export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffFactor: number;
  retryCondition: (error: any) => boolean;
}

export interface RetryState {
  attempt: number;
  maxAttempts: number;
  delay: number;
  lastError: any;
}

export type ApiErrorCode =
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'SERVER_ERROR'
  | 'RATE_LIMITED'
  | 'MAINTENANCE'
  | 'UNKNOWN_ERROR';

export interface ErrorHandler {
  code: ApiErrorCode;
  handler: (error: ApiError) => void | Promise<void>;
}

export interface GlobalErrorHandlers {
  unauthorized?: () => void;
  forbidden?: () => void;
  networkError?: () => void;
  serverError?: () => void;
  rateLimited?: () => void;
  maintenance?: () => void;
}

export interface UploadConfig {
  maxFileSize: number;
  allowedTypes: string[];
  multiple: boolean;
  compressionQuality?: number;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
  metadata?: Record<string, any>;
}

export interface CacheConfig {
  ttl: number;
  maxSize: number;
  strategy: 'memory' | 'storage' | 'hybrid';
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  key: string;
}

export interface RequestInterceptor {
  onRequest?: (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;
  onRequestError?: (error: any) => any;
}

export interface ResponseInterceptor {
  onResponse?: <T>(response: ApiResponse<T>) => ApiResponse<T> | Promise<ApiResponse<T>>;
  onResponseError?: (error: ApiError) => any;
}

export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  requiresAuth?: boolean;
  rateLimit?: {
    maxRequests: number;
    windowMs: number;
  };
  cache?: CacheConfig;
  timeout?: number;
}

export type ApiEndpoints = Record<string, ApiEndpoint>;

export interface ApiMetrics {
  requestCount: number;
  errorCount: number;
  averageResponseTime: number;
  successRate: number;
  lastRequestAt?: string;
}

export interface RequestLog {
  id: string;
  method: string;
  url: string;
  status: number;
  duration: number;
  timestamp: string;
  error?: string;
}

export interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  uptime: number;
  services: ServiceHealth[];
}

export interface ServiceHealth {
  name: string;
  status: 'up' | 'down' | 'degraded';
  responseTime?: number;
  lastCheck: string;
}

export interface ValidationRule {
  field: string;
  rules: ValidationConstraint[];
}

export interface ValidationConstraint {
  type: 'required' | 'email' | 'min' | 'max' | 'pattern' | 'custom';
  value?: any;
  message: string;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: any;
}

export type ContentType =
  | 'application/json'
  | 'application/x-www-form-urlencoded'
  | 'multipart/form-data'
  | 'text/plain'
  | 'text/html'
  | 'application/xml';

export type HttpStatusCode =
  | 200 | 201 | 202 | 204
  | 400 | 401 | 403 | 404 | 409 | 422 | 429
  | 500 | 502 | 503 | 504;

export interface HttpStatus {
  code: HttpStatusCode;
  message: string;
  category: 'success' | 'client_error' | 'server_error';
}
