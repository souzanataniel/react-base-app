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
    // Paleta principal - 5 cores da imagem
    dark: '#1A2D42',      // Azul escuro
    medium: '#2E4156',    // Azul médio
    light: '#AAB7B7',     // Cinza azulado
    lighter: '#C0C8CA',   // Cinza claro
    lightest: '#D4D8DD',  // Cinza muito claro

    // Neutros básicos
    white: '#FFFFFF',
    black: '#000000',

    // Status colors simples
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
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
      backgroundHover: '#D4D8DD',
      backgroundPress: '#C0C8CA',
      backgroundFocus: '#AAB7B7',

      color: '#1A2D42',
      colorHover: '#2E4156',
      colorPress: '#1A2D42',
      colorFocus: '#1A2D42',

      borderColor: '#C0C8CA',
      borderColorHover: '#AAB7B7',
      borderColorPress: '#2E4156',
      borderColorFocus: '#1A2D42',

      placeholderColor: '#AAB7B7',
    },
    dark: {
      ...defaultConfig.themes.dark,
      background: '#1A2D42',
      backgroundHover: '#2E4156',
      backgroundPress: '#AAB7B7',
      backgroundFocus: '#C0C8CA',

      color: '#D4D8DD',
      colorHover: '#FFFFFF',
      colorPress: '#C0C8CA',
      colorFocus: '#D4D8DD',

      borderColor: '#2E4156',
      borderColorHover: '#AAB7B7',
      borderColorPress: '#C0C8CA',
      borderColorFocus: '#AAB7B7',

      placeholderColor: '#AAB7B7',
    }
  },
  shorthands,
})
