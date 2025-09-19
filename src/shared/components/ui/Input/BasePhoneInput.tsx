import React, {forwardRef, memo, ReactNode, useEffect, useState} from 'react';
import {InputProps, StackProps, Text, useTheme, XStack, YStack} from 'tamagui';
import MaskInput from 'react-native-mask-input';
import {TextStyle} from 'react-native';

type PhoneInputProps = Omit<InputProps, 'keyboardType' | 'maxLength'> & {
  label?: ReactNode;
  containerProps?: StackProps;
  labelFontSize?: InputProps['fontSize'];
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  showSuccessIcon?: boolean;
  successIcon?: ReactNode;
  validationFn?: (value: string) => boolean;
};

// Máscara para telefone brasileiro: (XX) X XXXX-XXXX
const PHONE_MASK = [
  '(',
  /\d/,
  /\d/,
  ')',
  ' ',
  /\d/,
  ' ',
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  '-',
  /\d/,
  /\d/,
  /\d/,
  /\d/,
];

const isValidPhone = (phone: string): boolean => {
  const numbers = phone.replace(/\D/g, '');

  if (numbers.length < 10 || numbers.length > 11) return false;
  if (numbers.length === 11 && numbers[2] !== '9') return false;
  if (new Set(numbers).size === 1) return false;

  return true;
};

function BasePhoneInput(
  {
    label,
    containerProps,
    labelFontSize = '$4',
    leftIcon,
    rightIcon,
    showSuccessIcon = false,
    successIcon,
    validationFn,
    height = 52,
    fontSize = '$4',
    onChangeText,
    placeholder = '(11) 9 1234-5678',
    value,
    ...inputProps
  }: PhoneInputProps,
  ref: React.Ref<any>
) {
  const theme = useTheme();
  const [inputValue, setInputValue] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (value !== undefined && value !== inputValue) {
      setInputValue(value);
      const validation = validationFn ? validationFn(value) : isValidPhone(value);
      setIsValid(validation);
    }
  }, [value, validationFn, inputValue]);

  const handleChangeText = (masked: string, unmasked: string) => {
    setInputValue(masked);
    const validation = validationFn ? validationFn(masked) : isValidPhone(masked);
    setIsValid(validation);
    onChangeText?.(masked);
  };

  const shouldShowSuccessIcon = showSuccessIcon && isValid && inputValue.trim().length > 0;
  const paddingLeft = leftIcon ? 45 : 16;
  const paddingRight = (rightIcon || shouldShowSuccessIcon) ? 45 : 16;

  const inputStyle: TextStyle = {
    height: typeof height === 'number' ? height : 52,
    fontSize: 14,
    paddingLeft,
    paddingRight,
    backgroundColor: theme.backgroundInput?.get() || '#F9F9F9',
    color: theme.color?.get() || '#000000',
    borderRadius: 12,
    borderWidth: isFocused ? 1 : 0,
    borderColor: isFocused ? (theme.borderColor?.get() || 'rgba(60, 60, 67, 0.18)') : 'transparent',
  };

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

        <MaskInput
          ref={ref}
          value={inputValue}
          onChangeText={handleChangeText}
          mask={PHONE_MASK}
          keyboardType="phone-pad"
          placeholder={placeholder}
          placeholderTextColor={theme.placeholderTex?.get() || '#999999'}
          style={inputStyle}
          onFocus={(e) => {
            setIsFocused(true);
            inputProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            inputProps.onBlur?.(e);
          }}
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

export const PhoneInput = memo(forwardRef(BasePhoneInput));
