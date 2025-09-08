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
    labelColor = '$color',
    leftIcon,
    showSuccessIcon = false,
    successIcon,
    validationFn,
    height = 50,
    fontSize = '$4',
    backgroundColor = 'transparent',
    borderColor = '$gray7',
    borderWidth = 1,
    onChangeText,
    ...inputProps
  }: LabelPasswordInputProps,
  ref: React.Ref<any>
) {
  const [visible, setVisible] = useState(false);
  const [inputValue, setInputValue] = useState(inputProps.value || '');
  const [isValid, setIsValid] = useState(false);

  const handleChangeText = (text: string) => {
    setInputValue(text);

    if (validationFn) {
      setIsValid(validationFn(text));
    } else if (showSuccessIcon) {
      setIsValid(text.length >= 6);
    }

    if (onChangeText) {
      onChangeText(text);
    }
  };

  const shouldShowSuccessIcon = showSuccessIcon && isValid && inputValue.length > 0;
  const paddingLeft = leftIcon ? 45 : 15;
  const paddingRight = shouldShowSuccessIcon ? 85 : 50;

  return (
    <YStack gap="$2" {...containerProps}>
      {label ? (
        <Text fontSize={labelFontSize} color={labelColor} fontWeight="$6">
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
          backgroundColor={backgroundColor}
          borderColor={borderColor}
          borderWidth={borderWidth}
          paddingLeft={paddingLeft}
          paddingRight={paddingRight}
          secureTextEntry={!visible}
          focusStyle={{
            borderColor,
            borderWidth: (borderWidth as number) + 1
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
          gap="$1"
        >
          {shouldShowSuccessIcon && (
            <XStack
              alignItems="center"
              pointerEvents="none"
            >
              {successIcon || (
                <Text color="$green10" fontSize="$5">
                  ✓
                </Text>
              )}
            </XStack>
          )}

          <XStack
            alignItems="center"
            justifyContent="center"
            width={32}
            height={32}
            borderRadius="$4"
            pressStyle={{opacity: 0.6}}
            hoverStyle={{backgroundColor: '$gray3'}}
            onPress={() => setVisible(v => !v)}
            cursor="pointer"
          >
            {visible ? (
              <EyeOff size={18} color="$dark"/>
            ) : (
              <Eye size={18} color="$dark"/>
            )}
          </XStack>
        </XStack>
      </YStack>
    </YStack>
  );
}

export const LabelPasswordInput = memo(forwardRef(BaseLabelPasswordInput));
