import React, {forwardRef, memo, ReactNode, useEffect, useState} from 'react';
import {Input, InputProps, StackProps, Text, XStack, YStack} from 'tamagui';
import MaskInput, {Mask} from 'react-native-mask-input';
import {TextStyle} from 'react-native';

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
  mask?: Mask;
  useMask?: boolean;
};

const DATE_MASK: Mask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
};

const isValidDate = (date: string): boolean => {
  const numbers = date.replace(/\D/g, '');

  if (numbers.length !== 8) return false;

  const day = parseInt(numbers.slice(0, 2));
  const month = parseInt(numbers.slice(2, 4));
  const year = parseInt(numbers.slice(4, 8));

  if (day < 1 || day > 31) return false;
  if (month < 1 || month > 12) return false;
  if (year < 1900 || year > new Date().getFullYear()) return false;

  const dateObj = new Date(year, month - 1, day);
  return dateObj.getDate() === day &&
    dateObj.getMonth() === month - 1 &&
    dateObj.getFullYear() === year;
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
    onChangeText,
    keyboardType,
    value,
    mask,
    useMask = false,
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
      if (validationFn) {
        validation = validationFn(value);
      } else if (keyboardType === 'email-address') {
        validation = isValidEmail(value);
      } else if (useMask && placeholder === 'DD/MM/AAAA') {
        validation = isValidDate(value);
      } else if (showSuccessIcon) {
        validation = value.trim().length > 0;
      }

      setIsValid(validation);
    }
  }, [value, keyboardType, validationFn, showSuccessIcon, useMask, placeholder]);

  const handleChangeText = (text: string) => {
    setInputValue(text);

    let validation = false;
    if (validationFn) {
      validation = validationFn(text);
    } else if (keyboardType === 'email-address') {
      validation = isValidEmail(text);
    } else if (useMask && placeholder === 'DD/MM/AAAA') {
      validation = isValidDate(text);
    } else if (showSuccessIcon) {
      validation = text.trim().length > 0;
    }

    setIsValid(validation);

    if (onChangeText) {
      onChangeText(text);
    }
  };

  const handleMaskChangeText = (masked: string, unmasked: string) => {
    setInputValue(masked);

    let validation = false;
    if (validationFn) {
      validation = validationFn(masked);
    } else if (placeholder === 'DD/MM/AAAA') {
      validation = isValidDate(masked);
    } else if (showSuccessIcon) {
      validation = masked.trim().length > 0;
    }

    setIsValid(validation);

    if (onChangeText) {
      onChangeText(masked);
    }
  };

  const shouldShowSuccessIcon = showSuccessIcon && isValid && inputValue.trim().length > 0;
  const paddingLeft = leftIcon ? 45 : 16;
  const paddingRight = (rightIcon || shouldShowSuccessIcon) ? 45 : 16;

  const activeMask = mask || (placeholder === 'DD/MM/AAAA' ? DATE_MASK : undefined);

  const numericHeight = typeof height === 'number' ? height : 52;

  const inputStyle: TextStyle = {
    height: numericHeight,
    fontSize: 16,
    paddingLeft,
    paddingRight,
    backgroundColor: '#F3F4F6',
    color: '#1A1A1A',
    borderRadius: 12,
    borderWidth: 0,
    borderColor: 'transparent',
  };

  return (
    <YStack gap="$2" {...containerProps}>
      {label ? (
        <Text fontSize={labelFontSize} color="$absoluteTextPrimary" fontWeight="500">
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
            pointerEvents="none">
            {leftIcon}
          </XStack>
        )}

        {(useMask || activeMask) ? (
          <MaskInput
            ref={ref}
            value={inputValue}
            onChangeText={handleMaskChangeText}
            mask={activeMask}
            keyboardType={keyboardType}
            placeholder={placeholder}
            style={[inputStyle, inputProps.style]}
          />
        ) : (
          <Input
            ref={ref}
            height={height}
            fontSize={fontSize}
            backgroundColor="$lightest"
            placeholderTextColor="$absolutePlaceholder"
            color="$absoluteTextPrimary"
            borderRadius="$4"
            borderColor="transparent"
            paddingLeft={paddingLeft}
            paddingRight={paddingRight}
            keyboardType={keyboardType}
            value={inputValue}
            placeholder={placeholder}
            focusStyle={{
              borderColor: '$medium',
              borderWidth: 1
            }}
            onChangeText={handleChangeText}
            {...inputProps}
          />
        )}

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
