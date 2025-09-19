import {useAuth} from '@/features/auth/hooks/useAuth';
import React, {useCallback, useMemo, useState} from 'react';
import {CustomSaveFooter} from '@/shared/components/ui/CustomSaveFooter/CustomSaveFooter';
import {Progress, Text, XStack, YStack} from 'tamagui';
import {router, useFocusEffect} from 'expo-router';
import {useTabBarHeight} from '@/shared/components/ui/AnimatedTabBar/hooks/useTabBarHeight';
import {Alert} from 'react-native';
import {UpdateProfileFormData, updateProfileSchema} from '@/features/profile/schema/updateProfileSchema';
import {CardTitle} from '@/shared/components/ui/Cards/CardTitle';
import {CircleCheck, User} from '@tamagui/lucide-icons';
import {ScreenWithBlurHeader} from '@/shared/components/layout/ScreenWithBlurHeader';
import {LabelInput} from '@/shared/components/ui/Input/FormInput';
import {PhoneInput} from '@/shared/components/ui/Input/BasePhoneInput';
import {ZodError} from 'zod';
import {dateMasks} from '@/shared/utils/masks';

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

// Configuração flexível e extensível
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
      // Fácil adicionar: {name: 'email', label: 'E-mail', type: 'text', keyboardType: 'email-address'},
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
  const {user} = useAuth();
  const {tabBarHeight} = useTabBarHeight();
  const [isLoading, setIsLoading] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);
  const [validFields, setValidFields] = useState<Record<string, boolean>>({});

  const [formData, setFormData] = useState<UpdateProfileFormData>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    displayName: user?.displayName || '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth || '',
  });

  // Progresso do perfil
  const profileProgress = useMemo(() => {
    const values = Object.values(formData);
    const filled = values.filter(v => v && v.trim() !== '').length;
    return Math.round((filled / values.length) * 100);
  }, [formData]);

  // Verificar mudanças
  const hasChanges = useMemo(() => {
    return Object.keys(formData).some(key => {
      const k = key as keyof UpdateProfileFormData;
      return formData[k] !== (user?.[k] || '');
    });
  }, [formData, user]);

  // Reset ao focar na tela
  useFocusEffect(
    useCallback(() => {
      setFormData({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        displayName: user?.displayName || '',
        phone: user?.phone || '',
        dateOfBirth: user?.dateOfBirth || '',
      });
      setFooterVisible(false);
      setValidFields({});

      const timer = setTimeout(() => setFooterVisible(true), 50);
      return () => clearTimeout(timer);
    }, [user])
  );

  // Handler genérico de mudança
  const handleChange = useCallback((field: keyof UpdateProfileFormData, mask?: (v: string) => string) => {
    return (value: string) => {
      const processedValue = mask ? mask(value) : value;
      setFormData(prev => ({...prev, [field]: processedValue}));
    };
  }, []);

  // Validação de campo
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

  // Handler de blur
  const handleBlur = useCallback((field: keyof UpdateProfileFormData) => {
    return () => validateField(field, formData[field]);
  }, [formData, validateField]);

  // Salvar
  const handleSave = useCallback(async () => {
    if (!hasChanges || isLoading) return;

    try {
      updateProfileSchema.parse(formData);
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
      console.log('Salvando:', formData);
      // TODO: await updateUserProfile(formData);
      await new Promise(resolve => setTimeout(resolve, 2000));

      setFooterVisible(false);
      setTimeout(() => router.push('/(app)/profile'), 300);
    } catch (error) {
      console.error('Erro:', error);
      Alert.alert('Erro', 'Erro ao salvar. Tente novamente.', [{text: 'OK'}]);
    } finally {
      setIsLoading(false);
    }
  }, [formData, hasChanges, isLoading]);

  // Renderizar campo baseado no tipo
  const renderField = useCallback((field: Field) => {
    const commonProps = {
      label: field.label,
      placeholder: field.placeholder,
      value: formData[field.name],
      onChangeText: handleChange(field.name, field.mask),
      onBlur: handleBlur(field.name),
      showSuccessIcon: validFields[field.name],
    };

    // Campo de telefone
    if (field.type === 'phone') {
      return (
        <PhoneInput
          key={field.name}
          {...commonProps}
          successIcon={<CircleCheck size={20} color="$primary"/>}
        />
      );
    }

    // Campo de texto padrão (funciona para text, date, e outros)
    return (
      <LabelInput
        key={field.name}
        {...commonProps}
        autoCapitalize={field.type === 'text' ? 'words' : 'none'}
        keyboardType={field.keyboardType || 'default'}
        maxLength={field.maxLength}
        rightIcon={<CircleCheck size={20} color="$primary"/>}
      />
    );
  }, [formData, validFields, handleChange, handleBlur]);

  // Renderizar seção
  const renderSection = useCallback((section: Section) => (
    <YStack gap="$2">
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
      footerHeight={tabBarHeight + 100}
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
        {/* Hero */}
        <CardTitle
          icon={<User size={24} color="white"/>}
          title="Dados Pessoais"
          description="Atualize suas informações básicas"
        />

        {/* Progresso */}
        <YStack backgroundColor="$card" borderRadius="$3" padding="$3" gap="$2">
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize="$2" color="$color" fontWeight="500">Perfil Completo</Text>
            <Text fontSize="$2" color="$color" fontWeight="600">{profileProgress}%</Text>
          </XStack>
          <Progress value={profileProgress} max={100} size="$2">
            <Progress.Indicator backgroundColor="$primary" animation="bouncy" opacity={0.8} borderRadius="$5"/>
          </Progress>
        </YStack>

        {/* Renderizar todas as seções */}
        {Object.values(FORM_SECTIONS).map((section, index) => (
          <React.Fragment key={index}>
            {renderSection(section)}
          </React.Fragment>
        ))}
      </YStack>
    </ScreenWithBlurHeader>
  );
};
