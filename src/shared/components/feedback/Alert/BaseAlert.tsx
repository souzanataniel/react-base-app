import React from 'react';
import {AlertDialog, Button, useTheme, useThemeName, XStack, YStack} from 'tamagui';
import {AlertTriangle, CheckCircle, Info, XCircle} from '@tamagui/lucide-icons';
import {BaseAlertProps} from './BaseAlert.types';
import {Keyboard, TouchableWithoutFeedback} from 'react-native';

export function BaseAlert({
                            open,
                            onOpenChange,
                            title,
                            description,
                            confirmText = 'OK',
                            cancelText = 'Cancelar',
                            onConfirm,
                            onCancel,
                            showCancel = false,
                            variant = 'info'
                          }: BaseAlertProps) {
  const theme = useTheme();
  const themeName = useThemeName();

  const handleConfirm = () => {
    onConfirm?.();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  // Configurações por variante
  const variantConfig = {
    success: {
      icon: CheckCircle,
      iconColor: theme.success?.get(),
      confirmButtonColor: theme.success?.get(),
    },
    error: {
      icon: XCircle,
      iconColor: theme.error?.get(),
      confirmButtonColor: theme.error?.get(),
    },
    warning: {
      icon: AlertTriangle,
      iconColor: theme.warning?.get(),
      confirmButtonColor: theme.warning?.get(),
    },
    info: {
      icon: Info,
      iconColor: theme.color?.get(),
      confirmButtonColor: theme.dark?.get(),
    },
  };

  const config = variantConfig[variant];
  const IconComponent = config.icon;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay
          key="overlay"
          animation="quick"
          backgroundColor={themeName === 'light' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.75)'}
          enterStyle={{opacity: 0}}
          exitStyle={{opacity: 0}}
        />

        <AlertDialog.Content
          key="content"
          animation={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{x: 0, y: -20, opacity: 0, scale: 0.95}}
          exitStyle={{x: 0, y: 10, opacity: 0, scale: 0.95}}
          backgroundColor="$background"
          borderRadius="$6"
          borderWidth={0}
          minWidth={280}
          maxWidth="85%"
          marginHorizontal="$4"
          shadowColor="$shadowColor"
          shadowOffset={{width: 0, height: 6}}
          shadowOpacity={0.12}
          shadowRadius={10}
          elevation={6}
        >
          <YStack gap="$3" padding="$4" alignItems="center">

            {/* Ícone */}
            <YStack
              backgroundColor="$backgroundHover"
              borderRadius="$10"
              padding="$2.5"
              alignItems="center"
              justifyContent="center"
            >
              <IconComponent
                size={32}
                color={config.iconColor}
                strokeWidth={2}
              />
            </YStack>

            {/* Título */}
            <AlertDialog.Title
              fontSize="$5"
              fontWeight="600"
              color="$color"
              textAlign="center"
              lineHeight="$5"
              marginTop="$1"
            >
              {title}
            </AlertDialog.Title>

            {/* Descrição */}
            {description && (
              <AlertDialog.Description
                fontSize="$3"
                color="$colorHover"
                lineHeight="$2"
                textAlign="center"
                maxWidth="260px"
                marginTop="-$1"
              >
                {description}
              </AlertDialog.Description>
            )}

            {/* Botões */}
            <XStack
              gap="$2.5"
              width="100%"
              marginTop="$2"
              flexDirection={showCancel ? 'row' : 'column'}
            >
              <AlertDialog.Action asChild>
                <Button
                  backgroundColor={config.confirmButtonColor}
                  color="$background"
                  onPress={handleConfirm}
                  borderRadius="$4"
                  height={48}
                  fontSize="$4"
                  fontWeight="600"
                  flex={showCancel ? 1 : undefined}
                  width={showCancel ? undefined : '100%'}
                  pressStyle={{
                    scale: 0.98,
                    opacity: 0.9,
                  }}
                >
                  {confirmText}
                </Button>
              </AlertDialog.Action>

              {showCancel && (
                <AlertDialog.Cancel asChild>
                  <Button
                    backgroundColor="transparent"
                    borderColor="$borderColor"
                    borderWidth={1}
                    color="$color"
                    onPress={handleCancel}
                    borderRadius="$4"
                    height={48}
                    fontSize="$4"
                    fontWeight="500"
                    flex={1}
                    pressStyle={{
                      scale: 0.98,
                      backgroundColor: '$backgroundHover',
                    }}
                  >
                    {cancelText}
                  </Button>
                </AlertDialog.Cancel>
              )}
            </XStack>

          </YStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
      </TouchableWithoutFeedback>
    </AlertDialog>
  );
}
