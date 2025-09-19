import React from 'react';
import {YStack} from 'tamagui';
import {CircleCheck} from '@tamagui/lucide-icons';
import {LabelInput} from '@/shared/components/ui/Input/FormInput';
import {LoadingButton} from '@/shared/components';
import {PhoneInput} from '@/shared/components/ui/Input/BasePhoneInput';

type UpdateProfileFormProps = {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  phone?: string;
  dateOfBirth?: string;
  onFirstNameChange: (v: string) => void;
  onLastNameChange: (v: string) => void;
  onDisplayNameChange: (v: string) => void;
  onPhoneChange: (v: string) => void;
  onDateOfBirthChange: (v: string) => void;
  onBlurFirstName?: () => void;
  onBlurLastName?: () => void;
  onBlurDisplayName?: () => void;
  onBlurPhone?: () => void;
  onBlurDateOfBirth?: () => void;
  canSubmit: boolean;
  isLoading: boolean;
  onSubmit: () => void;
  showSaveButton?: boolean;
  validFields?: {
    firstName?: boolean;
    lastName?: boolean;
    displayName?: boolean;
    phone?: boolean;
    dateOfBirth?: boolean;
  };
  // Props para controlar quais campos mostrar
  showOnlyPersonalInfo?: boolean;
  showOnlyContact?: boolean;
  showOnlyAdditional?: boolean;
};

export function UpdateProfileForm(props: UpdateProfileFormProps) {
  const {
    firstName,
    lastName,
    displayName,
    phone,
    dateOfBirth,
    onFirstNameChange,
    onLastNameChange,
    onDisplayNameChange,
    onPhoneChange,
    onDateOfBirthChange,
    onBlurFirstName,
    onBlurLastName,
    onBlurDisplayName,
    onBlurPhone,
    onBlurDateOfBirth,
    canSubmit,
    isLoading,
    onSubmit,
    showSaveButton = true,
    validFields = {},
    showOnlyPersonalInfo = false,
    showOnlyContact = false,
    showOnlyAdditional = false,
  } = props;

  // Se nenhuma flag específica está ativa, mostra todos os campos
  const showAll = !showOnlyPersonalInfo && !showOnlyContact && !showOnlyAdditional;

  return (
    <YStack flex={1}>
      <YStack gap="$2.5">
        {/* Campos de Informações Pessoais */}
        {(showAll || showOnlyPersonalInfo) && (
          <>
            <LabelInput
              label="Nome"
              placeholder="Seu nome"
              value={firstName || ''}
              onChangeText={onFirstNameChange}
              onBlur={onBlurFirstName}
              autoCapitalize="words"
              showSuccessIcon={validFields.firstName}
              rightIcon={<CircleCheck size={20} color="$defaultPrimary"/>}
            />

            <LabelInput
              label="Sobrenome"
              placeholder="Seu sobrenome"
              value={lastName || ''}
              onChangeText={onLastNameChange}
              onBlur={onBlurLastName}
              autoCapitalize="words"
              showSuccessIcon={validFields.lastName}
              rightIcon={<CircleCheck size={20} color="$defaultPrimary"/>}
            />

            <LabelInput
              label="Nome de exibição"
              placeholder="Como você gostaria de ser chamado"
              value={displayName || ''}
              onChangeText={onDisplayNameChange}
              onBlur={onBlurDisplayName}
              autoCapitalize="words"
              showSuccessIcon={validFields.displayName}
              rightIcon={<CircleCheck size={20} color="$defaultPrimary"/>}
            />
          </>
        )}

        {/* Campo de Contato */}
        {(showAll || showOnlyContact) && (
          <PhoneInput
            label="Celular"
            showSuccessIcon={validFields.phone}
            successIcon={<CircleCheck size={20} color="$defaultPrimary"/>}
            onChangeText={onPhoneChange}
            onBlur={onBlurPhone}
            value={phone || ''}
          />
        )}

        {/* Campo de Informações Adicionais */}
        {(showAll || showOnlyAdditional) && (
          <LabelInput
            label="Data de nascimento"
            placeholder="DD/MM/AAAA"
            value={dateOfBirth || ''}
            onChangeText={onDateOfBirthChange}
            onBlur={onBlurDateOfBirth}
            keyboardType="numeric"
            showSuccessIcon={validFields.dateOfBirth}
            rightIcon={<CircleCheck size={20} color="$defaultPrimary"/>}
            maxLength={10}
          />
        )}
      </YStack>

      {showSaveButton && (
        <YStack gap="$2" marginTop="$4">
          <LoadingButton
            loading={isLoading}
            loadingText="Atualizando..."
            onPress={onSubmit}
            disabled={!canSubmit || isLoading}
            height={52}
            fontSize="$4"
            fontWeight="600"
            hapticType="medium"
          >
            Salvar alterações
          </LoadingButton>
        </YStack>
      )}
    </YStack>
  );
}
