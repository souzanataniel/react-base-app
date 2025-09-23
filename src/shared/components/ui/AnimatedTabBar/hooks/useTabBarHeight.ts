import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from 'tamagui';

export const useTabBarHeight = () => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const config = {
    sizes: {
      icon: 26,
      fontSize: 9,
      maxWidth: 60,
      activeBorderHeight: 2.2,
      activeBorderTopOffset: -2,
      containerHeight: 40,
    },
    colors: {
      active: theme.primary?.val || '#007AFF',
      inactive: theme.colorSecondary?.val || theme.gray10?.val || '#8E8E93',
      background: theme.card?.val || theme.backgroundStrong?.val || 'white',
      activeBorder: theme.primary?.val || '#007AFF',
    },
    spacing: {
      paddingHorizontal: 6,
      paddingTop: 2,
      paddingBottom: 2,
      gap: 1,
      paddingVertical: 5,
      borderRadius: 0,
    },
    animation: {
      scale: {damping: 18, stiffness: 250},
      press: {damping: 20, stiffness: 500},
      bounce: {damping: 15, stiffness: 400},
      return: {damping: 15, stiffness: 350},
      timing: {duration: 200},
      hideShow: {duration: 300},
    }
  };

  const safeAreaBottom = Math.max(insets.bottom, 8);
  const totalHeight = config.sizes.containerHeight + config.spacing.paddingTop + config.spacing.paddingBottom + config.spacing.paddingVertical * 2 + safeAreaBottom;

  return {
    tabBarHeight: totalHeight,
    safeAreaBottom: safeAreaBottom,
    insets,
    config,
  };
};
