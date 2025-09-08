import {Button, XStack} from 'tamagui';
import {ArrowLeft} from '@tamagui/lucide-icons';
import {router} from 'expo-router';
import {BackButtonProps} from './Button.types';

export function BackButtonInline({
                                   onPress = () => router.back(),
                                   buttonColor = '$white',
                                   iconColor = '$black',
                                   size = '$4',
                                   borderRadius = 50,
                                   outlined = false,
                                   borderColor = '$gray8'
                                 }: BackButtonProps) {

  return (
    <XStack
      zIndex={1000}
      padding="$2"
      borderRadius={borderRadius}
    >
      <Button
        width={size}
        height={size}
        backgroundColor={outlined ? 'transparent' : buttonColor}
        borderWidth={outlined ? 1 : 0}
        borderColor={outlined ? borderColor : 'transparent'}
        onPress={onPress}
        borderRadius={borderRadius}
        padding={0}
        pressStyle={{
          scale: 0.98,
          backgroundColor: '$cream',
          borderColor: '$ocean'
        }}
      >
        <ArrowLeft size={20} color={iconColor}/>
      </Button>
    </XStack>
  );
}
