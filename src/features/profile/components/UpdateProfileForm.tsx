import React from 'react';
import {Text, YStack} from 'tamagui';
import {Calendar, CircleCheck, Phone, Type, User} from '@tamagui/lucide-icons';
import {LabelInput} from '@/shared/components/ui/Input/FormInput';
import {LoadingButton} from '@/shared/components';
import {PhoneInput} from '@/shared/components/ui/Input/BasePhoneInput';
import {COLORS} from '@/shared/constants/colors';

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
  // Props para mostrar sucesso na validação
  validFields?: {
    firstName?: boolean;
    lastName?: boolean;
    displayName?: boolean;
    phone?: boolean;
    dateOfBirth?: boolean;
  };
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
  } = props;

  return (
    <YStack gap="$4">
      <YStack gap="$2">

        <YStack gap="$1" marginBottom="$6" alignItems="center">
          <Text fontSize="$6" fontWeight="500" color="$absoluteTextSecondary" textAlign="center">
            Dados Pessoais
          </Text>
          <Text fontSize="$3" fontWeight="400" color="$absoluteTextTertiary" textAlign="center">
            Atualizar Dados Básicos do Usuário.
          </Text>
        </YStack>

        <LabelInput
          label="Nome"
          placeholder="Seu nome"
          value={firstName || ''}
          onChangeText={onFirstNameChange}
          onBlur={onBlurFirstName}
          leftIcon={<User size={20} color="$absoluteTextSecondary"/>}
          autoCapitalize="words"
          showSuccessIcon={validFields.firstName}
          rightIcon={<CircleCheck size={25} color="$lightest" fill={COLORS.DARK}/>}
        />

        <LabelInput
          label="Sobrenome"
          placeholder="Seu sobrenome"
          value={lastName || ''}
          onChangeText={onLastNameChange}
          onBlur={onBlurLastName}
          leftIcon={<User size={20} color="$absoluteTextSecondary"/>}
          autoCapitalize="words"
          showSuccessIcon={validFields.lastName}
          rightIcon={<CircleCheck size={25} color="$lightest" fill={COLORS.DARK}/>}
        />

        <LabelInput
          label="Nome de exibição"
          placeholder="Como você gostaria de ser chamado"
          value={displayName || ''}
          onChangeText={onDisplayNameChange}
          onBlur={onBlurDisplayName}
          leftIcon={<Type size={20} color="$absoluteTextSecondary"/>}
          autoCapitalize="words"
          showSuccessIcon={validFields.displayName}
          rightIcon={<CircleCheck size={25} color="$lightest" fill={COLORS.DARK}/>}
        />

        <PhoneInput
          label="Celular"
          leftIcon={<Phone size={20} color="$absoluteTextSecondary"/>}
          showSuccessIcon={validFields.phone}
          successIcon={<CircleCheck size={25} color="$lightest" fill={COLORS.DARK}/>}
          onChangeText={onPhoneChange}
          onBlur={onBlurPhone}
          value={phone || ''}
        />

        <LabelInput
          label="Data de nascimento"
          placeholder="DD/MM/AAAA"
          value={dateOfBirth || ''}
          onChangeText={onDateOfBirthChange}
          onBlur={onBlurDateOfBirth}
          leftIcon={<Calendar size={20} color="$absoluteTextSecondary"/>}
          keyboardType="numeric"
          showSuccessIcon={validFields.dateOfBirth}
          rightIcon={<CircleCheck size={25} color="$lightest" fill={COLORS.DARK}/>}
          maxLength={10}
        />
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
