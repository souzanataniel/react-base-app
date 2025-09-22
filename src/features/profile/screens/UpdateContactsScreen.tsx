import {useAuth} from '@/features/auth/hooks/useAuth';
import React, {useCallback, useMemo, useState} from 'react';
import {CustomSaveFooter} from '@/shared/components/ui/CustomSaveFooter/CustomSaveFooter';
import {Text, YStack} from 'tamagui';
import {router, useFocusEffect} from 'expo-router';
import {useTabBarHeight} from '@/shared/components/ui/AnimatedTabBar/hooks/useTabBarHeight';
import {Alert} from 'react-native';
import {updateContactsSchema, UpdateContatcsFormData} from '@/features/profile/schema/updateContactsSchema';
import {CardTitle} from '@/shared/components/ui/Cards/CardTitle';
import {CircleCheck, Contact} from '@tamagui/lucide-icons';
import {ScreenWithBlurHeader} from '@/shared/components/layout/ScreenWithBlurHeader';
import {FormInput} from '@/shared/components/ui/Input/FormInput';
import {PhoneInput} from '@/shared/components/ui/Input/BasePhoneInput';
import {DateInput} from '@/shared/components/ui/Input/DateInput';
import {ZodError} from 'zod';
import {updateProfileField} from '@/features/profile/services/updateProfileService';
import {useBaseToast} from '@/shared/components/feedback/Toast';

type FieldType = 'text' | 'phone' | 'date' | 'email' | 'password';

interface Field {
  name: keyof UpdateContatcsFormData;
  label: string;
  placeholder?: string;
  type?: FieldType;
  mask?: (v: string) => string;
  keyboardType?: 'default' | 'numeric' | 'phone-pad' | 'email-address';
  maxLength?: number;
  disabled?: boolean;
}

interface Section {
  title: string;
  fields: Field[];
}

const FORM_SECTIONS: Record<string, Section> = {
  contact: {
    title: 'Contato',
    fields: [
      {name: 'phone', label: 'Celular', type: 'phone'},
      {name: 'email', label: 'Email', type: 'email', disabled: true},
    ]
  },
};

export const UpdateContactsScreen = () => {
  const {user, setUser} = useAuth();
  const {tabBarHeight} = useTabBarHeight();
  const [isLoading, setIsLoading] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);
  const [validFields, setValidFields] = useState<Record<string, boolean>>({});
  const {showSuccess} = useBaseToast();

  const [formData, setFormData] = useState<UpdateContatcsFormData>({
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const hasChanges = useMemo(() => {
    return Object.keys(formData).some(key => {
      const k = key as keyof UpdateContatcsFormData;
      return formData[k] !== (user?.[k] || '');
    });
  }, [formData, user]);

  useFocusEffect(
    useCallback(() => {
      setFormData({
        email: user?.email || '',
        phone: user?.phone || '',
      });
      setFooterVisible(false);
      setValidFields({});

      const timer = setTimeout(() => setFooterVisible(true), 50);
      return () => clearTimeout(timer);
    }, [user])
  );

  const handleChange = useCallback((field: keyof UpdateContatcsFormData, mask?: (v: string) => string) => {
    return (value: string) => {
      const processedValue = mask ? mask(value) : value;
      setFormData(prev => ({...prev, [field]: processedValue}));
    };
  }, []);

  const validateField = useCallback((field: keyof UpdateContatcsFormData, value: string | undefined | '') => {
    try {
      const schema = updateContactsSchema.shape[field];
      schema.parse(value);
      setValidFields(prev => ({...prev, [field]: true}));
      return true;
    } catch {
      setValidFields(prev => ({...prev, [field]: false}));
      return false;
    }
  }, []);

  const handleBlur = useCallback((field: keyof UpdateContatcsFormData) => {
    return () => validateField(field, formData[field]);
  }, [formData, validateField]);

  const handleSave = useCallback(async () => {
    if (!hasChanges || isLoading || !user?.id) return;

    try {
      updateContactsSchema.parse(formData);
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map(e => e.message);
        Alert.alert(
          'Dados inválidos',
          errors.length === 1 ? errors[0] : `Corrija:\n\n${errors.map(e => `• ${e}`).join('\n')}`,
          [{text: 'OK'}]
        );
      }
      return;
    }

    setIsLoading(true);
    try {
      console.log('Salvando alterações:', formData);
      const result = await updateProfileField(user.id, 'phone', formData.phone);

      if (!result.success || result.error) {
        Alert.alert('Erro', result.error || 'Erro ao salvar alterações', [{text: 'OK'}]);
        return;
      }

      if (result.user) {
        setUser(result.user);
      }

      console.log('✅ Perfil atualizado com sucesso:', result.user);

      setFooterVisible(false);
      setTimeout(() => {
        showSuccess('Contatos', 'Dados de contato atualizados com sucesso !');
      }, 300);

    } catch (error) {
      console.error('Erro inesperado:', error);
      Alert.alert('Erro', 'Erro inesperado ao salvar. Tente novamente.', [{text: 'OK'}]);
    } finally {
      setIsLoading(false);
    }
  }, [formData, hasChanges, isLoading, user?.id]);
  const renderField = useCallback((field: Field) => {
    const commonProps = {
      label: field.label,
      placeholder: field.placeholder,
      value: formData[field.name],
      onChangeText: handleChange(field.name, field.mask),
      onBlur: handleBlur(field.name),
      showSuccessIcon: validFields[field.name],
      successIcon: <CircleCheck size={20} color="$primary"/>,
      disabled: field.disabled,
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
        disabledStyle={{
          backgroundColor: '$red2',
          color: '$red9',
          borderColor: '$red7',
          borderWidth: 1
        }}
      />
    );
  }, [formData, validFields, handleChange, handleBlur]);

  const renderSection = useCallback((sectionKey: string, section: Section) => (
    <YStack key={`${sectionKey}-section`} gap="$2">
      <Text fontSize="$2" fontWeight="600" color="$gray11" paddingLeft="$2">
        {section.title}
      </Text>
      <YStack backgroundColor="$card" borderRadius="$3" padding="$3" gap="$2.5">
        {section.fields.map(renderField)}
      </YStack>
    </YStack>
  ), [renderField]);

  return (
    <ScreenWithBlurHeader
      title="Perfil"
      onBack={() => router.push('/(app)/profile')}
      hasKeyboardInputs={true}
      footerHeight={tabBarHeight}
      footer={
        <CustomSaveFooter
          onSave={handleSave}
          isLoading={isLoading}
          loadingText="Salvando Alterações"
          saveText="Salvar alterações"
          visible={footerVisible}
          disabled={!hasChanges}
        />
      }
    >
      <YStack paddingHorizontal="$4" paddingVertical="$4" gap="$4">
        <CardTitle
          icon={<Contact size={24} color="white"/>}
          title="Dados de Contato"
          description="Atualize suas informações de contato"
        />

        {Object.entries(FORM_SECTIONS).map(([key, section]) =>
          renderSection(key, section)
        )}
      </YStack>
    </ScreenWithBlurHeader>
  );
};
