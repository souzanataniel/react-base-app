/**
 * Sistema de sombras padronizado para React Native + Tamagui
 * Compatível com iOS (shadow*) e Android (elevation)
 */

// Tipos de sombra disponíveis
export type ShadowType = 'none' | 'sm' | 'md' | 'lg' | 'xl';

// Interface para propriedades de sombra
export interface ShadowStyle {
  // iOS
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  // Android
  elevation: number;
}

// Definições de sombra base
const SHADOW_DEFINITIONS: Record<ShadowType, ShadowStyle> = {
  none: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,
  },
};

/**
 * Retorna o estilo de sombra para o tipo especificado
 */
export const getShadow = (type: ShadowType = 'none'): ShadowStyle => {
  return SHADOW_DEFINITIONS[type];
};

/**
 * Cria uma sombra customizada
 */
export const createCustomShadow = (
  offset: { width: number; height: number },
  opacity: number,
  radius: number,
  elevation: number,
  color: string = '#000'
): ShadowStyle => {
  return {
    shadowColor: color,
    shadowOffset: offset,
    shadowOpacity: opacity,
    shadowRadius: radius,
    elevation,
  };
};

/**
 * Sombras específicas para componentes da aplicação
 */
export const COMPONENT_SHADOWS = {
  // TabBar - sombra sutil para elevação
  tabBar: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 4,
  },

  // Footer - sombra média para destaque
  footer: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },

  // Card - sombra suave
  card: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },

  // Modal - sombra forte
  modal: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },

  // Button pressed - sombra reduzida
  buttonPressed: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
} as const;

/**
 * Hook para usar sombras com tema (opcional)
 */
export const useShadow = (type: ShadowType = 'none', customColor?: string) => {
  const shadow = getShadow(type);

  if (customColor) {
    return {...shadow, shadowColor: customColor};
  }

  return shadow;
};

/**
 * Versão em objeto para uso direto em estilos
 */
export const SHADOWS = {
  none: SHADOW_DEFINITIONS.none,
  sm: SHADOW_DEFINITIONS.sm,
  md: SHADOW_DEFINITIONS.md,
  lg: SHADOW_DEFINITIONS.lg,
  xl: SHADOW_DEFINITIONS.xl,

  // Aliases para componentes
  tabBar: COMPONENT_SHADOWS.tabBar,
  footer: COMPONENT_SHADOWS.footer,
  card: COMPONENT_SHADOWS.card,
  modal: COMPONENT_SHADOWS.modal,
  buttonPressed: COMPONENT_SHADOWS.buttonPressed,
} as const;

// ==============================================
// EXEMPLO DE USO
// ==============================================

/*
// 1. Usando getShadow() com tipos predefinidos
const MyComponent = () => (
  <View style={[styles.container, getShadow('md')]}>
    <Text>Component with medium shadow</Text>
  </View>
);

// 2. Usando SHADOWS diretamente
const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    ...SHADOWS.card,
  },
  footer: {
    backgroundColor: 'white',
    ...SHADOWS.footer,
  }
});

// 3. Com Tamagui
const TamaguiCard = () => (
  <YStack
    backgroundColor="$background"
    borderRadius="$4"
    padding="$4"
    {...SHADOWS.card}
  >
    <Text>Card with shadow</Text>
  </YStack>
);

// 4. Sombra customizada
const customShadow = createCustomShadow(
  { width: 0, height: 3 },
  0.2,
  6,
  6,
  '#007AFF'
);

// 5. Usando o hook (com tema)
const Component = () => {
  const shadow = useShadow('lg', theme.shadowColor?.get());

  return (
    <View style={[styles.box, shadow]}>
      <Text>Custom themed shadow</Text>
    </View>
  );
};
*/

// ==============================================
// INTEGRAÇÃO COM TAMAGUI TOKENS (OPCIONAL)
// ==============================================

/**
 * Para adicionar ao seu arquivo de tema Tamagui:
 */
export const tamaguiShadowTokens = {
  shadowSm: SHADOW_DEFINITIONS.sm,
  shadowMd: SHADOW_DEFINITIONS.md,
  shadowLg: SHADOW_DEFINITIONS.lg,
  shadowXl: SHADOW_DEFINITIONS.xl,
};

/*
// No seu createTamagui config:
export default createTamagui({
  // ...outras configs
  tokens: {
    // ...outros tokens
    shadow: {
      sm: { ...SHADOW_DEFINITIONS.sm },
      md: { ...SHADOW_DEFINITIONS.md },
      lg: { ...SHADOW_DEFINITIONS.lg },
      xl: { ...SHADOW_DEFINITIONS.xl },
    }
  }
});

// Uso:
<YStack shadow="$sm" />
*/
