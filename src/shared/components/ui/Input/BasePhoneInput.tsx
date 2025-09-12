import React, {forwardRef, memo, ReactNode, useState} from 'react';
import {Input, InputProps, StackProps, Text, XStack, YStack} from 'tamagui';

type PhoneInputProps = Omit<InputProps, 'keyboardType' | 'maxLength'> & {
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

// Lista de DDDs válidos no Brasil
const VALID_DDDS = new Set([
  '11', '12', '13', '14', '15', '16', '17', '18', '19', // São Paulo
  '21', '22', '24', // Rio de Janeiro
  '27', '28', // Espírito Santo
  '31', '32', '33', '34', '35', '37', '38', // Minas Gerais
  '41', '42', '43', '44', '45', '46', // Paraná
  '47', '48', '49', // Santa Catarina
  '51', '53', '54', '55', // Rio Grande do Sul
  '61', // Distrito Federal
  '62', '64', // Goiás
  '63', // Tocantins
  '65', '66', // Mato Grosso
  '67', // Mato Grosso do Sul
  '68', // Acre
  '69', // Rondônia
  '71', '73', '74', '75', '77', // Bahia
  '79', // Sergipe
  '81', '87', // Pernambuco
  '82', // Alagoas
  '83', // Paraíba
  '84', // Rio Grande do Norte
  '85', '88', // Ceará
  '86', '89', // Piauí
  '91', '93', '94', // Pará
  '92', '97', // Amazonas
  '95', // Roraima
  '96', // Amapá
  '98', '99', // Maranhão
]);

const formatPhoneNumber = (value: string): string => {
  // Remove todos os caracteres não numéricos
  const numbers = value.replace(/\D/g, '');

  // Limita a 11 dígitos (DDD + 9 dígitos do celular)
  const limitedNumbers = numbers.slice(0, 11);

  // Aplica a formatação baseada na quantidade de dígitos
  if (limitedNumbers.length <= 2) {
    return limitedNumbers;
  } else if (limitedNumbers.length <= 3) {
    return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2)}`;
  } else if (limitedNumbers.length <= 7) {
    return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2, 3)} ${limitedNumbers.slice(3)}`;
  } else {
    return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2, 3)} ${limitedNumbers.slice(3, 7)}-${limitedNumbers.slice(7)}`;
  }
};

const isValidPhone = (phone: string): boolean => {
  const numbers = phone.replace(/\D/g, '');

  // Deve ter exatamente 11 dígitos
  if (numbers.length !== 11) return false;

  // DDD deve ser válido
  const ddd = numbers.slice(0, 2);
  if (!VALID_DDDS.has(ddd)) return false;

  // O primeiro dígito do número deve ser 9 (celular)
  const firstDigit = numbers[2];
  if (firstDigit !== '9') return false;

  // Não pode ter todos os dígitos iguais
  if (new Set(numbers).size === 1) return false;

  return true;
};

function BasePhoneInput(
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
    backgroundColor = '$baseBackground',
    borderColor = 'transparent',
    borderWidth = 0,
    onChangeText,
    placeholder = '(11) 9 1234-5678',
    ...inputProps
  }: PhoneInputProps,
  ref: React.Ref<any>
) {
  const [inputValue, setInputValue] = useState(inputProps.value || '');
  const [isValid, setIsValid] = useState(false);

  const handleChangeText = (text: string) => {
    const formatted = formatPhoneNumber(text);
    setInputValue(formatted);

    // Usa a função de validação customizada se fornecida, senão usa a validação padrão
    if (validationFn) {
      setIsValid(validationFn(formatted));
    } else {
      setIsValid(isValidPhone(formatted));
    }

    if (onChangeText) {
      onChangeText(formatted);
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
            pointerEvents="none">
            {leftIcon}
          </XStack>
        )}

        <Input
          ref={ref}
          height={height}
          fontSize={fontSize}
          borderWidth={borderWidth}
          paddingLeft={paddingLeft}
          paddingRight={paddingRight}
          keyboardType="phone-pad"
          backgroundColor="$lightest"
          placeholderTextColor="$absolutePlaceholder"
          color="$absoluteTextPrimary"
          borderRadius="$4"
          borderColor="transparent"
          maxLength={16}
          placeholder={placeholder}
          value={inputValue}
          focusStyle={{
            borderColor: '$medium',
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

export const PhoneInput = memo(forwardRef(BasePhoneInput));
