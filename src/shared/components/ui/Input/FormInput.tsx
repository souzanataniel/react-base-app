import React, {forwardRef, memo, ReactNode, useEffect, useState} from 'react';
import {Input, InputProps, StackProps, Text, XStack, YStack} from 'tamagui';

type LabelInputProps = InputProps & {
  label?: ReactNode;
  containerProps?: StackProps;
  labelFontSize?: InputProps['fontSize'];
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  showSuccessIcon?: boolean;
  successIcon?: ReactNode;
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
    leftIcon,
    rightIcon,
    showSuccessIcon = false,
    successIcon,
    height = 52,
    fontSize = '$4',
    onChangeText,
    keyboardType,
    value,
    placeholder,
    ...inputProps
  }: LabelInputProps,
  ref: React.Ref<any>
) {
  const [inputValue, setInputValue] = useState('');
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (value !== undefined) {
      setInputValue(value);

      let validation = false;
      if (keyboardType === 'email-address') {
        validation = isValidEmail(value);
      } else if (showSuccessIcon) {
        validation = value.trim().length > 0;
      }

      setIsValid(validation);
    }
  }, [value, keyboardType, showSuccessIcon]);

  const handleChangeText = (text: string) => {
    setInputValue(text);

    let validation = false;
    if (keyboardType === 'email-address') {
      validation = isValidEmail(text);
    } else if (showSuccessIcon) {
      validation = text.trim().length > 0;
    }

    setIsValid(validation);
    onChangeText?.(text);
  };

  const shouldShowSuccessIcon = showSuccessIcon && isValid && inputValue.trim().length > 0;
  const paddingLeft = leftIcon ? 45 : 16;
  const paddingRight = (rightIcon || shouldShowSuccessIcon) ? 45 : 16;

  return (
    <YStack gap="$2" {...containerProps}>
      {label ? (
        <Text fontSize={labelFontSize} color="$color" fontWeight="500">
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
          backgroundColor="$backgroundInput"
          placeholderTextColor="$placeholderText"
          color="$color"
          borderRadius="$4"
          borderColor="transparent"
          paddingLeft={paddingLeft}
          paddingRight={paddingRight}
          keyboardType={keyboardType}
          value={inputValue}
          placeholder={placeholder}
          focusStyle={{
            borderColor: '$defaultQuaternaryLabel',
            borderWidth: 1
          }}
          onChangeText={handleChangeText}
          {...inputProps}
        />

        {rightIcon && isValid && (
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

        {shouldShowSuccessIcon && !rightIcon && (
          <XStack
            position="absolute"
            right={12}
            top={0}
            bottom={0}
            alignItems="center"
            zIndex={1}
            pointerEvents="none"
          >
            {successIcon}
          </XStack>
        )}
      </YStack>
    </YStack>
  );
}

export const LabelInput = memo(forwardRef(BaseLabelInput));
