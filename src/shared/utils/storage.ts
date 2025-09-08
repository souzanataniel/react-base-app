import {Platform} from 'react-native';

export const storageValidation = {
  isValidForStorage: (value: any): boolean => {
    if (value === null || value === undefined) return false;

    try {
      JSON.stringify(value);
      return true;
    } catch {
      return false;
    }
  },

  isValidKey: (key: string): boolean => {
    return typeof key === 'string' && key.length > 0 && key.length <= 255;
  },

  isValidSize: (value: any, maxSize: number = 1024 * 1024): boolean => {
    try {
      const jsonString = JSON.stringify(value);
      return jsonString.length <= maxSize;
    } catch {
      return false;
    }
  }
};

export const storageUtils = {
  serialize: (data: any): string | null => {
    if (!storageValidation.isValidForStorage(data)) return null;

    try {
      return JSON.stringify({
        data,
        timestamp: Date.now(),
        version: '1.0'
      });
    } catch (error) {
      console.error('Storage serialization error:', error);
      return null;
    }
  },

  deserialize: <T>(serialized: string | null): T | null => {
    if (!serialized) return null;

    try {
      const parsed = JSON.parse(serialized);

      if (!parsed || typeof parsed !== 'object' || !parsed.data) {
        return null;
      }

      return parsed.data as T;
    } catch (error) {
      console.error('Storage deserialization error:', error);
      return null;
    }
  },

  withMetadata: (data: any, metadata?: Record<string, any>) => ({
    data,
    metadata: {
      timestamp: Date.now(),
      platform: Platform.OS,
      version: '1.0',
      ...metadata
    }
  }),

  extractData: <T>(stored: any): { data: T; metadata?: any } | null => {
    if (!stored || typeof stored !== 'object') return null;

    if (stored.data) {
      return {
        data: stored.data,
        metadata: stored.metadata
      };
    }

    return {data: stored};
  }
};

export const cacheUtils = {
  isCacheValid: (cachedData: any, ttlMs: number): boolean => {
    if (!cachedData || !cachedData.metadata) return false;

    const age = Date.now() - cachedData.metadata.timestamp;
    return age < ttlMs;
  },

  // Gerar chave de cache
  generateCacheKey: (prefix: string, params: Record<string, any>): string => {
    const paramString = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');

    return `${prefix}_${btoa(paramString).replace(/[^a-zA-Z0-9]/g, '')}`;
  },

  // Limpar cache expirado
  cleanExpiredCache: async (
    getItem: (key: string) => Promise<string | null>,
    removeItem: (key: string) => Promise<void>,
    getAllKeys: () => Promise<string[]>
  ): Promise<number> => {
    try {
      const allKeys = await getAllKeys();
      const cacheKeys = allKeys.filter(key => key.startsWith('cache_'));
      let removedCount = 0;

      for (const key of cacheKeys) {
        try {
          const item = await getItem(key);
          const data = storageUtils.deserialize(item);

          if (!data || !cacheUtils.isCacheValid(data, 0)) {
            await removeItem(key);
            removedCount++;
          }
        } catch {
          // Remove item corrompido
          await removeItem(key);
          removedCount++;
        }
      }

      return removedCount;
    } catch (error) {
      console.error('Cache cleanup error:', error);
      return 0;
    }
  }
};

// ===== MIGRATION UTILITIES =====
export const migrationUtils = {
  // Migrar dados de versões antigas
  migrateStorageData: async (
    getItem: (key: string) => Promise<string | null>,
    setItem: (key: string, value: string) => Promise<void>,
    removeItem: (key: string) => Promise<void>,
    migrationMap: Record<string, string>
  ): Promise<boolean> => {
    try {
      for (const [oldKey, newKey] of Object.entries(migrationMap)) {
        const oldData = await getItem(oldKey);
        if (oldData) {
          const userData = JSON.parse(oldData);

          // Migrar para nova estrutura
          const newData = storageUtils.serialize(userData);
          if (newData) {
            await setItem(newKey, newData);
            await removeItem(oldKey); // Remove dado antigo
          }
        }
      }

      return true;
    } catch (error) {
      console.error('Storage migration error:', error);
      return false;
    }
  },

  // Verificar se precisa de migração
  needsMigration: async (
    getItem: (key: string) => Promise<string | null>,
    oldKeys: string[]
  ): Promise<boolean> => {
    try {
      for (const key of oldKeys) {
        const value = await getItem(key);
        if (value) return true;
      }

      return false;
    } catch {
      return false;
    }
  }
};

// ===== BACKUP & RESTORE =====
export const backupUtils = {
  // Criar backup de dados específicos
  createBackup: async (
    getItem: (key: string) => Promise<string | null>,
    keys: string[]
  ): Promise<Record<string, any> | null> => {
    try {
      const backup: Record<string, any> = {};

      for (const key of keys) {
        const value = await getItem(key);
        if (value) {
          backup[key] = storageUtils.deserialize(value);
        }
      }

      return Object.keys(backup).length > 0 ? {
        data: backup,
        timestamp: Date.now(),
        version: '1.0'
      } : null;
    } catch (error) {
      console.error('Backup creation error:', error);
      return null;
    }
  },

  // Restaurar backup
  restoreBackup: async (
    backup: any,
    setItem: (key: string, value: string) => Promise<void>
  ): Promise<boolean> => {
    try {
      if (!backup || !backup.data) return false;

      for (const [key, value] of Object.entries(backup.data)) {
        const serialized = storageUtils.serialize(value);
        if (serialized) {
          await setItem(key, serialized);
        }
      }

      return true;
    } catch (error) {
      console.error('Backup restore error:', error);
      return false;
    }
  }
};

// ===== SECURITY UTILITIES =====
export const securityUtils = {
  // Gerar device fingerprint
  generateDeviceFingerprint: (): string => {
    const data = {
      platform: Platform.OS,
      version: Platform.Version,
      timestamp: Date.now()
    };

    return btoa(JSON.stringify(data));
  },

  // Verificar integridade dos dados
  verifyDataIntegrity: (data: any, expectedChecksum?: string): boolean => {
    if (!expectedChecksum) return true;

    try {
      const dataString = JSON.stringify(data);
      const checksum = btoa(dataString);
      return checksum === expectedChecksum;
    } catch {
      return false;
    }
  },

  // Gerar checksum dos dados
  generateChecksum: (data: any): string => {
    try {
      const dataString = JSON.stringify(data);
      return btoa(dataString);
    } catch {
      return '';
    }
  },

  // Obfuscar dados sensíveis
  obfuscateSensitiveData: (data: any): any => {
    if (typeof data !== 'object' || data === null) return data;

    const sensitiveFields = ['password', 'token', 'secret', 'key'];
    const obfuscated = {...data};

    Object.keys(obfuscated).forEach(key => {
      const isSensitive = sensitiveFields.some(field =>
        key.toLowerCase().includes(field)
      );

      if (isSensitive) {
        obfuscated[key] = '[REDACTED]';
      }
    });

    return obfuscated;
  }
};

// ===== UNIFIED STORAGE MANAGER =====
export const storageManager = {
  validation: storageValidation,
  utils: storageUtils,
  cache: cacheUtils,
  migration: migrationUtils,
  backup: backupUtils,
  security: securityUtils,

  // Função helper para operações comuns
  safeStore: async (
    key: string,
    data: any,
    setItem: (key: string, value: string) => Promise<void>
  ): Promise<boolean> => {
    if (!storageValidation.isValidKey(key) || !storageValidation.isValidForStorage(data)) {
      return false;
    }

    const serialized = storageUtils.serialize(data);
    if (!serialized) return false;

    try {
      await setItem(key, serialized);
      return true;
    } catch (error) {
      console.error('Safe store error:', error);
      return false;
    }
  },

  safeRetrieve: async <T>(
    key: string,
    getItem: (key: string) => Promise<string | null>
  ): Promise<T | null> => {
    try {
      const item = await getItem(key);
      return storageUtils.deserialize<T>(item);
    } catch (error) {
      console.error('Safe retrieve error:', error);
      return null;
    }
  }
};
