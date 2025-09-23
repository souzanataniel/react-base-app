import {defaultConfig} from '@tamagui/config/v4'
import {createFont, createTamagui, createTokens} from 'tamagui'
import {shorthands} from '@tamagui/shorthands'

const poppinsFont = createFont({
  family: 'Inter',
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
    defaultPrimary: '#2873FF',

    defaultWhite: '#FFFFFF',
    defaultBlack: '#000000',

    defaultBackgroundInput: '#F9F9F9',

    defaultLabel: '#000000',
    defaultSecondaryLabel: '#3C3C4399',
    defaultTertiaryLabel: '#3C3C434C',
    defaultQuaternaryLabel: '#3C3C432D',
    defaultPlaceholderText: '#3C3C434C',
    defaultLink: '#007AFF',

    defaultLabelDark: '#FFFFFF',
    defaultSecondaryLabelDark: '#EBEBF599',
    defaultTertiaryLabelDark: '#EBEBF54C',
    defaultQuaternaryLabelDark: '#EBEBF52D',
    defaultPlaceholderTextDark: '#EBEBF54C',
    defaultLinkDark: '#0984FF',

    defaultSystemBackground: '#FFFFFF',
    defaultSystemBackgroundDark: '#000000',
    defaultSecondarySystemBackground: '#F2F2F7',
    defaultSecondarySystemBackgroundDark: '#1C1C1E',

    success: '#3FB950',
    successLight: '#0D4B26',
    warning: '#F79009',
    warningLight: '#4A2C0A',
    error: '#F85149',
    errorLight: '#4C1518',
    info: '#4A8AFF',
    infoLight: '#1A2B4D',
  },
})

export const config = createTamagui({
  ...defaultConfig,
  settings: {
    ...defaultConfig.settings,
    shouldAddPrefersColorThemes: true,
    themeClassNameOnRoot: true,
  },
  tokens: customTokens,
  fonts: {
    heading: poppinsFont,
    body: poppinsFont,
    mono: poppinsFont,
  },
  themes: {
    light: {
      background: '#F2F2F7',
      backgroundStrong: '#FFFFFF',

      card: '#FFFFFF',

      color: '#000000',
      colorInverse: '#FFFFFF',

      colorSecondary: '#3C3C4399',
      colorTertiary: '#3C3C434C',
      colorQuaternary: '#3C3C432D',
      placeholderColor: '#3C3C434C',

      primary: '#2873FF',
      link: '#007AFF',

      switch: '#E4E4E47F',
      switchBorder: '#E4E4E47F',

      cardHeader: '#2873FF',

      button: '#2873FF',
      buttonLabel: '#FFFFFF',

      backgroundInput: '#F9F9F9',
      placeholderText: '#3C3C434C',

    },

    dark: {
      background: '#000000',
      backgroundStrong: '#000000',

      card: '#1C1C1E',

      color: '#FFFFFF',
      colorInverse: '#000000',
      colorSecondary: '#EBEBF599',
      colorTertiary: '#EBEBF54C',
      colorQuaternary: '#EBEBF52D',
      placeholderColor: '#EBEBF54C',

      primary: '#FFFFFF',
      link: '#FFFFFF',

      switch: '#48484A7F',
      switchBorder: '#48484A7F',

      cardHeader: '#1C1C1E',

      button: '#FFFFFF',
      buttonLabel: '#000000',

      backgroundInput: '#323232',
      placeholderText: '#EBEBF54C',

    }
  },
  shorthands,
})
