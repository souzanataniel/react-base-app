import React, {createContext, useCallback, useContext, useState} from 'react';
import {Modal, Pressable, StyleSheet} from 'react-native';
import {Button, Text, XStack, YStack,} from 'tamagui';
import {useHaptic} from '@/shared/components/feedback/Haptic/HapticContext';

interface ConfirmOptions {
  title: string;
  description: string;
  cancelText?: string;
  cancelTextColor?: string;
  confirmText?: string;
  confirmTextColor?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
}

interface ConfirmContextData {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextData | undefined>(undefined);

export function ConfirmProvider({children}: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null);
  const {triggerHaptic} = useHaptic();

  const confirm = useCallback((opts: ConfirmOptions): Promise<boolean> => {
    setOptions(opts);
    setVisible(true);

    return new Promise<boolean>((resolve) => {
      setResolvePromise(() => resolve);
    });
  }, []);

  const handleCancel = useCallback(() => {
    triggerHaptic('light');
    options?.onCancel?.();
    setVisible(false);
    resolvePromise?.(false);
    setResolvePromise(null);
  }, [options, resolvePromise]);

  const handleConfirm = useCallback(async () => {
    triggerHaptic('light');
    await options?.onConfirm?.();
    setVisible(false);
    resolvePromise?.(true);
    setResolvePromise(null);
  }, [options, resolvePromise]);

  return (
    <ConfirmContext.Provider value={{confirm}}>
      {children}

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={handleCancel}
      >
        <Pressable
          style={styles.overlay}
          onPress={handleCancel}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <YStack
              backgroundColor="$background"
              borderRadius="$10"
              padding="$6"
              width={340}
              maxWidth="90%"
              elevation="$4"
              shadowColor="$shadowColor"
              shadowRadius={20}
              shadowOpacity={0.3}
              borderColor="$card"
              borderWidth="$1.5"
            >
              <YStack gap="$4">
                <Text
                  fontSize="$7"
                  fontWeight="600"
                  color="$color"
                  textAlign="left"
                >
                  {options?.title}
                </Text>

                <Text
                  fontSize="$4"
                  color="$colorSecondary"
                  textAlign="left"
                  lineHeight="$2"
                >
                  {options?.description}
                </Text>

                <XStack gap="$3" justifyContent="flex-end" marginTop="$2">
                  <Button
                    onPress={handleCancel}
                    backgroundColor="$grayButton"
                    borderRadius="$10"
                    paddingHorizontal="$5"
                    paddingVertical="$3"
                    flex={1}
                    pressStyle={{opacity: 0.7, scale: 0.98}}
                    borderWidth={0}
                  >
                    <Text
                      fontSize="$5"
                      fontWeight="600"
                      color={options?.cancelTextColor || '$defaultBlack'}
                    >
                      {options?.cancelText || 'Cancelar'}
                    </Text>
                  </Button>

                  <Button
                    onPress={handleConfirm}
                    backgroundColor="$grayButton"
                    color="$color"
                    borderRadius="$10"
                    paddingHorizontal="$5"
                    paddingVertical="$3"
                    flex={1}
                    pressStyle={{opacity: 0.7, scale: 0.98}}
                    borderWidth={0}
                  >
                    <Text
                      fontSize="$5"
                      fontWeight="600"
                      color={options?.confirmTextColor || '$color'}
                    >
                      {options?.confirmText || 'Confirmar'}
                    </Text>
                  </Button>
                </XStack>
              </YStack>
            </YStack>
          </Pressable>
        </Pressable>
      </Modal>
    </ConfirmContext.Provider>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export function useConfirm() {
  const context = useContext(ConfirmContext);

  if (!context) {
    throw new Error('useConfirm deve ser usado dentro de um ConfirmProvider');
  }

  return context;
}
