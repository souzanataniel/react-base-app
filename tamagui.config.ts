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
    baseBackground: '#F8F8F8',
    baseBackgroundHover: '#EEEEEE',      // Hover em backgrounds

    // Cores base que não mudam
    white: '#FFFFFF',
    black: '#000000',

    // Paleta principal - cores fixas
    darkBlue: '#1A2D42',
    mediumBlue: '#2E4156',
    grayBlue: '#AAB7B7',
    lightGray: '#C0C8CA',
    lighterGray: '#D4D8DD',
    lightBackground: '#F8F8F8',

    // Status colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
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
      background: '#F8F8F8',           // Fundo principal da tela
      backgroundHover: '#EEEEEE',      // Hover em backgrounds
      backgroundPress: '#C0C8CA',      // Press em backgrounds
      backgroundFocus: '#AAB7B7',      // Focus em backgrounds
      backgroundStrong: '#FFFFFF',     // Cards, modais, inputs
      backgroundTransparent: 'transparent',

      // === COLORS (texto e ícones) ===
      color: '#1A2D42',               // Texto principal
      colorHover: '#2E4156',          // Hover em textos
      colorPress: '#1A2D42',          // Press em textos
      colorFocus: '#1A2D42',          // Focus em textos

      // === BORDERS ===
      borderColor: '#C0C8CA',         // Bordas padrão
      borderColorHover: '#AAB7B7',    // Hover em bordas
      borderColorPress: '#2E4156',    // Press em bordas
      borderColorFocus: '#1A2D42',    // Focus em bordas

      // === PLACEHOLDERS ===
      placeholderColor: '#AAB7B7',    // Texto de placeholder

      // === SUAS CORES CUSTOMIZADAS ===
      // Estas são as cores que você usa no seu código
      dark: '#1A2D42',               // Cor principal escura
      medium: '#2E4156',             // Cor média
      light: '#AAB7B7',              // Cor clara
      lighter: '#C0C8CA',            // Cor mais clara
      lightest: '#D4D8DD',           // Cor mais clara ainda

      // === CORES NEUTRAS ===
      white: '#FFFFFF',
      black: '#000000',

      // === STATUS COLORS ===
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',

      // === SHADOWS ===
      shadowColor: '#1A2D42',
      shadowColorHover: '#2E4156',
      shadowColorPress: '#AAB7B7',
      shadowColorFocus: '#C0C8CA',
    },

    dark: {
      // === BACKGROUNDS ===
      background: '#1A2D42',           // Fundo principal escuro
      backgroundHover: '#2E4156',      // Hover mais claro
      backgroundPress: '#AAB7B7',      // Press ainda mais claro
      backgroundFocus: '#C0C8CA',      // Focus mais claro
      backgroundStrong: '#2E4156',     // Cards, modais, inputs (mais escuro que o fundo)
      backgroundTransparent: 'transparent',

      // === COLORS (texto e ícones) ===
      color: '#FFFFFF',               // Texto principal claro
      colorHover: '#FFFFFF',          // Hover em textos (mais claro)
      colorPress: '#C0C8CA',          // Press em textos
      colorFocus: '#D4D8DD',          // Focus em textos

      // === BORDERS ===
      borderColor: '#2E4156',         // Bordas escuras
      borderColorHover: '#AAB7B7',    // Hover em bordas
      borderColorPress: '#C0C8CA',    // Press em bordas
      borderColorFocus: '#AAB7B7',    // Focus em bordas

      // === PLACEHOLDERS ===
      placeholderColor: '#AAB7B7',    // Placeholder visível no escuro

      // === SUAS CORES CUSTOMIZADAS (adaptadas para modo escuro) ===
      dark: '#D4D8DD',               // Texto claro no modo escuro
      medium: '#AAB7B7',             // Cor média adaptada
      light: '#C0C8CA',              // Cor clara adaptada
      lighter: '#D4D8DD',            // Cor mais clara adaptada
      lightest: '#FFFFFF',           // A mais clara vira branco

      // === CORES NEUTRAS ===
      white: '#FFFFFF',              // Branco puro mantém
      black: '#000000',              // Preto puro mantém

      // === STATUS COLORS (mantém as mesmas) ===
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',

      // === SHADOWS ===
      shadowColor: '#000000',
      shadowColorHover: '#1A2D42',
      shadowColorPress: '#2E4156',
      shadowColorFocus: '#AAB7B7',
    }
  },
  shorthands,
})
