export const COLORS = {
  // Paleta principal - 5 cores da imagem
  DARK: '#1A2D42',      // Azul escuro
  MEDIUM: '#2E4156',    // Azul médio
  LIGHT: '#AAB7B7',     // Cinza azulado
  LIGHTER: '#C0C8CA',   // Cinza claro
  LIGHTEST: '#D4D8DD',  // Cinza muito claro

  // Neutros básicos
  WHITE: '#FFFFFF',
  BLACK: '#000000',

  // Status colors simples
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  ERROR: '#EF4444',
} as const

export type Colors = keyof typeof COLORS
