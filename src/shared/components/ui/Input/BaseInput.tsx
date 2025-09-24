// BaseInput.tsx - USANDO DISABLED STYLE DO TAMAGUI
import React, {forwardRef, memo, ReactNode, useEffect, useState} from 'react';
import {Input, InputProps, StackProps, Text, XStack, YStack} from 'tamagui';

export interface BaseInputProps extends Omit<InputProps, 'onChangeText'> {
  // Props básicas do layout
  label?: ReactNode;
  containerProps?: StackProps;
  labelFontSize?: InputProps['fontSize'];
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;

  // Props de validação e sucesso
  showSuccessIcon?: boolean;
  successIcon?: ReactNode;
  validationFn?: (value: string) => boolean;

  // Props de customização
  onChangeText?: (text: string) => void;
  renderInput?: (props: any) => ReactNode;

  // Props específicas que podem ser sobrescritas
  backgroundColor?: string;
  placeholderTextColor?: string;
  textColor?: string;

  // Customização para disabled
  disabledStyle?: InputProps['disabledStyle'];
}

function BaseInputComponent(
  {
    // Layout props
    label,
    containerProps,
    labelFontSize = '$4',
    leftIcon,
    rightIcon,

    // Validação props
    showSuccessIcon = false,
    successIcon,
    validationFn,

    // Input props
    height = 52,
    fontSize = '$4',
    onChangeText,
    value,
    renderInput,
    disabled = false,

    // Cores customizáveis
    backgroundColor = '$backgroundInput',
    placeholderTextColor = '$placeholderText',
    textColor = '$color',

    // Estilo disabled customizado
    disabledStyle,

    ...inputProps
  }: BaseInputProps,
  ref: React.Ref<any>
) {
  const [inputValue, setInputValue] = useState(value || '');

  // Função de validação
  const validateValue = (text: string) => {
    if (validationFn) {
      return validationFn(text);
    } else {
      return text.trim().length > 0;
    }
  };

  const isValid = validateValue(inputValue);

  useEffect(() => {
    if (value !== undefined) {
      setInputValue(value);
    }
  }, [value]);

  const handleChangeText = (text: string) => {
    setInputValue(text);
    onChangeText?.(text);
  };

  // Cálculos de layout
  const shouldShowSuccessIcon = showSuccessIcon && isValid && inputValue.trim().length > 0 && !disabled;
  const paddingLeft = leftIcon ? 45 : 16;
  const paddingRight = (rightIcon || shouldShowSuccessIcon) ? 45 : 16;

  // Estilo disabled padrão
  const defaultDisabledStyle = {
    backgroundColor: '$gray4',
    color: '$gray9',
    opacity: 0.6,
    cursor: 'not-allowed',
    ...disabledStyle
  };

  // Props padrão para todos os inputs
  const defaultInputProps = {
    ref,
    height,
    fontSize,
    backgroundColor,
    placeholderTextColor,
    color: textColor,
    borderRadius: '$4',
    borderColor: 'transparent',
    paddingLeft,
    paddingRight,
    value: inputValue,
    disabled,
    disabledStyle: defaultDisabledStyle,
    focusStyle: {
      borderColor: '$defaultQuaternaryLabel',
      borderWidth: 1
    },
    onChangeText: handleChangeText,
    ...inputProps
  };

  return (
    <YStack gap="$2" {...containerProps}>
      {label ? (
        <Text
          fontSize={labelFontSize}
          color={disabled ? '$gray9' : textColor}
          fontWeight="500"
          opacity={disabled ? 0.6 : 1}
        >
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
            opacity={disabled ? 0.4 : 1}
          >
            {leftIcon}
          </XStack>
        )}

        {renderInput ? renderInput(defaultInputProps) : <Input {...defaultInputProps} />}

        {rightIcon && isValid && !disabled && (
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

export const BaseInput = memo(forwardRef(BaseInputComponent));
