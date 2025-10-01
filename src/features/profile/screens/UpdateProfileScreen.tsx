import {useAuth} from '@/features/auth/hooks/useAuth';
import React, {useCallback, useMemo, useState} from 'react';
import {Progress, Text, XStack, YStack} from 'tamagui';
import {router, useFocusEffect} from 'expo-router';
import {UpdateProfileFormData, updateProfileSchema} from '@/features/profile/schema/updateProfileSchema';
import {CardTitle} from '@/shared/components/ui/Cards/CardTitle';
import {CircleCheck, User} from '@tamagui/lucide-icons';
import {ScreenWithHeader} from '@/shared/components/layout/ScreenWithHeader';
import {FormInput} from '@/shared/components/ui/Input/FormInput';
import {PhoneInput} from '@/shared/components/ui/Input/BasePhoneInput';
import {DateInput} from '@/shared/components/ui/Input/DateInput';
import {ZodError} from 'zod';
import {dateMasks} from '@/shared/utils/masks';
import {updateProfile} from '@/features/profile/services/updateProfileService';
import {AnimatedSaveButton} from '@/shared/components/ui/Button/AnimatedSaveButton';
import {useGlobalAlert} from '@/shared/components/feedback/BaseAlert/BaseAlert';

type FieldType = 'text' | 'phone' | 'date';

interface Field {
  name: keyof UpdateProfileFormData;
  label: string;
  placeholder?: string;
  type?: FieldType;
  mask?: (v: string) => string;
  keyboardType?: 'default' | 'numeric' | 'phone-pad' | 'email-address';
  maxLength?: number;
}

interface Section {
  title: string;
  fields: Field[];
}

const FORM_SECTIONS: Record<string, Section> = {
  personal: {
    title: 'Informações Pessoais',
    fields: [
      {name: 'firstName', label: 'Nome', placeholder: 'Seu nome', type: 'text'},
      {name: 'lastName', label: 'Sobrenome', placeholder: 'Seu sobrenome', type: 'text'},
      {name: 'displayName', label: 'Nome de exibição', placeholder: 'Como você gostaria de ser chamado', type: 'text'},
    ]
  },
  contact: {
    title: 'Contato',
    fields: [
      {name: 'phone', label: 'Celular', type: 'phone'},
    ]
  },
  additional: {
    title: 'Informações Adicionais',
    fields: [
      {
        name: 'dateOfBirth',
        label: 'Data de nascimento',
        placeholder: 'DD/MM/AAAA',
        type: 'date',
        mask: dateMasks.date,
        keyboardType: 'numeric',
        maxLength: 10
      },
    ]
  }
};

export const UpdateProfileScreen = () => {
  const {user, setUser} = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [validFields, setValidFields] = useState<Record<string, boolean>>({});
  const {showSuccess, showError, showWarning} = useGlobalAlert();

  const [formData, setFormData] = useState<UpdateProfileFormData>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    displayName: user?.displayName || '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth || '',
  });

  const profileProgress = useMemo(() => {
    const values = Object.values(formData);
    const filled = values.filter(v => v && v.trim() !== '').length;
    return Math.round((filled / values.length) * 100);
  }, [formData]);

  useFocusEffect(
    useCallback(() => {
      setFormData({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        displayName: user?.displayName || '',
        phone: user?.phone || '',
        dateOfBirth: user?.dateOfBirth || '',
      });
      setValidFields({});
    }, [user])
  );

  const handleChange = useCallback((field: keyof UpdateProfileFormData, mask?: (v: string) => string) => {
    return (value: string) => {
      const processedValue = mask ? mask(value) : value;
      setFormData(prev => ({...prev, [field]: processedValue}));
    };
  }, []);

  const validateField = useCallback((field: keyof UpdateProfileFormData, value: string | undefined | '') => {
    try {
      const schema = updateProfileSchema.shape[field];
      schema.parse(value);
      setValidFields(prev => ({...prev, [field]: true}));
      return true;
    } catch {
      setValidFields(prev => ({...prev, [field]: false}));
      return false;
    }
  }, []);

  const handleBlur = useCallback((field: keyof UpdateProfileFormData) => {
    return () => validateField(field, formData[field]);
  }, [formData, validateField]);

  const handleSave = useCallback(async () => {
    if (isLoading || !user?.id) return;

    try {
      updateProfileSchema.parse(formData);
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map(e => e.message);
        showWarning(
          'Dados Inválidos !',
          errors.length === 1 ? errors[0] : `Corrija: \n\n${errors.map(e => `• ${e}`).join('\n')}`,
        );
      }
      return;
    }

    setIsLoading(true);
    try {
      const result = await updateProfile(user.id, formData);

      if (!result.success || result.error) {
        showError('Erro', result.error || 'Erro ao salvar alterações');
        return;
      }

      if (result.user) {
        setUser(result.user);
      }

      showSuccess('Perfil Atualizado!', 'Seu perfil foi atualizado com sucesso !');
    } catch (error) {
      console.error('Erro inesperado:', error);
      showError('Erro', 'Erro inesperado ao salvar. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [formData, isLoading, user?.id]);
  const renderField = useCallback((field: Field) => {
    const commonProps = {
      label: field.label,
      placeholder: field.placeholder,
      value: formData[field.name],
      onChangeText: handleChange(field.name, field.mask),
      onBlur: handleBlur(field.name),
      showSuccessIcon: validFields[field.name],
      successIcon: <CircleCheck size={20} color="$primary"/>,
    };

    if (field.type === 'phone') {
      return (
        <PhoneInput
          key={field.name}
          {...commonProps}
        />
      );
    }

    if (field.type === 'date') {
      return (
        <DateInput
          key={field.name}
          {...commonProps}
          maxDate={new Date()}
        />
      );
    }

    return (
      <FormInput
        key={field.name}
        {...commonProps}
        autoCapitalize={field.type === 'text' ? 'words' : 'none'}
        keyboardType={field.keyboardType || 'default'}
        maxLength={field.maxLength}
      />
    );
  }, [formData, validFields, handleChange, handleBlur]);

  const renderSection = useCallback((sectionKey: string, section: Section) => (
    <YStack key={`${sectionKey}-section`} gap="$2">
      <Text fontSize="$2" fontWeight="600" color="$colorSecondary" paddingLeft="$2">
        {section.title}
      </Text>
      <YStack backgroundColor="$card" borderRadius="$3" padding="$3" gap="$2.5">
        {section.fields.map(renderField)}
      </YStack>
    </YStack>
  ), [renderField]);

  return (
    <ScreenWithHeader
      title="Perfil"
      onBack={() => router.push('/(app)/profile')}
      hasKeyboardInputs={true}
      hasTabBar={false}
    >
      <YStack paddingHorizontal="$4" paddingVertical="$4" gap="$4">
        <CardTitle
          icon={<User size={24} color="white"/>}
          title="Dados Pessoais"
          description="Atualize suas informações básicas"
        />

        <YStack backgroundColor="$card" borderRadius="$3" padding="$3" gap="$2">
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize="$2" color="$color" fontWeight="500">Perfil Completo</Text>
            <Text fontSize="$2" color="$color" fontWeight="600">{profileProgress}%</Text>
          </XStack>
          <Progress value={profileProgress} max={100} size="$2">
            <Progress.Indicator backgroundColor="$defaultPrimary" animation="bouncy" opacity={0.8} borderRadius="$5"/>
          </Progress>
        </YStack>

        {Object.entries(FORM_SECTIONS).map(([key, section]) =>
          renderSection(key, section)
        )}

        <XStack
          justifyContent="center"
          alignItems="center"
          paddingHorizontal="$2"
          paddingTop="$2"
        >
          <AnimatedSaveButton
            onSave={handleSave}
            isLoading={isLoading}
            disabled={false}
          />
        </XStack>
      </YStack>
    </ScreenWithHeader>
  );
};
