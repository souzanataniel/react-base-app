import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {XStack, YStack} from 'tamagui';
import {AnimatedSaveButton} from '@/shared/components/ui/Button/AnimatedSaveButton';
import {Platform} from 'react-native';

interface BottomButtonContainerProps {
  onSave: () => Promise<void> | void;
  isLoading?: boolean;
  disabled?: boolean;
  loadingText?: string;
  saveText?: string;
  onError?: (error: Error) => void;
  customPaddingBottom?: number;
  buttonProps?: Partial<React.ComponentProps<typeof AnimatedSaveButton>>;
}

export const BottomButtonContainer: React.FC<BottomButtonContainerProps> = ({
                                                                              onSave,
                                                                              isLoading = false,
                                                                              disabled = false,
                                                                              loadingText,
                                                                              saveText,
                                                                              onError,
                                                                              customPaddingBottom,
                                                                              buttonProps = {},
                                                                            }) => {
  const insets = useSafeAreaInsets();

  const additionalPadding = Platform.select({ios: 0, android: 16, default: 0});
  const paddingBottom = customPaddingBottom ?? Math.max(insets.bottom, 16);


  return (
    <YStack
      position="absolute"
      bottom={0}
      left={0}
      right={0}
      paddingBottom={paddingBottom + additionalPadding}
      paddingHorizontal="$4"
    >
      <XStack
        justifyContent="center"
        alignItems="center"
        paddingHorizontal="$2"
        paddingTop="$2"
      >
        <AnimatedSaveButton
          onSave={onSave}
          isLoading={isLoading}
          disabled={disabled}
          loadingText={loadingText}
          saveText={saveText}
          onError={onError}
          {...buttonProps}
        />
      </XStack>
    </YStack>
  );
};

export const useBottomButtonHeight = (customPaddingBottom?: number) => {
  const insets = useSafeAreaInsets();

  const paddingBottom = customPaddingBottom ?? Math.max(insets.bottom, 16);
  const buttonHeight = 48;
  const paddingTop = 8;

  return paddingBottom + buttonHeight + paddingTop;
};

interface BottomButtonScrollContainerProps extends BottomButtonContainerProps {
  children: React.ReactNode;
}

export const BottomButtonScrollContainer: React.FC<BottomButtonScrollContainerProps> = ({
                                                                                          children,
                                                                                          customPaddingBottom,
                                                                                          ...buttonProps
                                                                                        }) => {
  const bottomButtonHeight = useBottomButtonHeight(customPaddingBottom);

  return (
    <YStack flex={1}>
      <YStack
        flex={1}
        paddingBottom={bottomButtonHeight}
      >
        {children}
      </YStack>

      <BottomButtonContainer
        customPaddingBottom={customPaddingBottom}
        {...buttonProps}
      />
    </YStack>
  );
};
