// gradients.ts
export const gradients = {
  // === GRADIENTES PRIMÁRIOS ===
  primary: ['#2873FF', '#4A8AFF'] as const,
  primarySubtle: ['#E6F0FF', '#F8FAFF'] as const,
  primaryReverse: ['#4A8AFF', '#2873FF'] as const,
  primaryDeep: ['#1A52CC', '#2873FF'] as const,
  primaryNeon: ['#2873FF', '#00D4FF'] as const,

  // === GRADIENTES ESCUROS SOFISTICADOS ===
  // Inspirado em GitHub Dark, Vercel, Linear
  midnight: ['#0D1117', '#161B22'] as const,
  charcoal: ['#1C2128', '#21262D'] as const,
  obsidian: ['#0F1419', '#1A1F2E'] as const,
  slate: ['#1E293B', '#334155'] as const,
  graphite: ['#111827', '#1F2937'] as const,

  // Escuros com tons azulados (muito em alta)
  darkBlue: ['#0F172A', '#1E293B'] as const,
  midnightBlue: ['#0C1426', '#1A2B4D'] as const,
  deepNavy: ['#0A0E27', '#1A1F3A'] as const,
  cosmicBlue: ['#0D1421', '#1A2B47'] as const,

  // Escuros com tons violeta/roxo (tendência 2024/2025)
  darkPurple: ['#1A0B2E', '#2D1B4E'] as const,
  cosmic: ['#0F0A1E', '#1E1B3A'] as const,
  nebula: ['#1A1228', '#2A1F4B'] as const,
  amethyst: ['#1C0F2A', '#2E1A47'] as const,

  // Escuros com tons verdes (tech/fintech)
  forestDark: ['#0F1B0F', '#1A2E1A'] as const,
  emeraldDark: ['#0A1A0A', '#1A2F1A'] as const,
  matrixDark: ['#0D1B0D', '#1A331A'] as const,

  // === GRADIENTES NEUTROS REFINADOS ===
  light: ['#FAFBFC', '#F3F4F6'] as const,
  medium: ['#F3F4F6', '#E5E7EB'] as const,
  white: ['#FFFFFF', '#F8FAFF'] as const,
  dark: ['#0F1419', '#1C2128'] as const,
  darkMedium: ['#1C2128', '#21262D'] as const,

  // === VARIAÇÕES DE BRANCO E CINZA ===
  // Brancos puros e off-whites
  pureWhite: ['#FFFFFF', '#FFFFFF'] as const,
  snowWhite: ['#FFFFFE', '#FEFEFE'] as const,
  paperWhite: ['#FDFDFD', '#FBFBFB'] as const,
  creamWhite: ['#FEFEFE', '#FCFCFC'] as const,
  milkWhite: ['#FEFCFC', '#FCF9F9'] as const,

  // Off-whites com tons sutis
  warmWhite: ['#FFFEF9', '#FEFDF8'] as const,
  coolWhite: ['#FEFEFF', '#FCFDFE'] as const,
  blueWhite: ['#FEFEFF', '#F8FAFF'] as const,
  grayWhite: ['#FEFEFE', '#F9FAFB'] as const,

  // Cinzas ultra-claros
  fog: ['#F9FAFB', '#F3F4F6'] as const,
  mist: ['#F8F9FA', '#F1F3F4'] as const,
  cloud: ['#F7F8F9', '#F0F1F2'] as const,
  pearl: ['#F6F7F8', '#EDEEF0'] as const,
  silk: ['#F5F6F7', '#EAEBEC'] as const,

  // Cinzas claros
  ash: ['#F4F5F6', '#E8E9EA'] as const,
  smoke: ['#F2F3F4', '#E5E6E7'] as const,
  dust: ['#F1F2F3', '#E3E4E5'] as const,
  stone: ['#F0F1F2', '#E1E2E3'] as const,
  cement: ['#EFEEF0', '#DFDEE0'] as const,

  // Cinzas médios-claros
  silver: ['#EEEEEF', '#DCDCDD'] as const,
  platinum: ['#EDEDEE', '#DADADB'] as const,
  aluminum: ['#ECECED', '#D8D8D9'] as const,
  steel: ['#EBECED', '#D6D6D7'] as const,

  // Cinzas com tons azulados (muito em alta)
  blueGray: ['#F8F9FB', '#F1F3F6'] as const,
  slateLight: ['#F7F8FA', '#F0F2F5'] as const,
  coolGray: ['#F6F7F9', '#EEF0F3'] as const,
  neutralBlue: ['#F5F6F8', '#ECEFF2'] as const,

  // Cinzas com tons quentes
  warmGray: ['#FAF9F8', '#F3F2F1'] as const,
  beige: ['#F9F8F7', '#F2F1F0'] as const,
  sand: ['#F8F7F6', '#F1F0EF'] as const,
  cream: ['#F7F6F5', '#F0EFEE'] as const,

  // === CORES DE FUNDO QUE COMBINAM COM BRANCO ===
  // Azuis suaves (perfeitos com branco)
  skyBlue: ['#F0F8FF', '#E6F3FF'] as const,
  babyBlue: ['#F5F9FF', '#EBF4FF'] as const,
  iceBlue: ['#F8FBFF', '#F0F6FF'] as const,
  powderBlue: ['#F6FAFF', '#ECF2FF'] as const,
  crystalBlue: ['#F9FCFF', '#F2F7FF'] as const,

  // Verdes suaves
  mintGreen: ['#F7FFFC', '#F0FFF8'] as const,
  seafoam: ['#F6FFFE', '#EFFFFC'] as const,
  sage: ['#F8FFF9', '#F2FFF4'] as const,
  eucalyptus: ['#F7FFFB', '#F1FFF6'] as const,

  // Rosas/corais suaves
  blush: ['#FFFBFC', '#FFF6F8'] as const,
  rosePetal: ['#FFFAFC', '#FFF4F7'] as const,
  peach: ['#FFFCFA', '#FFF7F3'] as const,
  coral: ['#FFFBF9', '#FFF5F1'] as const,

  // Lavendas/violetas suaves
  lavender: ['#FCFAFF', '#F8F4FF'] as const,
  lilac: ['#FDFBFF', '#FAF6FF'] as const,
  violet: ['#FEFCFF', '#FBF8FF'] as const,
  orchid: ['#FEFAFF', '#FCF5FF'] as const,

  // Amarelos/dourados suaves
  vanilla: ['#FFFEF9', '#FFFCF0'] as const,
  ivory: ['#FFFFFE', '#FFFEF8'] as const,
  champagne: ['#FFFEF7', '#FFFBF0'] as const,
  butter: ['#FFFDF6', '#FFF9ED'] as const,

  // Backgrounds neutros premium
  linen: ['#FFFEF7', '#FEFCF3'] as const,
  cotton: ['#FFFFFE', '#FEFEFC'] as const,
  porcelain: ['#FFFFFE', '#FCFCFC'] as const,
  marble: ['#FEFEFE', '#FBFBFB'] as const,

  // === GRADIENTES DE STATUS MODERNOS ===
  success: ['#059669', '#10B981'] as const,
  successSubtle: ['#D1FAE5', '#ECFDF5'] as const,
  successDark: ['#065F46', '#047857'] as const,

  warning: ['#D97706', '#F59E0B'] as const,
  warningSubtle: ['#FEF3C7', '#FFFBEB'] as const,
  warningDark: ['#92400E', '#B45309'] as const,

  error: ['#DC2626', '#EF4444'] as const,
  errorSubtle: ['#FEE2E2', '#FEF2F2'] as const,
  errorDark: ['#991B1B', '#B91C1C'] as const,

  // === GRADIENTES ESPECIAIS SOFISTICADOS ===
  // Hero sections modernas
  hero: ['#2873FF', '#7BA8FF', '#E6F0FF'] as const,
  heroDark: ['#0F1419', '#1A2B4D', '#2873FF'] as const,
  heroCosmetic: ['#1A0B2E', '#2D1B4E', '#4A8AFF'] as const,

  // Cards e containers
  card: ['#FFFFFF', '#F8FAFF'] as const,
  cardDark: ['#161B22', '#1A2B4D'] as const,
  cardElegant: ['#0F1419', '#1C2A3A'] as const,
  cardPremium: ['#0D1117', '#1A1F2E', '#21262D'] as const,

  // Glassmorphism (muito em alta)
  glass: ['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.1)'] as const,
  glassDark: ['rgba(30, 41, 59, 0.4)', 'rgba(15, 20, 25, 0.6)'] as const,
  glassBlue: ['rgba(40, 115, 255, 0.2)', 'rgba(40, 115, 255, 0.05)'] as const,

  // Overlays sofisticados
  overlay: ['rgba(40, 115, 255, 0.1)', 'rgba(40, 115, 255, 0.05)'] as const,
  overlayDark: ['rgba(15, 20, 25, 0.8)', 'rgba(15, 20, 25, 0.4)'] as const,
  overlayBlur: ['rgba(15, 20, 25, 0.6)', 'rgba(30, 41, 59, 0.3)'] as const,

  // Shadows modernas
  shadow: ['rgba(15, 20, 25, 0.05)', 'rgba(15, 20, 25, 0.1)'] as const,
  shadowDark: ['rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.6)'] as const,
  shadowBlue: ['rgba(40, 115, 255, 0.2)', 'rgba(40, 115, 255, 0.05)'] as const,

  // === GRADIENTES TRENDING 2024/2025 ===
  // Inspirados em brands como Linear, Vercel, Stripe
  aurora: ['#1A0B2E', '#2D1B4E', '#4A8AFF'] as const,
  twilight: ['#0F172A', '#1E293B', '#2873FF'] as const,
  phantom: ['#0D1117', '#1A1F2E', '#2A1F3A'] as const,
  void: ['#000000', '#0F1419', '#1C2128'] as const,

  // Gradientes com múltiplas paradas (3+ cores)
  spectrum: ['#1A0B2E', '#0F1419', '#1A2B4D', '#2873FF'] as const,
  galaxy: ['#0A0E27', '#1A1F3A', '#2A1F4B', '#4A8AFF'] as const,
  dimension: ['#0D1117', '#1A1F2E', '#2D1B4E', '#4A8AFF'] as const,

  // === GRADIENTES PREMIUM (para features pagas, etc) ===
  gold: ['#F59E0B', '#FBBF24', '#FCD34D'] as const,
  goldDark: ['#92400E', '#B45309', '#D97706'] as const,
  diamond: ['#E5E7EB', '#F3F4F6', '#FFFFFF'] as const,
} as const
