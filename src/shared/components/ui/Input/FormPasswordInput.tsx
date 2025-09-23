import React, {forwardRef, memo, useCallback, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Eye, EyeOff} from '@tamagui/lucide-icons';
import {BaseInput, BaseInputProps} from './BaseInput';
import {Text, XStack, YStack} from 'tamagui';

interface FormPasswordInputProps extends BaseInputProps {
  showSuccessIcon?: boolean;
  successIcon?: React.ReactNode;
}

export const FormPasswordInput = memo(forwardRef<any, FormPasswordInputProps>((props, ref) => {
  const [visible, setVisible] = useState(false);
  const {showSuccessIcon, successIcon, label, ...baseProps} = props;

  const handleToggleVisibility = useCallback(() => {
    setVisible(prev => !prev);
  }, []);

  return (
    <YStack gap="$2">
      {/* Renderizar label se existir */}
      {label && (
        <XStack>
          {typeof label === 'string' ? (
            <Text fontSize="$3" fontWeight="500" color="$gray12">
              {label}
            </Text>
          ) : (
            label
          )}
        </XStack>
      )}

      {/* Container com input e botão sobrepostos */}
      <View style={{position: 'relative'}}>
        <BaseInput
          ref={ref}
          secureTextEntry={!visible}
          placeholder="Digite sua senha"
          backgroundColor="$backgroundInput"
          placeholderTextColor="$placeholderText"
          textColor="$color"
          paddingRight={showSuccessIcon ? 80 : 50} // Espaço para o(s) ícone(s)
          {...baseProps}
        />

        {/* Ícones posicionados absolutamente */}
        <View style={{
          position: 'absolute',
          right: 8,
          top: 0,
          bottom: 0,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        }}>
          {/* Ícone de sucesso */}
          {showSuccessIcon && successIcon && (
            <View>
              {successIcon}
            </View>
          )}

          {/* Botão de toggle */}
          <TouchableOpacity
            onPress={handleToggleVisibility}
            activeOpacity={0.6}
            hitSlop={{top: 15, bottom: 15, left: 15, right: 15}}
            style={{
              padding: 8,
              justifyContent: 'center',
              alignItems: 'center',
              minWidth: 40,
              minHeight: 40,
            }}
          >
            {visible ? (
              <EyeOff size={20} color="#666"/>
            ) : (
              <Eye size={20} color="#666"/>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </YStack>
  );
}));
