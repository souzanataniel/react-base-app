import {defaultConfig} from '@tamagui/config/v4'
import {createFont, createTamagui, createTokens} from 'tamagui'
import {shorthands} from '@tamagui/shorthands'

const poppinsFont = createFont({
  family: 'Poppins',
  size: {
    1: 11, 2: 12, 3: 13, 4: 14, true: 14, 5: 16, 6: 18, 7: 20,
    8: 23, 9: 30, 10: 46, 11: 55, 12: 62, 13: 72, 14: 92, 15: 114, 16: 134,
  },
  lineHeight: {
    1: 16, 2: 20, 3: 24, 4: 28, true: 28, 5: 32, 6: 36, 7: 40,
    8: 46, 9: 60, 10: 92, 11: 110, 12: 124, 13: 144, 14: 184, 15: 228, 16: 268,
  },
  weight: {
    1: '400',
    4: '400',
    5: '500',
    6: '600',
    7: '700',
  },
  letterSpacing: {
    1: 0, 4: 0, 5: -0.09, 6: -0.05, 7: 0, 8: -0.025, 9: -0.05, 10: -0.1,
  },
})

const customTokens = createTokens({
  ...defaultConfig.tokens,
  color: {
    baseBackground: '#FAFBFC',
    baseBackgroundHover: '#F3F4F6',

    // Cores base
    white: '#FFFFFF',
    black: '#000000',

    // Paleta principal com #2873FF
    primary: '#2873FF',
    primaryHover: '#1E5EE6',
    primaryPress: '#1A52CC',
    primaryLight: '#4A8AFF',
    primaryLighter: '#7BA8FF',
    primaryLightest: '#E6F0FF',

    // Neutros modernos
    dark: '#0F1419',
    darkSecondary: '#1C2128',
    medium: '#364954',
    light: '#6B7280',
    lighter: '#9CA3AF',
    lightest: '#F3F4F6',

    // Status colors harmonizadas
    success: '#059669',
    successLight: '#D1FAE5',
    warning: '#D97706',
    warningLight: '#FEF3C7',
    error: '#DC2626',
    errorLight: '#FEE2E2',
    info: '#2873FF',
    infoLight: '#E6F0FF',

    // === CORES ABSOLUTAS (não mudam com tema) ===
    // Para uso em fundos brancos fixos
    absoluteWhite: '#FFFFFF',
    absoluteBlack: '#000000',

    // Cores que sempre funcionam em fundo branco
    absoluteTextPrimary: '#0F1419',      // Texto principal em fundo branco
    absoluteTextSecondary: '#364954',    // Texto secundário em fundo branco
    absoluteTextTertiary: '#6B7280',     // Texto terciário em fundo branco
    absolutePlaceholder: '#9CA3AF',      // Placeholder em fundo branco

    // Bordas para fundo branco
    absoluteBorderLight: '#E5E7EB',      // Bordas suaves
    absoluteBorderMedium: '#D1D5DB',     // Bordas mais visíveis
    absoluteBorderDark: '#9CA3AF',       // Bordas destacadas

    // Backgrounds para usar sempre
    absoluteBackgroundGray: '#F3F4F6',   // Background cinza claro
    absoluteBackgroundBlue: '#E6F0FF',   // Background azul suave

    // Cores primárias absolutas
    absolutePrimary: '#2873FF',          // Sua cor principal
    absolutePrimaryHover: '#1E5EE6',     // Hover da cor principal
    absolutePrimaryPress: '#1A52CC',     // Press da cor principal
    absolutePrimaryLight: '#4A8AFF',     // Versão clara
    absolutePrimaryLightest: '#E6F0FF',  // Background com sua cor

    // === GRADIENTES ABSOLUTOS (sempre iguais) ===
    // Gradientes com cor primária
    absoluteGradientPrimary: 'linear-gradient(135deg, #2873FF 0%, #4A8AFF 100%)',
    absoluteGradientPrimarySubtle: 'linear-gradient(135deg, #E6F0FF 0%, #F8FAFF 100%)',
    absoluteGradientPrimaryReverse: 'linear-gradient(135deg, #4A8AFF 0%, #2873FF 100%)',

    // Gradientes neutros absolutos
    absoluteGradientLight: 'linear-gradient(135deg, #FAFBFC 0%, #F3F4F6 100%)',
    absoluteGradientMedium: 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)',
    absoluteGradientWhite: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFF 100%)',

    // Gradientes de status absolutos
    absoluteGradientSuccess: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
    absoluteGradientSuccessSubtle: 'linear-gradient(135deg, #D1FAE5 0%, #ECFDF5 100%)',
    absoluteGradientWarning: 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)',
    absoluteGradientWarningSubtle: 'linear-gradient(135deg, #FEF3C7 0%, #FFFBEB 100%)',
    absoluteGradientError: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)',
    absoluteGradientErrorSubtle: 'linear-gradient(135deg, #FEE2E2 0%, #FEF2F2 100%)',

    // Gradientes especiais absolutos
    absoluteGradientHero: 'linear-gradient(135deg, #2873FF 0%, #7BA8FF 50%, #E6F0FF 100%)',
    absoluteGradientCard: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFF 100%)',
    absoluteGradientOverlay: 'linear-gradient(180deg, rgba(40, 115, 255, 0.1) 0%, rgba(40, 115, 255, 0.05) 100%)',
    absoluteGradientShadow: 'linear-gradient(180deg, rgba(15, 20, 25, 0.05) 0%, rgba(15, 20, 25, 0.1) 100%)',
  },
})

export const config = createTamagui({
  ...defaultConfig,
  settings: {
    ...defaultConfig.settings,
    shouldAddPrefersColorThemes: true,
    themeClassNameOnRoot: true,
    defaultProps: {
      disableThemeTransitions: false,
    },
  },
  tokens: customTokens,
  fonts: {
    heading: poppinsFont,
    body: poppinsFont,
    mono: poppinsFont,
  },
  themes: {
    light: {
      // === BACKGROUNDS ===
      background: '#FAFBFC',           // Fundo principal mais suave
      backgroundHover: '#F3F4F6',      // Hover em backgrounds
      backgroundPress: '#E5E7EB',      // Press em backgrounds
      backgroundFocus: '#E6F0FF',      // Focus com cor primária suave
      backgroundStrong: '#FFFFFF',     // Cards, modais, inputs
      backgroundTransparent: 'transparent',

      // === COLORS (texto e ícones) ===
      color: '#0F1419',               // Texto principal (neutro escuro)
      colorHover: '#1C2128',          // Hover em textos
      colorPress: '#364954',          // Press em textos
      colorFocus: '#2873FF',          // Focus com cor primária

      // === BORDERS ===
      borderColor: '#E5E7EB',         // Bordas suaves
      borderColorHover: '#D1D5DB',    // Hover em bordas
      borderColorPress: '#9CA3AF',    // Press em bordas
      borderColorFocus: '#2873FF',    // Focus com cor primária

      // === PLACEHOLDERS ===
      placeholderColor: '#9CA3AF',    // Texto de placeholder

      // === CORES PRIMÁRIAS ===
      primary: '#2873FF',
      primaryHover: '#1E5EE6',
      primaryPress: '#1A52CC',
      primaryLight: '#4A8AFF',
      primaryLighter: '#7BA8FF',
      primaryLightest: '#E6F0FF',

      // === CORES NEUTRAS ATUALIZADAS ===
      dark: '#0F1419',
      darkSecondary: '#1C2128',
      medium: '#364954',
      light: '#6B7280',
      lighter: '#9CA3AF',
      lightest: '#F3F4F6',

      // === CORES BÁSICAS ===
      white: '#FFFFFF',
      black: '#000000',

      // === STATUS COLORS ===
      success: '#059669',
      successLight: '#D1FAE5',
      warning: '#D97706',
      warningLight: '#FEF3C7',
      error: '#DC2626',
      errorLight: '#FEE2E2',
      info: '#2873FF',
      infoLight: '#E6F0FF',

      // === GRADIENTES LIGHT MODE (mudam com tema) ===
      gradientPrimary: 'linear-gradient(135deg, #2873FF 0%, #4A8AFF 100%)',
      gradientPrimarySubtle: 'linear-gradient(135deg, #E6F0FF 0%, #F8FAFF 100%)',
      gradientPrimaryReverse: 'linear-gradient(135deg, #4A8AFF 0%, #2873FF 100%)',

      gradientLight: 'linear-gradient(135deg, #FAFBFC 0%, #F3F4F6 100%)',
      gradientMedium: 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)',
      gradientDark: 'linear-gradient(135deg, #364954 0%, #0F1419 100%)',

      gradientSuccess: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
      gradientSuccessSubtle: 'linear-gradient(135deg, #D1FAE5 0%, #ECFDF5 100%)',
      gradientWarning: 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)',
      gradientWarningSubtle: 'linear-gradient(135deg, #FEF3C7 0%, #FFFBEB 100%)',
      gradientError: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)',
      gradientErrorSubtle: 'linear-gradient(135deg, #FEE2E2 0%, #FEF2F2 100%)',

      gradientHero: 'linear-gradient(135deg, #2873FF 0%, #7BA8FF 50%, #E6F0FF 100%)',
      gradientCard: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFF 100%)',
      gradientOverlay: 'linear-gradient(180deg, rgba(40, 115, 255, 0.1) 0%, rgba(40, 115, 255, 0.05) 100%)',
      gradientShadow: 'linear-gradient(180deg, rgba(15, 20, 25, 0.05) 0%, rgba(15, 20, 25, 0.1) 100%)',

      // === SHADOWS ===
      shadowColor: 'rgba(15, 20, 25, 0.1)',
      shadowColorHover: 'rgba(15, 20, 25, 0.15)',
      shadowColorPress: 'rgba(40, 115, 255, 0.2)',
      shadowColorFocus: 'rgba(40, 115, 255, 0.25)',
    },

    dark: {
      // === BACKGROUNDS ===
      background: '#0F1419',           // Fundo principal escuro
      backgroundHover: '#1C2128',      // Hover mais claro
      backgroundPress: '#21262D',      // Press ainda mais claro
      backgroundFocus: '#1A2B4D',      // Focus com tom da cor primária
      backgroundStrong: '#161B22',     // Cards, modais (ligeiramente mais claro)
      backgroundTransparent: 'transparent',

      // === COLORS (texto e ícones) ===
      color: '#F0F6FC',               // Texto principal claro
      colorHover: '#FFFFFF',          // Hover em textos
      colorPress: '#C9D1D9',          // Press em textos
      colorFocus: '#7BA8FF',          // Focus com cor primária clara

      // === BORDERS ===
      borderColor: '#21262D',         // Bordas escuras
      borderColorHover: '#30363D',    // Hover em bordas
      borderColorPress: '#484F58',    // Press em bordas
      borderColorFocus: '#4A8AFF',    // Focus com cor primária

      // === PLACEHOLDERS ===
      placeholderColor: '#7D8590',    // Placeholder visível no escuro

      // === CORES PRIMÁRIAS (adaptadas para dark) ===
      primary: '#4A8AFF',             // Primária mais clara no dark
      primaryHover: '#7BA8FF',        // Hover ainda mais claro
      primaryPress: '#2873FF',        // Press volta à original
      primaryLight: '#7BA8FF',
      primaryLighter: '#A6C1FF',
      primaryLightest: '#1A2B4D',     // Background escuro com tom azul

      // === CORES NEUTRAS (invertidas para dark) ===
      dark: '#F0F6FC',               // Texto claro
      darkSecondary: '#C9D1D9',      // Texto secundário
      medium: '#8B949E',             // Cinza médio
      light: '#6E7681',              // Cinza escuro
      lighter: '#484F58',            // Mais escuro
      lightest: '#21262D',           // Background de seções

      // === CORES BÁSICAS ===
      white: '#FFFFFF',
      black: '#000000',

      // === STATUS COLORS (versões dark-friendly) ===
      success: '#3FB950',
      successLight: '#0D4B26',
      warning: '#F79009',
      warningLight: '#4A2C0A',
      error: '#F85149',
      errorLight: '#4C1518',
      info: '#4A8AFF',
      infoLight: '#1A2B4D',

      // === GRADIENTES DARK MODE (mudam com tema) ===
      gradientPrimary: 'linear-gradient(135deg, #4A8AFF 0%, #7BA8FF 100%)',
      gradientPrimarySubtle: 'linear-gradient(135deg, #1A2B4D 0%, #0F1A33 100%)',
      gradientPrimaryReverse: 'linear-gradient(135deg, #7BA8FF 0%, #4A8AFF 100%)',

      gradientLight: 'linear-gradient(135deg, #21262D 0%, #161B22 100%)',
      gradientMedium: 'linear-gradient(135deg, #161B22 0%, #0D1117 100%)',
      gradientDark: 'linear-gradient(135deg, #0F1419 0%, #0D1117 100%)',

      gradientSuccess: 'linear-gradient(135deg, #3FB950 0%, #2EA043 100%)',
      gradientSuccessSubtle: 'linear-gradient(135deg, #0D4B26 0%, #033A1A 100%)',
      gradientWarning: 'linear-gradient(135deg, #F79009 0%, #E67C00 100%)',
      gradientWarningSubtle: 'linear-gradient(135deg, #4A2C0A 0%, #3D2308 100%)',
      gradientError: 'linear-gradient(135deg, #F85149 0%, #E5484D 100%)',
      gradientErrorSubtle: 'linear-gradient(135deg, #4C1518 0%, #3E1011 100%)',

      gradientHero: 'linear-gradient(135deg, #1A2B4D 0%, #4A8AFF 50%, #7BA8FF 100%)',
      gradientCard: 'linear-gradient(135deg, #161B22 0%, #1A2B4D 100%)',
      gradientOverlay: 'linear-gradient(180deg, rgba(74, 138, 255, 0.15) 0%, rgba(74, 138, 255, 0.05) 100%)',
      gradientShadow: 'linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.4) 100%)',

      // === SHADOWS ===
      shadowColor: 'rgba(0, 0, 0, 0.3)',
      shadowColorHover: 'rgba(0, 0, 0, 0.4)',
      shadowColorPress: 'rgba(74, 138, 255, 0.2)',
      shadowColorFocus: 'rgba(74, 138, 255, 0.3)',
    }
  },
  shorthands,
})
