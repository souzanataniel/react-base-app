import {useAuth} from '@/features/auth/hooks/useAuth';
import {useCallback, useMemo, useState} from 'react';
import {UpdateProfileForm} from '@/features/profile/components/UpdateProfileForm';
import {CustomSaveFooter} from '@/shared/components/ui/CustomSaveFooter/CustomSaveFooter';
import {BaseScreenWrapper} from '@/shared/components/layout';
import {ScrollView, View, YStack} from 'tamagui';
import {BasicHeader} from '@/shared/components/ui/Header/BasicHeader';
import {router, useFocusEffect} from 'expo-router';
import {useTabBarHeight} from '@/shared/components/ui/AnimatedTabBar/hooks/useTabBarHeight';
import {ZodError} from 'zod';
import {Alert} from 'react-native';
import {UpdateProfileFormData, updateProfileSchema} from '@/features/profile/schema/updateProfileSchema';

type FormErrors = {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  phone?: string;
  dateOfBirth?: string;
};

export const UpdateProfileScreen = () => {
  const {user} = useAuth();
  const {tabBarHeight} = useTabBarHeight();
  const [isLoading, setIsLoading] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [validFields, setValidFields] = useState<Record<string, boolean>>({});

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    displayName: '',
    phone: '',
    dateOfBirth: '',
  });

  useFocusEffect(
    useCallback(() => {
      setFormData({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        displayName: user?.displayName || '',
        phone: user?.phone || '',
        dateOfBirth: user?.dateOfBirth || '',
      });

      setIsNavigating(false);
      setFooterVisible(false);
      setValidFields({});

      const timer = setTimeout(() => {
        setFooterVisible(true);
      }, 50);

      return () => {
        clearTimeout(timer);
      };
    }, [user])
  );

  // Função para validar um campo específico
  const validateField = useCallback((fieldName: keyof UpdateProfileFormData, value: string) => {
    try {
      const fieldSchema = updateProfileSchema.shape[fieldName];
      fieldSchema.parse(value);

      // Se chegou aqui, a validação passou
      setValidFields(prev => ({...prev, [fieldName]: true}));
      return true;
    } catch (error) {
      setValidFields(prev => ({...prev, [fieldName]: false}));
      return false;
    }
  }, []);

  // Função para validar o formulário completo e retornar erros
  const validateForm = useCallback(() => {
    try {
      updateProfileSchema.parse(formData);
      return {isValid: true, errors: []};
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map(err => err.message);
        return {isValid: false, errors};
      }
      return {isValid: false, errors: ['Erro de validação']};
    }
  }, [formData]);

  // Função para mostrar alert com erros
  const showValidationErrors = useCallback((errors: string[]) => {
    const errorMessage = errors.length === 1
      ? errors[0]
      : `Corrija os seguintes erros:\n\n${errors.map((err, index) => `• ${err}`).join('\n')}`;

    Alert.alert(
      'Dados inválidos',
      errorMessage,
      [{text: 'OK', style: 'default'}]
    );
  }, []);

  // Verificar se tem mudanças (não afeta mais o canSubmit)
  const hasChanges = useMemo(() => {
    return (
      formData.firstName !== (user?.firstName || '') ||
      formData.lastName !== (user?.lastName || '') ||
      formData.displayName !== (user?.displayName || '') ||
      formData.phone !== (user?.phone || '') ||
      formData.dateOfBirth !== (user?.dateOfBirth || '')
    );
  }, [formData, user]);

  const handleBack = () => {
    setIsNavigating(true);
    setFooterVisible(false);
    router.push('/(app)/profile');
  };

  // Handlers de mudança de campo com validação
  const handleFirstNameChange = (value: string) => {
    setFormData(prev => ({...prev, firstName: value}));
  };

  const handleLastNameChange = (value: string) => {
    setFormData(prev => ({...prev, lastName: value}));
  };

  const handleDisplayNameChange = (value: string) => {
    setFormData(prev => ({...prev, displayName: value}));
  };

  const handlePhoneChange = (value: string) => {
    setFormData(prev => ({...prev, phone: value}));
  };

  const handleDateOfBirthChange = (value: string) => {
    // Aplicar máscara DD/MM/AAAA
    let maskedValue = value.replace(/\D/g, '');
    if (maskedValue.length >= 2) {
      maskedValue = maskedValue.slice(0, 2) + '/' + maskedValue.slice(2);
    }
    if (maskedValue.length >= 5) {
      maskedValue = maskedValue.slice(0, 5) + '/' + maskedValue.slice(5, 9);
    }

    setFormData(prev => ({...prev, dateOfBirth: maskedValue}));
  };

  // Handlers de blur (validação no blur)
  const handleBlurFirstName = () => validateField('firstName', formData.firstName);
  const handleBlurLastName = () => validateField('lastName', formData.lastName);
  const handleBlurDisplayName = () => validateField('displayName', formData.displayName);
  const handleBlurPhone = () => validateField('phone', formData.phone);
  const handleBlurDateOfBirth = () => validateField('dateOfBirth', formData.dateOfBirth);

  const handleSave = async () => {
    if (!hasChanges || isLoading) return;

    // Validação final antes do envio
    const validation = validateForm();
    if (!validation.isValid) {
      showValidationErrors(validation.errors);
      return;
    }

    setIsLoading(true);
    try {
      console.log('Salvando dados:', formData);

      // Simular chamada da API
      await new Promise(resolve => setTimeout(resolve, 2000));

      setIsNavigating(true);
      setFooterVisible(false);
      router.push('/(app)/profile');

    } catch (error) {
      console.error('Erro ao salvar:', error);
      Alert.alert(
        'Erro',
        'Ocorreu um erro ao salvar os dados. Tente novamente.',
        [{text: 'OK'}]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BaseScreenWrapper>
      <View flex={1}>
        <BasicHeader
          title="Meu Perfil"
          onBack={handleBack}
        />

        <ScrollView
          flex={1}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: tabBarHeight,
          }}
        >
          <YStack padding="$2.5" gap="$2">
            <YStack
              backgroundColor="$white"
              borderRadius="$6"
              padding="$5"
              marginHorizontal="$2"
              shadowColor="#000"
              shadowOpacity={0.15}
              shadowOffset={{width: 0, height: 1}}
              shadowRadius={3}
              gap="$2"
            >
              <UpdateProfileForm
                firstName={formData.firstName}
                lastName={formData.lastName}
                displayName={formData.displayName}
                phone={formData.phone}
                dateOfBirth={formData.dateOfBirth}
                onFirstNameChange={handleFirstNameChange}
                onLastNameChange={handleLastNameChange}
                onDisplayNameChange={handleDisplayNameChange}
                onPhoneChange={handlePhoneChange}
                onDateOfBirthChange={handleDateOfBirthChange}
                onBlurFirstName={handleBlurFirstName}
                onBlurLastName={handleBlurLastName}
                onBlurDisplayName={handleBlurDisplayName}
                onBlurPhone={handleBlurPhone}
                onBlurDateOfBirth={handleBlurDateOfBirth}
                canSubmit={true} // Sempre true - botão sempre habilitado
                isLoading={isLoading}
                onSubmit={handleSave}
                showSaveButton={false}
                validFields={validFields}
              />
            </YStack>
          </YStack>
        </ScrollView>

        <CustomSaveFooter
          onSave={handleSave}
          config={{
            hapticFeedback: true,
            enableErrorShake: true,
            showLoadingSpinner: true,
          }}
          isLoading={isLoading}
          loadingText="Salvando Alterações"
          saveText="Salvar alterações"
          visible={footerVisible}
          disabled={false} // Botão sempre habilitado
        />
      </View>
    </BaseScreenWrapper>
  );
};
