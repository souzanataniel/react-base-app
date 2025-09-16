import {useAuth} from '@/features/auth/hooks/useAuth';
import {useCallback, useMemo, useState} from 'react';
import {UpdateProfileForm} from '@/features/profile/components/UpdateProfileForm';
import {CustomSaveFooter} from '@/shared/components/ui/CustomSaveFooter/CustomSaveFooter';
import {BaseScreenWrapper} from '@/shared/components/layout';
import {ScrollView, View, YStack} from 'tamagui';
import {BasicHeader} from '@/shared/components/ui/Header/BasicHeader';
import {router, useFocusEffect} from 'expo-router';
import {useTabBarHeight} from '@/shared/components/ui/AnimatedTabBar/hooks/useTabBarHeight';

export const UpdateProfileScreen = () => {
  const {user} = useAuth();
  const {tabBarHeight} = useTabBarHeight();
  const [isLoading, setIsLoading] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    displayName: user?.displayName || '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth || '',
  });

  useFocusEffect(
    useCallback(() => {
      setIsNavigating(false);
      setFooterVisible(false);

      const timer = setTimeout(() => {
        setFooterVisible(true);
      }, 150);

      return () => {
        clearTimeout(timer);
      };
    }, [])
  );

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

  const handleSave = async () => {
    if (!hasChanges || isLoading) return;

    setIsLoading(true);
    try {
      console.log('Salvando dados:', formData);

      await new Promise(resolve => setTimeout(resolve, 2000));

      setIsNavigating(true);
      setFooterVisible(false);
      router.push('/(app)/profile');

    } catch (error) {
      console.error('Erro ao salvar:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BaseScreenWrapper>
      <View flex={1}>
        <BasicHeader
          title="Dados Pessoais"
          onBack={handleBack}
        />

        <ScrollView
          flex={1}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: tabBarHeight + 20,
          }}
        >
          <YStack padding="$2" gap="$2">
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
                onFirstNameChange={(v) => setFormData(prev => ({...prev, firstName: v}))}
                onLastNameChange={(v) => setFormData(prev => ({...prev, lastName: v}))}
                onDisplayNameChange={(v) => setFormData(prev => ({...prev, displayName: v}))}
                onPhoneChange={(v) => setFormData(prev => ({...prev, phone: v}))}
                onDateOfBirthChange={(v) => setFormData(prev => ({...prev, dateOfBirth: v}))}
                canSubmit={hasChanges}
                isLoading={isLoading}
                onSubmit={handleSave}
                showSaveButton={false}
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
        />
      </View>
    </BaseScreenWrapper>
  );
};
