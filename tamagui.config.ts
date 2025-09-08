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
    // Paleta principal baseada no gradiente
    ocean: '#2a4d5a',        // Cor principal - azul oceano
    oceanDark: '#1a2a35',    // Oceano escuro
    oceanDeep: '#0f1419',    // Oceano profundo

    // Neutros
    white: '#FFFFFF',
    cream: '#F5F5F5',        // Off-white cremoso
    black: '#000000',

    // Variações da paleta oceano
    oceanLight: '#3d6b7a',   // Versão mais clara do oceano
    oceanMuted: '#243c47',   // Versão mais suave

    // Backgrounds
    backgroundLight: '#F8F7F6',  // Baseado no cream
    backgroundDark: '#0f1419',   // Oceano profundo
    backgroundCard: '#FFFFFF',
    backgroundOverlay: 'rgba(15, 20, 25, 0.7)', // Overlay escuro

    // Grays baseados na paleta
    darkGray: '#1a2a35',
    midGray: '#2a4d5a',
    lightGray: '#E5E1DE',
    softGray: '#F0EFED',     // Versão mais suave do cream

    // Status colors harmonizados com a paleta
    primary: '#2a4d5a',      // Oceano como primary
    primaryLight: '#3d6b7a',
    primaryDark: '#1a2a35',

    secondary: '#4a6b5a',    // Verde oceânico
    secondaryLight: '#6b8a7a',
    secondaryDark: '#2e4235',

    success: '#3a5d4a',      // Verde escuro oceânico
    warning: '#5a4d2a',      // Marrom oceânico
    error: '#5a2a2a',        // Vermelho escuro oceânico
    info: '#2a4d5a',         // Mesma cor primary

    // Cores antigas mantidas para compatibilidade (caso necessário)
    dark: '#1a2a35',
    medium: '#2a4d5a',
    light: '#E5E1DE',
    lighter: '#F0EFED',
  },
})

export const config = createTamagui({
  ...defaultConfig,
  settings: {
    ...defaultConfig.settings,
    shouldAddPrefersColorThemes: false,
    themeClassNameOnRoot: false,
    defaultProps: {
      disableThemeTransitions: true,
    },
  },
  tokens: customTokens,
  fonts: {
    heading: poppinsFont,
    body: poppinsFont,
    mono: poppinsFont,
  },
  themes: {
    ...defaultConfig.themes,
    light: {
      ...defaultConfig.themes.light,
      background: '#FFFFFF',
      backgroundHover: '#F8F7F6',
      backgroundPress: '#F0EFED',
      backgroundFocus: '#E5E1DE',

      color: '#1a2a35',
      colorHover: '#0f1419',
      colorPress: '#2a4d5a',
      colorFocus: '#1a2a35',

      borderColor: '#E5E1DE',
      borderColorHover: '#2a4d5a',
      borderColorPress: '#1a2a35',
      borderColorFocus: '#2a4d5a',

      placeholderColor: '#2a4d5a',
    },
    dark: {
      ...defaultConfig.themes.dark,
      background: '#0f1419',
      backgroundHover: '#1a2a35',
      backgroundPress: '#2a4d5a',
      backgroundFocus: '#243c47',

      color: '#E5E1DE',
      colorHover: '#FFFFFF',
      colorPress: '#F0EFED',
      colorFocus: '#E5E1DE',

      borderColor: '#2a4d5a',
      borderColorHover: '#3d6b7a',
      borderColorPress: '#E5E1DE',
      borderColorFocus: '#2a4d5a',

      placeholderColor: '#2a4d5a',
    }
  },
  shorthands,
})
