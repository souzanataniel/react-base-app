import React, {forwardRef, memo, useState} from 'react';
import {Eye, EyeOff} from '@tamagui/lucide-icons';
import {BaseInput, BaseInputProps} from './BaseInput';
import {XStack} from 'tamagui';

export const FormPasswordInput = memo(forwardRef<any, BaseInputProps>((props, ref) => {
  const [visible, setVisible] = useState(false);

  const ToggleIcon = (
    <XStack
      alignItems="center"
      justifyContent="center"
      width={32}
      height={32}
      borderRadius="$4"
      pressStyle={{opacity: 0.6}}
      hoverStyle={{backgroundColor: '$defaultSecondaryLabel'}}
      onPress={() => setVisible(v => !v)}
      cursor="pointer"
    >
      {visible ? (
        <EyeOff size={18} color="$defaultSecondaryLabel"/>
      ) : (
        <Eye size={18} color="$defaultSecondaryLabel"/>
      )}
    </XStack>
  );

  return (
    <BaseInput
      ref={ref}
      secureTextEntry={!visible}
      rightIcon={ToggleIcon}
      placeholder="Digite sua senha"
      // Cores específicas para senha (igual ao seu componente atual)
      backgroundColor="$defaultBackgroundInput"
      placeholderTextColor="$defaultPlaceholderText"
      textColor="$defaultLabel"
      {...props}
    />
  );
}));
