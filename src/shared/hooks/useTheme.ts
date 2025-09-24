import {useEffect, useState} from 'react';
import {useColorScheme} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark' | 'automatic';

const THEME_STORAGE_KEY = '@app_theme';
const THEME_ORDER: ThemeMode[] = ['light', 'dark', 'automatic'];

const THEME_DISPLAY_NAMES: Record<ThemeMode, string> = {
  light: 'Claro',
  dark: 'Escuro',
  automatic: 'Automático'
};

const THEME_DISPLAY_WITH_ICONS: Record<ThemeMode, string> = {
  light: '☀️ Claro',
  dark: '🌙 Escuro',
  automatic: '🔄 Automático'
};

const THEME_DESCRIPTIONS: Record<ThemeMode, string> = {
  light: 'Sempre usar tema claro',
  dark: 'Sempre usar tema escuro',
  automatic: 'Seguir configuração do sistema'
};

let globalThemeMode: ThemeMode = 'automatic';
const listeners: Array<(theme: ThemeMode) => void> = [];

export const useThemeManager = () => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>(globalThemeMode);

  useEffect(() => {
    const listener = (newTheme: ThemeMode) => {
      setThemeMode(newTheme);
    };

    listeners.push(listener);

    // Carrega tema salvo apenas uma vez
    if (listeners.length === 1) {
      loadSavedTheme();
    }

    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  useEffect(() => {
    // Força re-render quando o tema do sistema muda e estamos no modo automático
    if (themeMode === 'automatic') {
      // Não precisa fazer nada aqui, o getCurrentTheme() já vai retornar o tema correto
      // Este useEffect garante que o componente re-renderize quando systemColorScheme mudar
    }
  }, [systemColorScheme, themeMode]);

  const loadSavedTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme && ['light', 'dark', 'automatic'].includes(savedTheme)) {
        const theme = savedTheme as ThemeMode;
        globalThemeMode = theme;
        notifyListeners(theme);
      }
    } catch (error) {
      console.error('Erro ao carregar tema salvo:', error);
    }
  };

  const saveTheme = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.error('Erro ao salvar tema:', error);
    }
  };

  const notifyListeners = (theme: ThemeMode) => {
    listeners.forEach(listener => listener(theme));
  };

  const getCurrentTheme = (): 'light' | 'dark' => {
    if (themeMode === 'automatic') {
      // Garante que sempre há um fallback para 'light' se systemColorScheme for null
      return systemColorScheme === 'dark' ? 'dark' : 'light';
    }
    return themeMode;
  };

  const nextTheme = async (): Promise<ThemeMode> => {
    const currentIndex = THEME_ORDER.indexOf(globalThemeMode);
    const nextIndex = (currentIndex + 1) % THEME_ORDER.length;
    const newTheme = THEME_ORDER[nextIndex];

    globalThemeMode = newTheme;
    notifyListeners(newTheme);
    await saveTheme(newTheme);

    return newTheme;
  };

  const setTheme = async (mode: ThemeMode): Promise<ThemeMode> => {
    globalThemeMode = mode;
    notifyListeners(mode);
    await saveTheme(mode);
    return mode;
  };

  const getModeDisplayName = (mode?: ThemeMode): string => {
    return THEME_DISPLAY_NAMES[mode || themeMode];
  };

  const getModeWithIcon = (mode?: ThemeMode): string => {
    return THEME_DISPLAY_WITH_ICONS[mode || themeMode];
  };

  const getModeDescription = (mode?: ThemeMode): string => {
    return THEME_DESCRIPTIONS[mode || themeMode];
  };

  const getEffectiveThemeDisplayName = (): string => {
    const current = getCurrentTheme();
    return THEME_DISPLAY_NAMES[current];
  };

  const getEffectiveThemeWithIcon = (): string => {
    const current = getCurrentTheme();
    return THEME_DISPLAY_WITH_ICONS[current];
  };

  const getThemeDisplayName = getModeDisplayName;
  const getThemeWithIcon = getModeWithIcon;
  const getThemeDescription = getModeDescription;
  const getCurrentThemeDisplayName = getEffectiveThemeDisplayName;
  const getCurrentThemeWithIcon = getEffectiveThemeWithIcon;

  const getThemeStatus = () => {
    const current = getCurrentTheme();
    const isAutomatic = themeMode === 'automatic';
    const systemTheme = systemColorScheme || 'light';

    return {
      mode: themeMode,
      effectiveTheme: current,

      // Nomes do MODO selecionado (pode ser "Automático")
      modeDisplayName: getModeDisplayName(),
      modeDisplayWithIcon: getModeWithIcon(),
      modeDescription: getModeDescription(),

      // Nomes do tema EFETIVO (sempre "Claro" ou "Escuro")
      effectiveDisplayName: getEffectiveThemeDisplayName(),
      effectiveDisplayWithIcon: getEffectiveThemeWithIcon(),

      // Para compatibilidade (usa modo selecionado)
      displayName: getModeDisplayName(),
      displayNameWithIcon: getModeWithIcon(),
      description: getModeDescription(),

      isAutomatic,
      systemTheme,
      statusText: isAutomatic
        ? `Automático (seguindo ${getEffectiveThemeDisplayName().toLowerCase()} do sistema)`
        : getModeDisplayName()
    };
  };

  const getDebugInfo = () => {
    return {
      themeMode,
      systemColorScheme,
      currentTheme: getCurrentTheme(),
      isSystemDark: systemColorScheme === 'dark',
      isAutomatic: themeMode === 'automatic'
    };
  };

  return {
    // Estados atuais
    themeMode,
    currentTheme: getCurrentTheme(),

    // Funções de controle
    nextTheme,
    setTheme,

    // Funções de formatação para MODO selecionado (inclui "Automático")
    getModeDisplayName,
    getModeWithIcon,
    getModeDescription,

    // Funções de formatação para tema EFETIVO (sempre light/dark)
    getEffectiveThemeDisplayName,
    getEffectiveThemeWithIcon,

    // Funções de compatibilidade (apontam para modo)
    getThemeDisplayName,
    getThemeWithIcon,
    getThemeDescription,
    getCurrentThemeDisplayName,
    getCurrentThemeWithIcon,
    getThemeStatus,

    // Debug
    getDebugInfo,

    // Informações do sistema
    systemColorScheme: systemColorScheme || 'light',
    isAutomatic: themeMode === 'automatic',
  };
};

export const useThemeDisplay = () => {
  const getDisplayName = (mode: ThemeMode): string => THEME_DISPLAY_NAMES[mode];
  const getWithIcon = (mode: ThemeMode): string => THEME_DISPLAY_WITH_ICONS[mode];
  const getDescription = (mode: ThemeMode): string => THEME_DESCRIPTIONS[mode];

  const getAllThemes = () => THEME_ORDER.map(mode => ({
    mode,
    displayName: getDisplayName(mode),
    displayWithIcon: getWithIcon(mode),
    description: getDescription(mode)
  }));

  return {
    getDisplayName,
    getWithIcon,
    getDescription,
    getAllThemes,
    THEME_ORDER,
  };
};
