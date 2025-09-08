import React, {forwardRef, memo, ReactNode, useState} from 'react';
import {Input, InputProps, StackProps, Text, XStack, YStack} from 'tamagui';

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
};

function BaseLabelInput(
  {
    label,
    containerProps,
    labelFontSize = '$4',
    labelColor = '$color',
    leftIcon,
    rightIcon,
    showSuccessIcon = false,
    successIcon,
    validationFn,
    height = 50,
    fontSize = '$4',
    backgroundColor = 'transparent',
    borderColor = '$gray7',
    borderWidth = 1,
    onChangeText,
    ...inputProps
  }: LabelInputProps,
  ref: React.Ref<any>
) {
  const [inputValue, setInputValue] = useState(inputProps.value || '');
  const [isValid, setIsValid] = useState(false);

  const handleChangeText = (text: string) => {
    setInputValue(text);

    if (validationFn) {
      setIsValid(validationFn(text));
    } else if (showSuccessIcon) {
      setIsValid(text.trim().length > 0);
    }

    if (onChangeText) {
      onChangeText(text);
    }
  };

  const shouldShowSuccessIcon = showSuccessIcon && isValid && inputValue.trim().length > 0;
  const paddingLeft = leftIcon ? 45 : 15;
  const paddingRight = (rightIcon || shouldShowSuccessIcon) ? 45 : 15;

  return (
    <YStack gap="$2" {...containerProps}>
      {label ? (
        <Text fontSize={labelFontSize} color={labelColor} fontWeight="$6">
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

        <Input
          ref={ref}
          height={height}
          fontSize={fontSize}
          backgroundColor={backgroundColor}
          borderColor={borderColor}
          borderWidth={borderWidth}
          paddingLeft={paddingLeft}
          paddingRight={paddingRight}
          focusStyle={{
            borderColor,
            borderWidth: (borderWidth as number) + 1
          }}
          onChangeText={handleChangeText}
          {...inputProps}
        />

        {(rightIcon || shouldShowSuccessIcon) && (
          <XStack
            position="absolute"
            right={12}
            top={0}
            bottom={0}
            alignItems="center"
            zIndex={1}
            pointerEvents="none"
          >
            {shouldShowSuccessIcon ? (
              successIcon || (
                <Text color="$green10" fontSize="$5">
                  ✓
                </Text>
              )
            ) : (
              rightIcon
            )}
          </XStack>
        )}
      </YStack>
    </YStack>
  );
}

export const LabelInput = memo(forwardRef(BaseLabelInput));
