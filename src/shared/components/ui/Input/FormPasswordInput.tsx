import React, {forwardRef, memo, ReactNode, useState} from 'react';
import {Input, InputProps, StackProps, Text, XStack, YStack} from 'tamagui';
import {Eye, EyeOff} from '@tamagui/lucide-icons';

type LabelPasswordInputProps = InputProps & {
  label?: ReactNode;
  containerProps?: StackProps;
  labelFontSize?: InputProps['fontSize'];
  labelColor?: string;
  leftIcon?: ReactNode;
  showSuccessIcon?: boolean;
  successIcon?: ReactNode;
  validationFn?: (value: string) => boolean;
};

function BaseLabelPasswordInput(
  {
    label,
    containerProps,
    labelFontSize = '$4',
    labelColor = '$medium',
    leftIcon,
    showSuccessIcon = false,
    successIcon,
    validationFn,
    height = 52,
    fontSize = '$4',
    backgroundColor = '$white',
    borderColor = 'transparent',
    borderWidth = 0,
    onChangeText,
    ...inputProps
  }: LabelPasswordInputProps,
  ref: React.Ref<any>
) {
  const [visible, setVisible] = useState(false);
  const [inputValue, setInputValue] = useState(inputProps.value || '');

  const handleChangeText = (text: string) => {
    setInputValue(text);

    if (onChangeText) {
      onChangeText(text);
    }
  };

  const paddingLeft = leftIcon ? 45 : 16;
  const paddingRight = 50; // Espaço fixo para o ícone de visibilidade

  return (
    <YStack gap="$2" {...containerProps}>
      {label ? (
        <Text fontSize={labelFontSize}
              color="$absoluteTextPrimary"
              fontWeight="500">
          {label}
        </Text>
      ) : null}

      <YStack position="relative">
        {leftIcon && (
          <XStack
            position="absolute"
            left={12}
            top={0}
            bottom={0}
            alignItems="center"
            zIndex={1}
            pointerEvents="none"
          >
            {leftIcon}
          </XStack>
        )}

        <Input
          ref={ref}
          height={height}
          fontSize={fontSize}
          borderColor={borderColor}
          borderWidth={borderWidth}

          backgroundColor="$lightest"
          placeholderTextColor="$absolutePlaceholder"

          borderRadius="$4"
          paddingLeft={paddingLeft}
          paddingRight={paddingRight}
          color="$darkBlue"
          secureTextEntry={!visible}
          focusStyle={{
            borderColor: '$medium',
            borderWidth: 1
          }}
          onChangeText={handleChangeText}
          {...inputProps}
        />

        <XStack
          position="absolute"
          right={8}
          top={0}
          bottom={0}
          alignItems="center"
          zIndex={1}
        >
          <XStack
            alignItems="center"
            justifyContent="center"
            width={32}
            height={32}
            borderRadius="$4"
            pressStyle={{opacity: 0.6}}
            hoverStyle={{backgroundColor: '$lighter'}}
            onPress={() => setVisible(v => !v)}
            cursor="pointer"
          >
            {visible ? (
              <EyeOff size={18} color="$darkBlue"/>
            ) : (
              <Eye size={18} color="$darkBlue"/>
            )}
          </XStack>
        </XStack>
      </YStack>
    </YStack>
  );
}

export const LabelPasswordInput = memo(forwardRef(BaseLabelPasswordInput));
