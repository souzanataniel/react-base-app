import {useSafeAreaInsets} from 'react-native-safe-area-context';

/**
 * Hook que retorna a altura do tab bar customizado
 * Use este hook nas suas telas para adicionar padding bottom
 */
export const useTabBarHeight = () => {
  const insets = useSafeAreaInsets();

  const circleSize = 44;
  const paddingTop = 8;
  const paddingBottom = 4;
  const safeAreaBottom = Math.max(insets.bottom + 10, 20);

  const totalHeight = circleSize + paddingTop + paddingBottom + safeAreaBottom;

  return {
    tabBarHeight: totalHeight,
    safeAreaBottom: safeAreaBottom,
    insets,
  };
};
