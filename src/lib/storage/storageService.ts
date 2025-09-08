// lib/storage/storageService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Storage keys
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  TOKEN_EXPIRY: 'token_expiry',
  USER_PREFERENCES: 'user_preferences',
} as const;

class StorageService {
  // Token Management
  async setAccessToken(token: string, persistent: boolean = false): Promise<void> {
    if (persistent && Platform.OS !== 'web') {
      await SecureStore.setItemAsync(STORAGE_KEYS.ACCESS_TOKEN, token);
    } else {
      await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
    }
  }

  async getAccessToken(): Promise<string | null> {
    try {
      // Tenta SecureStore primeiro (para tokens persistentes)
      if (Platform.OS !== 'web') {
        const secureToken = await SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
        if (secureToken) return secureToken;
      }

      // Fallback para AsyncStorage
      return await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    } catch {
      return null;
    }
  }

  async removeAccessToken(): Promise<void> {
    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN),
      Platform.OS !== 'web' ? SecureStore.deleteItemAsync(STORAGE_KEYS.ACCESS_TOKEN).catch(() => {}) : Promise.resolve(),
    ]);
  }

  async setRefreshToken(token: string, persistent: boolean = false): Promise<void> {
    if (persistent && Platform.OS !== 'web') {
      await SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, token);
    } else {
      await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
    }
  }

  async getRefreshToken(): Promise<string | null> {
    try {
      if (Platform.OS !== 'web') {
        const secureToken = await SecureStore.getItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
        if (secureToken) return secureToken;
      }

      return await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    } catch {
      return null;
    }
  }

  async removeRefreshToken(): Promise<void> {
    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN),
      Platform.OS !== 'web' ? SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN).catch(() => {}) : Promise.resolve(),
    ]);
  }

  async setTokenExpiry(expiresIn: number, persistent: boolean = false): Promise<void> {
    const expiryTime = Date.now() + (expiresIn * 1000);
    const expiryString = expiryTime.toString();

    if (persistent && Platform.OS !== 'web') {
      await SecureStore.setItemAsync(STORAGE_KEYS.TOKEN_EXPIRY, expiryString);
    } else {
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, expiryString);
    }
  }

  async getTokenExpiry(): Promise<number | null> {
    try {
      let expiryString: string | null = null;

      if (Platform.OS !== 'web') {
        expiryString = await SecureStore.getItemAsync(STORAGE_KEYS.TOKEN_EXPIRY);
      }

      if (!expiryString) {
        expiryString = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY);
      }

      return expiryString ? parseInt(expiryString, 10) : null;
    } catch {
      return null;
    }
  }

  async removeTokenExpiry(): Promise<void> {
    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRY),
      Platform.OS !== 'web' ? SecureStore.deleteItemAsync(STORAGE_KEYS.TOKEN_EXPIRY).catch(() => {}) : Promise.resolve(),
    ]);
  }

  // Generic Storage Methods
  async setItem(key: string, value: string, secure: boolean = false): Promise<void> {
    if (secure && Platform.OS !== 'web') {
      await SecureStore.setItemAsync(key, value);
    } else {
      await AsyncStorage.setItem(key, value);
    }
  }

  async getItem(key: string, secure: boolean = false): Promise<string | null> {
    try {
      if (secure && Platform.OS !== 'web') {
        return await SecureStore.getItemAsync(key);
      }
      return await AsyncStorage.getItem(key);
    } catch {
      return null;
    }
  }

  async removeItem(key: string, secure: boolean = false): Promise<void> {
    await AsyncStorage.removeItem(key);
    if (secure && Platform.OS !== 'web') {
      await SecureStore.deleteItemAsync(key).catch(() => {});
    }
  }

  // Object Storage (with JSON parsing)
  async setObject<T>(key: string, value: T, secure: boolean = false): Promise<void> {
    const jsonValue = JSON.stringify(value);
    await this.setItem(key, jsonValue, secure);
  }

  async getObject<T>(key: string, secure: boolean = false): Promise<T | null> {
    try {
      const jsonValue = await this.getItem(key, secure);
      return jsonValue ? JSON.parse(jsonValue) : null;
    } catch {
      return null;
    }
  }

  // Clear all auth-related storage
  async clearAuthStorage(): Promise<void> {
    await Promise.all([
      this.removeAccessToken(),
      this.removeRefreshToken(),
      this.removeTokenExpiry(),
    ]);
  }

  // Clear all storage
  async clearAllStorage(): Promise<void> {
    await AsyncStorage.clear();

    // Clear SecureStore items individually (não tem clear all)
    if (Platform.OS !== 'web') {
      await Promise.all([
        SecureStore.deleteItemAsync(STORAGE_KEYS.ACCESS_TOKEN).catch(() => {}),
        SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN).catch(() => {}),
        SecureStore.deleteItemAsync(STORAGE_KEYS.TOKEN_EXPIRY).catch(() => {}),
      ]);
    }
  }
}

export const storageService = new StorageService();
