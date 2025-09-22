import {BaseInput, BaseInputProps} from '@/shared/components/ui/Input/BaseInput';
import {forwardRef, memo} from 'react';

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
};

export const EmailInput = memo(forwardRef<any, BaseInputProps>((props, ref) => (
  <BaseInput
    ref={ref}
    autoCorrect={false}
    spellCheck={false}
    keyboardType="email-address"
    validationFn={isValidEmail}
    placeholder="Digite seu email"
    {...props}
  />
)));
