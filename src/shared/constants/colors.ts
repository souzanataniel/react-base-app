export const COLORS = {
  // === COR PRIMÁRIA ===
  PRIMARY: '#2873FF',

  // === CORES BÁSICAS ===
  WHITE: '#FFFFFF',
  BLACK: '#000000',

  // === SYSTEM COLORS - LIGHT MODE ===
  LABEL: '#000000',
  SECONDARY_LABEL: '#3C3C4399',
  TERTIARY_LABEL: '#3C3C434C',
  QUATERNARY_LABEL: '#3C3C432D',
  PLACEHOLDER_TEXT: '#3C3C434C',
  LINK: '#007AFF',

  // === SYSTEM COLORS - DARK MODE ===
  LABEL_DARK: '#FFFFFF',
  SECONDARY_LABEL_DARK: '#EBEBF599',
  TERTIARY_LABEL_DARK: '#EBEBF54C',
  QUATERNARY_LABEL_DARK: '#EBEBF52D',
  PLACEHOLDER_TEXT_DARK: '#EBEBF54C',
  LINK_DARK: '#0984FF',

  // === SYSTEM BACKGROUNDS ===
  SYSTEM_BACKGROUND: '#FFFFFF',
  SYSTEM_BACKGROUND_DARK: '#000000',
  SECONDARY_SYSTEM_BACKGROUND: '#F2F2F7',
  SECONDARY_SYSTEM_BACKGROUND_DARK: '#1C1C1E',
} as const

export type Colors = keyof typeof COLORS

// === HELPERS PARA USAR NO CÓDIGO ===
export const getColor = (colorName: Colors) => COLORS[colorName]

export const getLabelColor = (
  level: 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'placeholder' = 'primary',
  isDark: boolean = false
) => {
  if (isDark) {
    switch (level) {
      case 'secondary': return COLORS.SECONDARY_LABEL_DARK
      case 'tertiary': return COLORS.TERTIARY_LABEL_DARK
      case 'quaternary': return COLORS.QUATERNARY_LABEL_DARK
      case 'placeholder': return COLORS.PLACEHOLDER_TEXT_DARK
      default: return COLORS.LABEL_DARK
    }
  }

  switch (level) {
    case 'secondary': return COLORS.SECONDARY_LABEL
    case 'tertiary': return COLORS.TERTIARY_LABEL
    case 'quaternary': return COLORS.QUATERNARY_LABEL
    case 'placeholder': return COLORS.PLACEHOLDER_TEXT
    default: return COLORS.LABEL
  }
}

export const getBackgroundColor = (
  type: 'primary' | 'secondary' = 'primary',
  isDark: boolean = false
) => {
  if (isDark) {
    return type === 'secondary'
      ? COLORS.SECONDARY_SYSTEM_BACKGROUND_DARK
      : COLORS.SYSTEM_BACKGROUND_DARK
  }

  return type === 'secondary'
    ? COLORS.SECONDARY_SYSTEM_BACKGROUND
    : COLORS.SYSTEM_BACKGROUND
}

export const getLinkColor = (isDark: boolean = false) => {
  return isDark ? COLORS.LINK_DARK : COLORS.LINK
}

// === MAPEAMENTO PARA MIGRAÇÃO ===
export const LEGACY_COLOR_MAPPING = {
  // Antigo → Novo
  'DARK': 'LABEL',
  'MEDIUM': 'SECONDARY_LABEL',
  'LIGHT': 'TERTIARY_LABEL',
  'LIGHTER': 'QUATERNARY_LABEL',
  'BACKGROUND': 'SECONDARY_SYSTEM_BACKGROUND',
  'PRIMARY': 'PRIMARY',
  'WHITE': 'WHITE',
  'BLACK': 'BLACK',
} as const
