import React, {forwardRef, memo, ReactNode, useState} from 'react';
import {Input, InputProps, StackProps, Text, XStack, YStack} from 'tamagui';

type LabelInputProps = InputProps & {
  label?: ReactNode;
  containerProps?: StackProps;
  labelFontSize?: InputProps['fontSize'];
  labelColor?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  showSuccessIcon?: boolean;
  successIcon?: ReactNode;
  validationFn?: (value: string) => boolean;
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
};

function BaseLabelInput(
  {
    label,
    containerProps,
    labelFontSize = '$4',
    labelColor = '$medium',
    leftIcon,
    rightIcon,
    showSuccessIcon = false,
    successIcon,
    validationFn,
    height = 52,
    fontSize = '$4',
    backgroundColor = '$white',
    borderColor = 'transparent',
    borderWidth = 0,
    onChangeText,
    keyboardType,
    ...inputProps
  }: LabelInputProps,
  ref: React.Ref<any>
) {
  const [inputValue, setInputValue] = useState(inputProps.value || '');
  const [isValid, setIsValid] = useState(false);

  const handleChangeText = (text: string) => {
    setInputValue(text);

    if (keyboardType === 'email-address') {
      setIsValid(isValidEmail(text));
    } else if (validationFn) {
      setIsValid(validationFn(text));
    } else if (showSuccessIcon) {
      setIsValid(text.trim().length > 0);
    }

    if (onChangeText) {
      onChangeText(text);
    }
  };

  const shouldShowSuccessIcon = showSuccessIcon && isValid && inputValue.trim().length > 0;
  const paddingLeft = leftIcon ? 45 : 16;
  const paddingRight = (rightIcon || shouldShowSuccessIcon) ? 45 : 16;

  return (
    <YStack gap="$2" {...containerProps}>
      {label ? (
        <Text fontSize={labelFontSize} color={labelColor} fontWeight="500">
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
          borderRadius="$4"
          paddingLeft={paddingLeft}
          paddingRight={paddingRight}
          placeholderTextColor="$light"
          keyboardType={keyboardType}
          focusStyle={{
            borderColor: '$medium',
            borderWidth: 1
          }}
          onChangeText={handleChangeText}
          {...inputProps}
        />

        {rightIcon && (
          <XStack
            position="absolute"
            right={12}
            top={0}
            bottom={0}
            alignItems="center"
            zIndex={1}
            pointerEvents="none"
          >
            {rightIcon}
          </XStack>
        )}
      </YStack>
    </YStack>
  );
}

export const LabelInput = memo(forwardRef(BaseLabelInput));
