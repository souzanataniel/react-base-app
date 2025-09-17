import React, {forwardRef, memo, ReactNode, useState} from 'react';
import {Input, InputProps, StackProps, Text, XStack, YStack} from 'tamagui';
import {Eye, EyeOff} from '@tamagui/lucide-icons';

type LabelPasswordInputProps = InputProps & {
  label?: ReactNode;
  containerProps?: StackProps;
  labelFontSize?: InputProps['fontSize'];
  leftIcon?: ReactNode;
};

function BaseLabelPasswordInput(
  {
    label,
    containerProps,
    labelFontSize = '$4',
    leftIcon,
    height = 52,
    fontSize = '$4',
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
  const paddingRight = 50;

  return (
    <YStack gap="$2" {...containerProps}>
      {label ? (
        <Text fontSize={labelFontSize}
              color="$defaultLabel"
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
          borderColor="transparent"
          backgroundColor="$defaultBackgroundInput"
          placeholderTextColor="$defaultPlaceholderText"
          color="$defaultLabel"
          borderRadius="$4"
          paddingLeft={paddingLeft}
          paddingRight={paddingRight}
          secureTextEntry={!visible}
          focusStyle={{
            borderColor: '$defaultQuaternaryLabel',
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
            hoverStyle={{backgroundColor: '$defaultSecondaryLabel'}}
            onPress={() => setVisible(v => !v)}
            cursor="pointer"
          >
            {visible ? (
              <EyeOff size={18} color="$defaultSecondaryLabel"/>
            ) : (
              <Eye size={18} color="$defaultSecondaryLabel"/>
            )}
          </XStack>
        </XStack>
      </YStack>
    </YStack>
  );
}

export const LabelPasswordInput = memo(forwardRef(BaseLabelPasswordInput));
