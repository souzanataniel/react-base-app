import type {AuthTokens, TokenPayload} from '../types';

// ===== TOKEN PARSING =====
export const tokenUtils = {
  // Decodificar JWT (sem verificação - apenas parsing)
  parseJWT: (token: string): TokenPayload | null => {
    try {
      const base64Url = token.split('.')[1];
      if (!base64Url) return null;

      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing JWT:', error);
      return null;
    }
  },

  // Verificar se token está expirado
  isTokenExpired: (token: string): boolean => {
    const payload = tokenUtils.parseJWT(token);
    if (!payload || !payload.exp) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  },

  // Obter tempo restante do token em segundos
  getTokenTimeRemaining: (token: string): number => {
    const payload = tokenUtils.parseJWT(token);
    if (!payload || !payload.exp) return 0;

    const currentTime = Math.floor(Date.now() / 1000);
    const remaining = payload.exp - currentTime;
    return Math.max(0, remaining);
  },

  // Verificar se token expira em X segundos
  willExpireIn: (token: string, seconds: number): boolean => {
    const timeRemaining = tokenUtils.getTokenTimeRemaining(token);
    return timeRemaining <= seconds && timeRemaining > 0;
  },

  // Obter informações do usuário do token
  getUserFromToken: (token: string): { id: string; email: string } | null => {
    const payload = tokenUtils.parseJWT(token);
    if (!payload) return null;

    return {
      id: payload.sub,
      email: payload.email
    };
  },

  // Validar formato básico do JWT
  isValidJWTFormat: (token: string): boolean => {
    if (!token || typeof token !== 'string') return false;

    const parts = token.split('.');
    return parts.length === 3 && parts.every(part => part.length > 0);
  }
};

// ===== TOKEN STORAGE HELPERS =====
export const tokenStorageUtils = {
  // Gerar chave única para storage
  generateStorageKey: (userId: string, tokenType: 'access' | 'refresh'): string => {
    return `auth_${tokenType}_${userId}`;
  },

  // Validar se tokens são válidos para storage
  validateTokensForStorage: (tokens: AuthTokens): boolean => {
    return !!(
      tokens.accessToken &&
      tokens.refreshToken &&
      tokens.expiresIn &&
      tokenUtils.isValidJWTFormat(tokens.accessToken) &&
      tokenUtils.isValidJWTFormat(tokens.refreshToken)
    );
  },

  // Preparar tokens para storage (limpar dados sensíveis)
  sanitizeTokensForStorage: (tokens: AuthTokens): AuthTokens => {
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.expiresIn,
      tokenType: tokens.tokenType || 'Bearer'
    };
  },

  // Calcular tempo de expiração absoluto
  calculateAbsoluteExpiry: (expiresIn: number): number => {
    return Date.now() + (expiresIn * 1000);
  }
};

// ===== TOKEN REFRESH HELPERS =====
export const tokenRefreshUtils = {
  // Verificar se deve fazer refresh preventivo
  shouldRefreshToken: (token: string, bufferSeconds: number = 300): boolean => {
    return tokenUtils.willExpireIn(token, bufferSeconds);
  },

  // Calcular próximo refresh time
  getNextRefreshTime: (token: string, bufferSeconds: number = 300): number => {
    const timeRemaining = tokenUtils.getTokenTimeRemaining(token);
    const refreshIn = Math.max(0, timeRemaining - bufferSeconds);
    return Date.now() + (refreshIn * 1000);
  },

  // Verificar se refresh token ainda é válido
  isRefreshTokenValid: (refreshToken: string): boolean => {
    if (!tokenUtils.isValidJWTFormat(refreshToken)) return false;
    return !tokenUtils.isTokenExpired(refreshToken);
  },

  // Calcular backoff para retry de refresh
  calculateRefreshBackoff: (attempt: number): number => {
    // Exponential backoff: 1s, 2s, 4s, 8s, max 30s
    return Math.min(1000 * Math.pow(2, attempt), 30000);
  }
};

// ===== TOKEN SECURITY HELPERS =====
export const tokenSecurityUtils = {
  // Verificar integridade básica do token
  validateTokenIntegrity: (token: string): boolean => {
    if (!tokenUtils.isValidJWTFormat(token)) return false;

    const payload = tokenUtils.parseJWT(token);
    if (!payload) return false;

    // Verificações básicas de segurança
    const requiredFields = ['sub', 'exp', 'iat'];
    return requiredFields.every(field => payload[field]);
  },

  // Verificar se token não é muito antigo
  isTokenFresh: (token: string, maxAgeHours: number = 24): boolean => {
    const payload = tokenUtils.parseJWT(token);
    if (!payload || !payload.iat) return false;

    const tokenAge = Date.now() / 1000 - payload.iat;
    const maxAge = maxAgeHours * 60 * 60; // Converter para segundos

    return tokenAge <= maxAge;
  },

  // Gerar fingerprint do token (para detecção de mudanças)
  generateTokenFingerprint: (token: string): string => {
    const payload = tokenUtils.parseJWT(token);
    if (!payload) return '';

    const fingerprintData = {
      sub: payload.sub,
      iat: payload.iat,
      exp: payload.exp
    };

    return btoa(JSON.stringify(fingerprintData));
  },

  // Verificar se token foi modificado
  hasTokenChanged: (token: string, lastFingerprint: string): boolean => {
    const currentFingerprint = tokenSecurityUtils.generateTokenFingerprint(token);
    return currentFingerprint !== lastFingerprint;
  }
};

// ===== TOKEN DEBUGGING HELPERS =====
export const tokenDebugUtils = {
  // Log informações do token (apenas em desenvolvimento)
  logTokenInfo: (token: string, label: string = 'Token'): void => {
    if (process.env.NODE_ENV !== 'development') return;

    const payload = tokenUtils.parseJWT(token);
    if (!payload) {
      console.warn(`${label}: Invalid token format`);
      return;
    }

    const timeRemaining = tokenUtils.getTokenTimeRemaining(token);
    const isExpired = tokenUtils.isTokenExpired(token);

    console.log(`${label} Info:`, {
      userId: payload.sub,
      email: payload.email,
      issuedAt: new Date(payload.iat * 1000).toISOString(),
      expiresAt: new Date(payload.exp * 1000).toISOString(),
      timeRemaining: `${Math.floor(timeRemaining / 60)}m ${timeRemaining % 60}s`,
      isExpired,
      willExpireIn5Min: tokenUtils.willExpireIn(token, 300)
    });
  },

  // Validar estado completo dos tokens
  validateTokenState: (tokens: AuthTokens): {
    isValid: boolean;
    issues: string[];
    warnings: string[];
  } => {
    const issues: string[] = [];
    const warnings: string[] = [];

    // Verificar formato
    if (!tokenUtils.isValidJWTFormat(tokens.accessToken)) {
      issues.push('Access token format invalid');
    }

    if (!tokenUtils.isValidJWTFormat(tokens.refreshToken)) {
      issues.push('Refresh token format invalid');
    }

    // Verificar expiração
    if (tokenUtils.isTokenExpired(tokens.accessToken)) {
      issues.push('Access token expired');
    }

    if (tokenUtils.isTokenExpired(tokens.refreshToken)) {
      issues.push('Refresh token expired');
    }

    // Verificar warnings
    if (tokenUtils.willExpireIn(tokens.accessToken, 300)) {
      warnings.push('Access token expires in < 5 minutes');
    }

    if (tokenUtils.willExpireIn(tokens.refreshToken, 86400)) {
      warnings.push('Refresh token expires in < 24 hours');
    }

    return {
      isValid: issues.length === 0,
      issues,
      warnings
    };
  }
};

// ===== UNIFIED TOKEN MANAGER =====
export const tokenManager = {
  // Todas as funções principais em um objeto
  parse: tokenUtils.parseJWT,
  isExpired: tokenUtils.isTokenExpired,
  timeRemaining: tokenUtils.getTokenTimeRemaining,
  willExpireIn: tokenUtils.willExpireIn,
  shouldRefresh: tokenRefreshUtils.shouldRefreshToken,
  isValid: tokenSecurityUtils.validateTokenIntegrity,
  debug: tokenDebugUtils.logTokenInfo,
  validate: tokenDebugUtils.validateTokenState,

  // Função helper para uso comum
  getAuthStatus: (tokens: AuthTokens | null) => {
    if (!tokens) {
      return {isAuthenticated: false, needsRefresh: false, error: 'No tokens'};
    }

    const validation = tokenDebugUtils.validateTokenState(tokens);

    if (!validation.isValid) {
      return {
        isAuthenticated: false,
        needsRefresh: false,
        error: validation.issues.join(', ')
      };
    }

    const needsRefresh = tokenRefreshUtils.shouldRefreshToken(tokens.accessToken);

    return {
      isAuthenticated: true,
      needsRefresh,
      warnings: validation.warnings
    };
  }
};
