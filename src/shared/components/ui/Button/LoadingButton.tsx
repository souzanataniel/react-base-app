import React from 'react';
import type {ButtonProps} from 'tamagui';
import {Button, Spinner, Text, XStack} from 'tamagui';

interface LoadingButtonProps extends Omit<ButtonProps, 'children'> {
  loading?: boolean;
  children: string;
  loadingText?: string;
  loadingColor?: string;
  spinnerSize?: 'small' | 'large';
}

export const LoadingButton = ({
                                loading = false,
                                children,
                                loadingText,
                                loadingColor = '$white',
                                spinnerSize = 'small',
                                disabled,
                                backgroundColor = '$dark',
                                color = 'white',
                                size = '$5',
                                borderRadius = '$6',
                                fontWeight = '600',
                                pressStyle = {
                                  scale: 0.98,
                                  backgroundColor: '$dark'
                                },
                                marginTop = '$4',
                                ...props
                              }: LoadingButtonProps) => {
  return (
    <Button
      backgroundColor={backgroundColor}
      color={color}
      size={size}
      borderRadius={borderRadius}
      fontWeight={fontWeight}
      pressStyle={pressStyle}
      marginTop={marginTop}
      disabled={disabled || loading}
      opacity={loading ? 0.8 : 1}
      {...props}
    >
      {loading ? (
        <XStack alignItems="center" gap="$2">
          <Spinner size={spinnerSize} color={loadingColor}/>
          <Text color={loadingColor} lineHeight={20}>
            {loadingText || children}
          </Text>
        </XStack>
      ) : (
        <Text color={color} fontWeight="bold" lineHeight={20}>
          {children}
        </Text>
      )}
    </Button>
  );
};
