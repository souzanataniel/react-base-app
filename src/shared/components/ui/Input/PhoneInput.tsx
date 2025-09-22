import React, {forwardRef, memo} from 'react';
import MaskInput from 'react-native-mask-input';
import {BaseInput, BaseInputProps} from './BaseInput';

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

export const PhoneInput = memo(forwardRef<any, BaseInputProps>((props, ref) => (
  <BaseInput
    ref={ref}
    validationFn={isValidPhone}
    placeholder="(11) 9 1234-5678"
    renderInput={(inputProps) => (
      <MaskInput
        {...inputProps}
        mask={PHONE_MASK}
        keyboardType="phone-pad"
      />
    )}
    {...props}
  />
)));
