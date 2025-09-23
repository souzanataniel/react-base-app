import React, {useCallback, useMemo} from 'react';
import {Text, YStack} from 'tamagui';
import {router} from 'expo-router';
import {CardTitle} from '@/shared/components/ui/Cards/CardTitle';
import {Lock} from '@tamagui/lucide-icons';
import {ScreenWithBlurHeader} from '@/shared/components/layout/ScreenWithBlurHeader';
import {FormPasswordInput} from '@/shared/components/ui/Input/FormPasswordInput';
import {useGlobalAlert} from '@/shared/components/feedback/CustomAlert/CustomAlert';
import {useUpdatePassword} from '@/features/auth/hooks/useUpdatePassword';
import {PasswordStrengthIndicator} from '@/shared/components/ui/PasswordIndicator/PasswordStrengthIndicator';
import {BottomButtonContainer} from '@/shared/components/ui/BottomButton/BottomButtonContainer';

interface PasswordField {
  name: 'currentPassword' | 'newPassword' | 'confirmPassword';
  label: string;
  placeholder: string;
}

const PASSWORD_FIELDS: PasswordField[] = [
  {
    name: 'currentPassword',
    label: 'Senha Atual',
    placeholder: 'Digite sua senha atual'
  },
  {
    name: 'newPassword',
    label: 'Nova Senha',
    placeholder: 'Digite sua nova senha'
  },
  {
    name: 'confirmPassword',
    label: 'Confirme a Nova Senha',
    placeholder: 'Confirme sua nova senha'
  }
];

export const UpdatePasswordScreen = () => {
  const {showSuccess, showError, showWarning, showInfo} = useGlobalAlert();

  const {
    currentPassword,
    newPassword,
    confirmPassword,
    isLoading,
    error,
    updateCurrentPassword,
    updateNewPassword,
    updateConfirmPassword,
    submit,
    canSubmit,
    clearError,
    reset
  } = useUpdatePassword();

  // Validação para verificar se as senhas são iguais
  const passwordsMatch = useMemo(() => {
    if (!newPassword || !confirmPassword) return null; // Não mostra erro se um dos campos está vazio
    return newPassword === confirmPassword;
  }, [newPassword, confirmPassword]);

  const getFieldValue = useCallback((fieldName: PasswordField['name']) => {
    switch (fieldName) {
      case 'currentPassword':
        return currentPassword;
      case 'newPassword':
        return newPassword;
      case 'confirmPassword':
        return confirmPassword;
      default:
        return '';
    }
  }, [currentPassword, newPassword, confirmPassword]);

  const getFieldHandler = useCallback((fieldName: PasswordField['name']) => {
    switch (fieldName) {
      case 'currentPassword':
        return updateCurrentPassword;
      case 'newPassword':
        return updateNewPassword;
      case 'confirmPassword':
        return updateConfirmPassword;
      default:
        return () => {};
    }
  }, [updateCurrentPassword, updateNewPassword, updateConfirmPassword]);

  const handleSave = useCallback(async () => {
    if (isLoading || !canSubmit) return;

    if (passwordsMatch === false) {
      showError('Erro', 'As senhas não coincidem. Verifique e tente novamente.');
      return;
    }

    clearError();

    try {
      const result = await submit();

      if (result.success) {
        showSuccess('Sucesso', result.message);
      } else {
        showError('Erro', result.message);
      }
    } catch (error) {
      console.error('Erro inesperado:', error);
      showError('Erro', 'Erro inesperado ao atualizar senha. Tente novamente.');
    }
  }, [isLoading, canSubmit, submit, showSuccess, showError, clearError, passwordsMatch]);

  const renderPasswordField = useCallback((field: PasswordField) => {
    const value = getFieldValue(field.name);
    const handler = getFieldHandler(field.name);

    return (
      <FormPasswordInput
        key={field.name}
        label={field.label}
        placeholder={field.placeholder}
        value={value}
        onChangeText={handler}
        showSuccessIcon={false}
        disabled={isLoading}
      />
    );
  }, [getFieldValue, getFieldHandler, isLoading, passwordsMatch]);

  return (
    <YStack flex={1}>
      <ScreenWithBlurHeader
        title="Alterar Senha"
        onBack={() => router.push('/(app)/profile')}
        hasKeyboardInputs={true}
        hasTabBar={false}
      >
        <YStack paddingHorizontal="$4" paddingVertical="$4" gap="$4">
          <CardTitle
            icon={<Lock size={24} color="white"/>}
            title="Alterar Senha"
            description="Atualize sua senha de acesso"
          />

          <YStack gap="$2">
            <Text fontSize="$2" fontWeight="600" color="$color" paddingLeft="$2">
              Atualizar Senha
            </Text>
            <YStack backgroundColor="$card" borderRadius="$3" padding="$3" gap="$2.5">
              {PASSWORD_FIELDS.map(renderPasswordField)}

              {newPassword.length > 0 && (
                <PasswordStrengthIndicator
                  password={newPassword}
                  showRequirements={false}
                  marginTop="$2"
                  paddingHorizontal="$0"
                />
              )}

              {passwordsMatch === false && (
                <YStack marginTop="$1" paddingHorizontal="$2">
                  <Text fontSize="$1" color="$red10" fontWeight="500">
                    ⚠️ As senhas não coincidem
                  </Text>
                </YStack>
              )}

            </YStack>
          </YStack>
        </YStack>
      </ScreenWithBlurHeader>

      <BottomButtonContainer
        onSave={handleSave}
        isLoading={isLoading}
        saveText="Salvar Alterações"
        disabled={!canSubmit || passwordsMatch === false}
      />
    </YStack>
  );
};
