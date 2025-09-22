import React, {forwardRef, memo} from 'react';
import {BaseInput, BaseInputProps} from './BaseInput';

export const FormInput = memo(forwardRef<any, BaseInputProps>((props, ref) => (
  <BaseInput
    ref={ref}
    {...props}
    disabledStyle={{
      backgroundColor: '#FFF',
      color: '#000',
    }}/>
)));
