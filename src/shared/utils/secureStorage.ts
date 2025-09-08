import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

export class SecureStorage {
  private static readonly PREFIX = 'myapp_';

  static async setItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(this.PREFIX + key, value);
    } catch (error) {
      console.error('Erro ao salvar no SecureStore:', error);
      throw error;
    }
  }

  static async getItem(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(this.PREFIX + key);
    } catch (error) {
      console.error('Erro ao ler do SecureStore:', error);
      return null;
    }
  }

  static async removeItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(this.PREFIX + key);
    } catch (error) {
      console.error('Erro ao remover do SecureStore:', error);
      throw error;
    }
  }

  static async clear(): Promise<void> {
    const keys = ['token', 'refreshToken', 'biometric_key'];

    for (const key of keys) {
      await this.removeItem(key);
    }
  }
}

export class CryptoUtils {
  static async hashPassword(password: string): Promise<string> {
    return await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      password
    );
  }

  static generateUUID(): string {
    return Crypto.randomUUID();
  }

  static async generateRandomString(length: number = 32): Promise<string> {
    const bytes = await Crypto.getRandomBytesAsync(length);
    return bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
  }

  static validatePasswordStrength(password: string): {
    isValid: boolean;
    errors: string[];
    strength: 'weak' | 'medium' | 'strong';
  } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Senha deve ter pelo menos 8 caracteres');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Deve conter ao menos uma letra maiúscula');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Deve conter ao menos uma letra minúscula');
    }

    if (!/\d/.test(password)) {
      errors.push('Deve conter ao menos um número');
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Deve conter ao menos um caractere especial');
    }

    const strengthScore = 5 - errors.length;
    let strength: 'weak' | 'medium' | 'strong' = 'weak';

    if (strengthScore >= 4) strength = 'strong';
    else if (strengthScore >= 2) strength = 'medium';

    return {
      isValid: errors.length === 0,
      errors,
      strength
    };
  }
}

export const AppConfig = {
  API_URL: process.env.EXPO_PUBLIC_API_URL || 'https://api.exemplo.com',

  REQUEST_TIMEOUT: 10000,
  REFRESH_TOKEN_TIMEOUT: 5000,

  MAX_FILE_SIZE: 10 * 1024 * 1024,
  MAX_RETRY_ATTEMPTS: 3,

  BIOMETRIC_AUTH: true,
  OFFLINE_MODE: true,
  PUSH_NOTIFICATIONS: true,

  DEBUG_MODE: __DEV__,
  LOG_LEVEL: __DEV__ ? 'debug' : 'error',
} as const;
