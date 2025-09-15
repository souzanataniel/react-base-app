import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useRouter} from 'expo-router';
import {Button, Text, XStack, YStack} from 'tamagui';
import {ChevronLeft} from '@tamagui/lucide-icons';

interface BasicHeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  backgroundColor?: string;
  titleColor?: string;
  backButtonColor?: string;
}

export const BasicHeader: React.FC<BasicHeaderProps> = ({
                                                          title,
                                                          showBackButton = false,
                                                          onBackPress,
                                                          backgroundColor = '$background',
                                                          titleColor = '$color',
                                                          backButtonColor = '$color'
                                                        }) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <YStack
      backgroundColor={backgroundColor}
      paddingTop={insets.top}
      borderBottomWidth={1}
      borderBottomColor="$borderColor"
    >
      <XStack
        height={56}
        alignItems="center"
        justifyContent="center"
        paddingHorizontal="$4"
        position="relative"
      >
        {/* Botão de voltar */}
        {showBackButton && (
          <XStack
            position="absolute"
            left="$4"
            zIndex={1}
          >
            <Button
              size="$3"
              variant="outlined"
              circular
              onPress={handleBackPress}
              icon={<ChevronLeft size={24} color={backButtonColor}/>}
              padding="$2"
            />
          </XStack>
        )}

        {/* Título centralizado */}
        <Text
          fontSize="$6"
          fontWeight="600"
          color={titleColor}
          textAlign="center"
          flex={1}
          numberOfLines={1}
        >
          {title}
        </Text>
      </XStack>
    </YStack>
  );
};
