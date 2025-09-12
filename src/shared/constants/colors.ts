export const COLORS = {
  // === PALETA PRINCIPAL (baseada em #2873FF) ===
  PRIMARY: '#2873FF',
  PRIMARY_HOVER: '#1E5EE6',
  PRIMARY_PRESS: '#1A52CC',
  PRIMARY_LIGHT: '#4A8AFF',
  PRIMARY_LIGHTER: '#7BA8FF',
  PRIMARY_LIGHTEST: '#E6F0FF',

  // === NEUTROS MODERNOS ===
  DARK: '#0F1419',              // Substitui o antigo #1A2D42
  DARK_SECONDARY: '#1C2128',    // Substitui o antigo #2E4156
  MEDIUM: '#364954',            // Novo tom intermediário
  LIGHT: '#6B7280',             // Substitui o antigo #AAB7B7
  LIGHTER: '#9CA3AF',           // Substitui o antigo #C0C8CA
  LIGHTEST: '#F3F4F6',          // Substitui o antigo #D4D8DD

  // === BACKGROUNDS ===
  BACKGROUND: '#FAFBFC',        // Substitui o antigo #F8F8F8
  BACKGROUND_HOVER: '#F3F4F6',
  BACKGROUND_GRAY: '#F3F4F6',
  BACKGROUND_BLUE: '#E6F0FF',

  // === NEUTROS BÁSICOS ===
  WHITE: '#FFFFFF',
  BLACK: '#000000',

  // === STATUS COLORS HARMONIZADAS ===
  SUCCESS: '#059669',           // Atualizado de #10B981
  SUCCESS_LIGHT: '#D1FAE5',
  WARNING: '#D97706',           // Atualizado de #F59E0B
  WARNING_LIGHT: '#FEF3C7',
  ERROR: '#DC2626',             // Atualizado de #EF4444
  ERROR_LIGHT: '#FEE2E2',
  INFO: '#2873FF',              // Usa a cor primária
  INFO_LIGHT: '#E6F0FF',

  // === CORES ABSOLUTAS (para fundos brancos fixos) ===
  ABSOLUTE_WHITE: '#FFFFFF',
  ABSOLUTE_BLACK: '#000000',
  ABSOLUTE_TEXT_PRIMARY: '#0F1419',
  ABSOLUTE_TEXT_SECONDARY: '#364954',
  ABSOLUTE_TEXT_TERTIARY: '#6B7280',
  ABSOLUTE_PLACEHOLDER: '#9CA3AF',
  ABSOLUTE_BORDER_LIGHT: '#E5E7EB',
  ABSOLUTE_BORDER_MEDIUM: '#D1D5DB',
  ABSOLUTE_BORDER_DARK: '#9CA3AF',
  ABSOLUTE_PRIMARY: '#2873FF',
  ABSOLUTE_PRIMARY_HOVER: '#1E5EE6',
  ABSOLUTE_PRIMARY_PRESS: '#1A52CC',

  // === GRADIENTES ABSOLUTOS ===
  ABSOLUTE_GRADIENT_PRIMARY: 'linear-gradient(135deg, #2873FF 0%, #4A8AFF 100%)',
  ABSOLUTE_GRADIENT_PRIMARY_SUBTLE: 'linear-gradient(135deg, #E6F0FF 0%, #F8FAFF 100%)',
  ABSOLUTE_GRADIENT_CARD: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFF 100%)',
  ABSOLUTE_GRADIENT_HERO: 'linear-gradient(135deg, #2873FF 0%, #7BA8FF 50%, #E6F0FF 100%)',
  ABSOLUTE_GRADIENT_SUCCESS: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
  ABSOLUTE_GRADIENT_WARNING: 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)',
  ABSOLUTE_GRADIENT_ERROR: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)',

  // === GRADIENTES LIGHT MODE ===
  GRADIENT_PRIMARY: 'linear-gradient(135deg, #2873FF 0%, #4A8AFF 100%)',
  GRADIENT_PRIMARY_SUBTLE: 'linear-gradient(135deg, #E6F0FF 0%, #F8FAFF 100%)',
  GRADIENT_LIGHT: 'linear-gradient(135deg, #FAFBFC 0%, #F3F4F6 100%)',
  GRADIENT_MEDIUM: 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)',
  GRADIENT_CARD: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFF 100%)',
  GRADIENT_HERO: 'linear-gradient(135deg, #2873FF 0%, #7BA8FF 50%, #E6F0FF 100%)',
  GRADIENT_SUCCESS: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
  GRADIENT_WARNING: 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)',
  GRADIENT_ERROR: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)',
  GRADIENT_OVERLAY: 'linear-gradient(180deg, rgba(40, 115, 255, 0.1) 0%, rgba(40, 115, 255, 0.05) 100%)',
  GRADIENT_SHADOW: 'linear-gradient(180deg, rgba(15, 20, 25, 0.05) 0%, rgba(15, 20, 25, 0.1) 100%)',

  // === GRADIENTES DARK MODE ===
  GRADIENT_PRIMARY_DARK: 'linear-gradient(135deg, #4A8AFF 0%, #7BA8FF 100%)',
  GRADIENT_PRIMARY_SUBTLE_DARK: 'linear-gradient(135deg, #1A2B4D 0%, #0F1A33 100%)',
  GRADIENT_LIGHT_DARK: 'linear-gradient(135deg, #21262D 0%, #161B22 100%)',
  GRADIENT_MEDIUM_DARK: 'linear-gradient(135deg, #161B22 0%, #0D1117 100%)',
  GRADIENT_CARD_DARK: 'linear-gradient(135deg, #161B22 0%, #1A2B4D 100%)',
  GRADIENT_HERO_DARK: 'linear-gradient(135deg, #1A2B4D 0%, #4A8AFF 50%, #7BA8FF 100%)',
  GRADIENT_SUCCESS_DARK: 'linear-gradient(135deg, #3FB950 0%, #2EA043 100%)',
  GRADIENT_WARNING_DARK: 'linear-gradient(135deg, #F79009 0%, #E67C00 100%)',
  GRADIENT_ERROR_DARK: 'linear-gradient(135deg, #F85149 0%, #E5484D 100%)',
  GRADIENT_OVERLAY_DARK: 'linear-gradient(180deg, rgba(74, 138, 255, 0.15) 0%, rgba(74, 138, 255, 0.05) 100%)',
  GRADIENT_SHADOW_DARK: 'linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.4) 100%)',
} as const

export type Colors = keyof typeof COLORS

// === MAPEAMENTO DOS TOKENS ANTIGOS PARA NOVOS ===
export const COLOR_MAPPING = {
  // Antigo → Novo
  DARK: 'DARK',                    // #1A2D42 → #0F1419
  MEDIUM: 'DARK_SECONDARY',        // #2E4156 → #1C2128
  LIGHT: 'LIGHT',                  // #AAB7B7 → #6B7280
  LIGHTER: 'LIGHTER',              // #C0C8CA → #9CA3AF
  LIGHTEST: 'LIGHTEST',            // #D4D8DD → #F3F4F6
  BACKGROUND: 'BACKGROUND',        // #F8F8F8 → #FAFBFC
  SUCCESS: 'SUCCESS',              // #10B981 → #059669
  WARNING: 'WARNING',              // #F59E0B → #D97706
  ERROR: 'ERROR',                  // #EF4444 → #DC2626
} as const

// === HELPERS PARA USAR NO CÓDIGO ===
export const getColor = (colorName: Colors) => COLORS[colorName]

export const getPrimaryVariant = (variant: 'default' | 'hover' | 'press' | 'light' | 'lighter' | 'lightest' = 'default') => {
  switch (variant) {
    case 'hover': return COLORS.PRIMARY_HOVER
    case 'press': return COLORS.PRIMARY_PRESS
    case 'light': return COLORS.PRIMARY_LIGHT
    case 'lighter': return COLORS.PRIMARY_LIGHTER
    case 'lightest': return COLORS.PRIMARY_LIGHTEST
    default: return COLORS.PRIMARY
  }
}

export const getStatusColor = (status: 'success' | 'warning' | 'error' | 'info', variant: 'default' | 'light' = 'default') => {
  if (variant === 'light') {
    switch (status) {
      case 'success': return COLORS.SUCCESS_LIGHT
      case 'warning': return COLORS.WARNING_LIGHT
      case 'error': return COLORS.ERROR_LIGHT
      case 'info': return COLORS.INFO_LIGHT
    }
  }

  switch (status) {
    case 'success': return COLORS.SUCCESS
    case 'warning': return COLORS.WARNING
    case 'error': return COLORS.ERROR
    case 'info': return COLORS.INFO
  }
}

export const getAbsoluteColor = (colorName: string) => {
  const absoluteKey = `ABSOLUTE_${colorName.toUpperCase()}` as keyof typeof COLORS
  return COLORS[absoluteKey] || COLORS[colorName as keyof typeof COLORS]
}
