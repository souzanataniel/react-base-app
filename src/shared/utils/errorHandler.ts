import {AxiosError} from 'axios';
import {Alert} from 'react-native';
import {useState} from 'react';

export interface AppError {
  message: string;
  code?: string;
  statusCode?: number;
  field?: string;
}

export class ErrorHandler {
  static handle(error: unknown): AppError {
    if (error instanceof AxiosError) {
      return this.handleAxiosError(error);
    }

    if (error instanceof Error) {
      return {
        message: error.message,
        code: 'GENERIC_ERROR'
      };
    }

    return {
      message: 'Erro desconhecido',
      code: 'UNKNOWN_ERROR'
    };
  }

  private static handleAxiosError(error: AxiosError): AppError {
    const statusCode = error.response?.status;
    const data = error.response?.data as any;

    if (!error.response) {
      return {
        message: 'Erro de conexão. Verifique sua internet.',
        code: 'NETWORK_ERROR'
      };
    }

    const statusMessages: Record<number, string> = {
      400: data?.message || 'Dados inválidos',
      401: 'Não autorizado',
      403: 'Acesso negado',
      404: 'Recurso não encontrado',
      422: data?.message || 'Dados inválidos',
      429: 'Muitas tentativas. Tente novamente mais tarde.',
      500: 'Erro interno do servidor',
      502: 'Serviço temporariamente indisponível',
      503: 'Serviço em manutenção'
    };

    return {
      message: statusMessages[statusCode!] || 'Erro no servidor',
      code: `HTTP_${statusCode}`,
      statusCode,
      field: data?.field
    };
  }

  static showError(error: unknown, customMessage?: string) {
    const appError = this.handle(error);

    Alert.alert(
      'Erro',
      customMessage || appError.message,
      [{text: 'OK'}]
    );
  }

  static logError(error: unknown, context?: string) {
    const appError = this.handle(error);

    console.error('Error:', {
      message: appError.message,
      code: appError.code,
      statusCode: appError.statusCode,
      context,
      timestamp: new Date().toISOString()
    });

    // Em produção, enviar para serviço de monitoramento (Sentry, Bugsnag, etc.)
    if (__DEV__ === false) {
      // Sentry.captureException(error);
    }
  }
}

export const useErrorHandler = () => {
  const [error, setError] = useState<AppError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAsync = async <T>(
    asyncFn: () => Promise<T>,
    options?: {
      showAlert?: boolean;
      customMessage?: string;
      onError?: (error: AppError) => void;
    }
  ): Promise<T | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await asyncFn();
      return result;
    } catch (err) {
      const appError = ErrorHandler.handle(err);
      setError(appError);

      if (options?.showAlert) {
        ErrorHandler.showError(err, options.customMessage);
      }

      if (options?.onError) {
        options.onError(appError);
      }

      ErrorHandler.logError(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    error,
    isLoading,
    handleAsync,
    clearError: () => setError(null)
  };
};
