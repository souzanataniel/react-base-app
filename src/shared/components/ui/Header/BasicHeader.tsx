import React from 'react';
import {Pressable} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useRouter} from 'expo-router';
import {Separator, Text, Theme, XStack, YStack} from 'tamagui';
import {ArrowLeft} from '@tamagui/lucide-icons';

type BasicHeaderProps = {
  title: string;
  onBack?: () => void;
  rightIcon?: React.ReactNode;
  onRightPress?: () => void;
  showRight?: boolean;
  barHeight?: number;
  titleSizeToken?: `$${number}`;
  showBottomBorder?: boolean;
  backgroundColor?: string;
};

const IconButton = ({
                      onPress,
                      children,
                      a11yLabel,
                    }: {
  onPress?: () => void;
  children: React.ReactNode;
  a11yLabel: string;
}) => {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}
      hitSlop={12}
      onPress={onPress}
      style={({pressed}) => ({
        opacity: pressed ? 0.6 : 1,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 9999,
      })}
    >
      {children}
    </Pressable>
  );
};

export function BasicHeader({
                              title,
                              onBack,
                              rightIcon,
                              onRightPress,
                              showRight = !!rightIcon,
                              barHeight = 56,
                              titleSizeToken = '$5',
                              showBottomBorder = false,
                              backgroundColor = '$absolutePrimary',
                            }: BasicHeaderProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleBack = () => {
    if (onBack) return onBack();
    router.back();
  };

  return (
    <Theme>
      <YStack backgroundColor={backgroundColor}>
        <YStack height={insets.top} backgroundColor={backgroundColor}/>

        <XStack height={barHeight} alignItems="center" backgroundColor={backgroundColor} position="relative">

          <XStack position="absolute" left={0} zIndex={1} width={56} alignItems="center" justifyContent="flex-start"
                  paddingHorizontal="$2">
            <IconButton onPress={handleBack} a11yLabel="Voltar">
              <ArrowLeft size={22} color="white"/>
            </IconButton>
          </XStack>

          <XStack flex={1} alignItems="center" justifyContent="center">
            <Text fontSize={titleSizeToken} fontWeight="600" numberOfLines={1} ellipsizeMode="tail" color="white">
              {title}
            </Text>
          </XStack>

          <XStack position="absolute" right={0} zIndex={1} width={56} alignItems="center" justifyContent="flex-end"
                  paddingHorizontal="$2">
            {showRight && rightIcon ? (
              <IconButton onPress={onRightPress} a11yLabel="Ação do header">
                {rightIcon}
              </IconButton>
            ) : null}
          </XStack>
        </XStack>
        {showBottomBorder && <Separator/>}
      </YStack>
    </Theme>
  );
}
