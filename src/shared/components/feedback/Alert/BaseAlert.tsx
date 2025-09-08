import React from 'react';
import {AlertDialog, Button, XStack, YStack} from 'tamagui';
import {BaseAlertProps} from './BaseAlert.types';

export function BaseAlert({
                            open,
                            onOpenChange,
                            title,
                            description,
                            confirmText = 'OK',
                            cancelText = 'Cancelar',
                            onConfirm,
                            onCancel,
                            type = 'info',
                            showCancel = false
                          }: BaseAlertProps) {

  const handleConfirm = () => {
    onConfirm?.();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.8}
          enterStyle={{opacity: 0}}
          exitStyle={{opacity: 0}}
        />

        <AlertDialog.Content
          bordered
          elevate
          key="content"
          animation={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{x: 0, y: -20, opacity: 0, scale: 0.9}}
          exitStyle={{x: 0, y: 10, opacity: 0, scale: 0.95}}
          backgroundColor="$darkGray"
          minWidth={280}
          maxWidth="90%"
          marginHorizontal="$2"
          width="auto"
        >
          <YStack gap="$4" padding="$4" paddingTop="$0" alignItems="center">
            <AlertDialog.Title
              fontSize="$6"
              fontWeight="bold"
              color="$white"
              flexWrap="wrap"
            >
              {title}
            </AlertDialog.Title>

            {description && (
              <AlertDialog.Description
                fontSize="$4"
                color="$white"
                lineHeight={20}
                flexWrap="wrap"
              >
                {description}
              </AlertDialog.Description>
            )}

            {/* Botões */}
            <XStack gap="$3" justifyContent="flex-end">
              {showCancel && (
                <AlertDialog.Cancel asChild>
                  <Button
                    variant="outlined"
                    onPress={handleCancel}
                    flex={1}
                  >
                    {cancelText}
                  </Button>
                </AlertDialog.Cancel>
              )}

              <AlertDialog.Action asChild>
                <Button
                  backgroundColor="$darkGrey"
                  onPress={handleConfirm}
                  flex={1}
                >
                  {confirmText}
                </Button>
              </AlertDialog.Action>
            </XStack>

          </YStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
}
