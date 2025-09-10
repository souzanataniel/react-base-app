import {Button, useTheme, useThemeName, XStack} from 'tamagui';
import {ArrowLeft} from '@tamagui/lucide-icons';
import {router} from 'expo-router';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface BackButtonProps {
  onPress?: () => void;
  buttonColor?: string;
  iconColor?: string;
  size?: string;
  borderRadius?: number;
  outlined?: boolean;
  borderColor?: string;
  absolute?: boolean; // Nova prop para controlar posicionamento
}

export function BackButton({
                             onPress = () => router.back(),
                             buttonColor,
                             iconColor,
                             size = '$4',
                             borderRadius = 50,
                             outlined = false,
                             borderColor,
                             absolute = false, // Por padrão inline
                           }: BackButtonProps) {
  const theme = useTheme();
  const themeName = useThemeName();
  const insets = useSafeAreaInsets();

  const getAdaptiveButtonColor = () => {
    if (buttonColor) return buttonColor;
    if (outlined) return 'transparent';

    if (themeName === 'light') {
      return theme.dark?.get();
    } else {
      return theme.white?.get();
    }
  };

  const getAdaptiveIconColor = () => {
    if (iconColor) return iconColor;

    if (themeName === 'light') {
      return theme.white?.get();
    } else {
      return theme.background?.get();
    }
  };

  const getAdaptiveBorderColor = () => {
    if (borderColor) return borderColor;
    return theme.borderColor?.get();
  };

  const getPressStyle = () => {
    if (outlined) {
      return {
        scale: 0.98,
        backgroundColor: theme.backgroundHover?.get(),
        borderColor: theme.borderColorHover?.get(),
      };
    } else {
      return {
        scale: 0.98,
        backgroundColor: theme.backgroundHover?.get(),
      };
    }
  };

  // Props condicionais baseadas no posicionamento
  const containerProps = absolute
    ? {
      position: 'absolute' as const,
      top: insets.top + 10,
      left: 16,
      zIndex: 1000,
      padding: '$2',
      borderRadius: borderRadius,
    }
    : {
      zIndex: 1000,
      padding: '$2',
      borderRadius: borderRadius,
    };

  return (
    <XStack {...containerProps}>
      <Button
        width={size}
        height={size}
        backgroundColor={getAdaptiveButtonColor()}
        borderWidth={outlined ? 1 : 0}
        borderColor={outlined ? getAdaptiveBorderColor() : 'transparent'}
        onPress={onPress}
        borderRadius={borderRadius}
        padding={0}
        pressStyle={getPressStyle()}
        shadowColor={themeName === 'light' ? '$shadowColor' : 'transparent'}
        shadowOffset={themeName === 'light' ? {width: 0, height: 2} : {width: 0, height: 0}}
        shadowOpacity={themeName === 'light' ? 0.1 : 0}
        shadowRadius={themeName === 'light' ? 4 : 0}
        elevation={themeName === 'light' ? 2 : 0}
      >
        <ArrowLeft size={20} color={getAdaptiveIconColor()}/>
      </Button>
    </XStack>
  );
}
