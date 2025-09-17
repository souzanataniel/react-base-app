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
    baseBackground: '#F3F4F6',
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

    // CORES ABSOLUTAS (não mudam com tema)
    absoluteWhite: '#FFFFFF',
    absoluteBlack: '#000000',
    absoluteTextPrimary: '#0F1419',
    absoluteTextSecondary: '#364954',
    absoluteTextTertiary: '#6B7280',
    absolutePlaceholder: '#9CA3AF',
    absoluteBorderLight: '#E5E7EB',
    absoluteBorderMedium: '#D1D5DB',
    absoluteBorderDark: '#9CA3AF',
    absoluteBackgroundGray: '#F3F4F6',
    absoluteBackgroundBlue: '#E6F0FF',
    absolutePrimary: '#2873FF',
    absolutePrimaryHover: '#1E5EE6',
    absolutePrimaryPress: '#1A52CC',
    absolutePrimaryLight: '#4A8AFF',
    absolutePrimaryLightest: '#E6F0FF',
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
      // BACKGROUNDS
      background: '#F3F4F6',
      backgroundHover: '#F3F4F6',
      backgroundPress: '#E5E7EB',
      backgroundFocus: '#E6F0FF',
      backgroundStrong: '#FFFFFF',
      backgroundTransparent: 'transparent',

      // COLORS (texto e ícones)
      color: '#0F1419',
      colorHover: '#1C2128',
      colorPress: '#364954',
      colorFocus: '#2873FF',

      // BORDERS
      borderColor: '#E5E7EB',
      borderColorHover: '#D1D5DB',
      borderColorPress: '#9CA3AF',
      borderColorFocus: '#2873FF',

      // PLACEHOLDERS
      placeholderColor: '#9CA3AF',

      // CORES PRIMÁRIAS
      primary: '#2873FF',
      primaryHover: '#1E5EE6',
      primaryPress: '#1A52CC',
      primaryLight: '#4A8AFF',
      primaryLighter: '#7BA8FF',
      primaryLightest: '#E6F0FF',

      // CORES NEUTRAS
      dark: '#0F1419',
      darkSecondary: '#1C2128',
      medium: '#364954',
      light: '#6B7280',
      lighter: '#9CA3AF',
      lightest: '#F3F4F6',

      // CORES BÁSICAS
      white: '#FFFFFF',
      black: '#000000',

      // STATUS COLORS
      success: '#059669',
      successLight: '#D1FAE5',
      warning: '#D97706',
      warningLight: '#FEF3C7',
      error: '#DC2626',
      errorLight: '#FEE2E2',
      info: '#2873FF',
      infoLight: '#E6F0FF',

      // SHADOWS
      shadowColor: 'rgba(15, 20, 25, 0.1)',
      shadowColorHover: 'rgba(15, 20, 25, 0.15)',
      shadowColorPress: 'rgba(40, 115, 255, 0.2)',
      shadowColorFocus: 'rgba(40, 115, 255, 0.25)',
    },

    dark: {
      // BACKGROUNDS
      background: '#0F1419',
      backgroundHover: '#1C2128',
      backgroundPress: '#21262D',
      backgroundFocus: '#1A2B4D',
      backgroundStrong: '#161B22',
      backgroundTransparent: 'transparent',

      // COLORS (texto e ícones)
      color: '#F0F6FC',
      colorHover: '#FFFFFF',
      colorPress: '#C9D1D9',
      colorFocus: '#7BA8FF',

      // BORDERS
      borderColor: '#21262D',
      borderColorHover: '#30363D',
      borderColorPress: '#484F58',
      borderColorFocus: '#4A8AFF',

      // PLACEHOLDERS
      placeholderColor: '#7D8590',

      // CORES PRIMÁRIAS (adaptadas para dark)
      primary: '#4A8AFF',
      primaryHover: '#7BA8FF',
      primaryPress: '#2873FF',
      primaryLight: '#7BA8FF',
      primaryLighter: '#A6C1FF',
      primaryLightest: '#1A2B4D',

      // CORES NEUTRAS (invertidas para dark)
      dark: '#F0F6FC',
      darkSecondary: '#C9D1D9',
      medium: '#8B949E',
      light: '#6E7681',
      lighter: '#484F58',
      lightest: '#21262D',

      // CORES BÁSICAS
      white: '#FFFFFF',
      black: '#000000',

      // STATUS COLORS (versões dark-friendly)
      success: '#3FB950',
      successLight: '#0D4B26',
      warning: '#F79009',
      warningLight: '#4A2C0A',
      error: '#F85149',
      errorLight: '#4C1518',
      info: '#4A8AFF',
      infoLight: '#1A2B4D',

      // SHADOWS
      shadowColor: 'rgba(0, 0, 0, 0.3)',
      shadowColorHover: 'rgba(0, 0, 0, 0.4)',
      shadowColorPress: 'rgba(74, 138, 255, 0.2)',
      shadowColorFocus: 'rgba(74, 138, 255, 0.3)',
    }
  },
  shorthands,
})
