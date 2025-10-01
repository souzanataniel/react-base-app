import {Text, View, YStack} from 'tamagui';
import {Camera, Edit3, User} from '@tamagui/lucide-icons';
import React from 'react';
import {ActivityIndicator, Image, Platform, Pressable} from 'react-native';
import {ProfileHeaderProps} from '@/shared/components/lists/types';
import {useAvatar} from '@/features/profile/hooks/useAvatar';
import {useImageSourcePicker} from '@/shared/components/ui/ImageSourcePicker/ImageSourcePicker';
import {useGlobalAlert} from '@/shared/components/feedback/BaseAlert/BaseAlert';

interface ExtendedProfileHeaderProps extends Omit<ProfileHeaderProps, 'avatarUri'> {
  name: string;
  subtitle?: string;
  onEditPress?: () => void;
  size?: 'small' | 'medium' | 'large';
  showEditButton?: boolean;
  enableAvatarUpload?: boolean;
  onAvatarUploadSuccess?: (url: string) => void;
  onAvatarUploadError?: (error: Error) => void;
}

export const ProfileHeader = ({
                                name,
                                subtitle,
                                onEditPress,
                                size = 'medium',
                                enableAvatarUpload = true,
                                onAvatarUploadSuccess,
                                onAvatarUploadError,
                              }: ExtendedProfileHeaderProps) => {
  const {
    avatarUrl,
    uploading,
    progress,
    pickImage,
    deleteAvatar,
    refreshAvatar,
  } = useAvatar();

  const {show: showImagePicker} = useImageSourcePicker();
  const {showSuccess, showError, showConfirm} = useGlobalAlert();

  React.useEffect(() => {
    console.log('ProfileHeader avatar state:', {
      avatarUrl: avatarUrl ? (avatarUrl.includes('?t=') ? 'cached' : 'server') : 'none',
      uploading,
      hasAvatarUrl: !!avatarUrl,
    });
  }, [avatarUrl, uploading]);

  const sizeConfig = {
    small: {avatarSize: '$8', nameSize: '$6', padding: '$4'},
    medium: {avatarSize: '$10', nameSize: '$7', padding: '$3'},
    large: {avatarSize: '$12', nameSize: '$8', padding: '$6'},
  };

  const marginBottom = Platform.OS === 'ios' ? '$4' : '$6';
  const config = sizeConfig[size];

  const handlePickImage = async (source: 'camera' | 'gallery') => {
    try {
      const result = await pickImage(source);
      if (result && onAvatarUploadSuccess) {
        onAvatarUploadSuccess(result);
        showSuccess(
          'Sucesso!',
          'Foto do perfil atualizada com sucesso',
          'Fechar'
        );
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error : new Error('Erro desconhecido');
      console.error('Erro no upload:', errorMessage);

      if (onAvatarUploadError) {
        onAvatarUploadError(errorMessage);
      } else {
        showError(
          'Erro no Upload',
          'Não foi possível fazer upload da imagem. Tente novamente.',
          'Fechar'
        );
      }
    }
  };

  const handleDeleteAvatar = async (): Promise<void> => {
    showConfirm(
      'Remover Foto',
      'Tem certeza que deseja remover sua foto do perfil?',
      'Remover',
      'Cancelar',
      async () => {
        try {
          await deleteAvatar();
          showSuccess(
            'Foto Removida!',
            'Sua foto do perfil foi removida com sucesso',
            'Fechar'
          );
        } catch (error) {
          showError(
            'Erro ao Remover',
            'Não foi possível remover a foto do perfil. Tente novamente.',
            'Fechar'
          );
        }
      },
      undefined,
      'warning'
    );
  };

  const handleRefreshAvatar = async (): Promise<void> => {
    try {
      await refreshAvatar();
      showSuccess(
        'Avatar Atualizado!',
        'Seu avatar foi atualizado com sucesso',
        'Fechar'
      );
    } catch (error) {
      showError(
        'Erro ao Atualizar',
        'Não foi possível atualizar o avatar. Tente novamente.',
        'Fechar'
      );
    }
  };

  const handleAvatarPress = () => {
    if (!enableAvatarUpload && onEditPress) {
      onEditPress();
      return;
    }

    if (!enableAvatarUpload) return;

    showImagePicker({
      title: 'Foto do Perfil',
      subtitle: 'Escolha uma opção',
      showCamera: true,
      showGallery: true,
      showRemove: !!avatarUrl,
      showAvatar: !!avatarUrl,
      cameraText: 'Câmera',
      galleryText: 'Galeria',
      removeText: 'Remover Foto',
      avatarText: 'Atualizar Avatar',
      cancelText: 'Cancelar',
      onCamera: () => handlePickImage('camera'),
      onGallery: () => handlePickImage('gallery'),
      onRemove: handleDeleteAvatar,
      onAvatar: handleRefreshAvatar,
    });
  };

  const AvatarLoadingOverlay = () => (
    <View
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      backgroundColor="rgba(0,0,0,0.6)"
      borderRadius="$12"
      alignItems="center"
      justifyContent="center"
      zIndex={10}
    >
      <ActivityIndicator color="white" size="small"/>
      <Text color="white" fontSize="$2" marginTop="$1" fontWeight="600">
        {progress > 0 ? `${progress}%` : 'Enviando...'}
      </Text>
    </View>
  );

  return (
    <YStack
      alignItems="center"
      paddingVertical={config.padding}
      marginLeft={16}
      marginRight={16}
      borderRadius="$4"
      backgroundColor="$card"
      style={{
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.04)',
      }}
      marginTop={marginBottom}
    >
      <View position="relative" marginBottom="$3">
        <Pressable
          onPress={(enableAvatarUpload || onEditPress) ? handleAvatarPress : undefined}
          disabled={uploading}
          style={{position: 'relative'}}
        >
          <View
            style={{
              width: size === 'large' ? 120 : size === 'medium' ? 100 : 80,
              height: size === 'large' ? 120 : size === 'medium' ? 100 : 80,
              borderRadius: (size === 'large' ? 120 : size === 'medium' ? 100 : 80) / 2,
              backgroundColor: '#f8f9fa',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            {avatarUrl ? (
              <Image
                source={{uri: avatarUrl}}
                style={{
                  width: '100%',
                  height: '100%',
                  opacity: uploading ? 0.7 : 1,
                }}
                onLoad={() => console.log('Avatar image loaded successfully')}
                onError={(error) => {
                  console.error('Avatar image load error:', error);
                  // Auto-refresh em caso de erro
                  setTimeout(refreshAvatar, 1000);
                }}
                resizeMode="cover"
              />
            ) : (
              <User
                size={size === 'large' ? 60 : size === 'medium' ? 50 : 40}
                color="#666"
              />
            )}
          </View>

          {uploading && <AvatarLoadingOverlay/>}

          {(enableAvatarUpload || onEditPress) && !uploading && (
            <View
              style={{
                position: 'absolute',
                bottom: 4,
                right: 4,
                backgroundColor: enableAvatarUpload ? '#007AFF' : '#2873FF',
                borderRadius: 15,
                width: 30,
                height: 30,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 3,
                borderColor: 'white',
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.25,
                shadowRadius: 6,
                elevation: 5,
              }}
            >
              {enableAvatarUpload ? (
                <Camera size={15} color="white"/>
              ) : (
                <Edit3 size={15} color="white"/>
              )}
            </View>
          )}
        </Pressable>

        {/* Indicador de cache ativo (debug) */}
        {__DEV__ && avatarUrl?.includes('?t=') && (
          <View
            style={{
              position: 'absolute',
              top: -5,
              left: -5,
              backgroundColor: 'green',
              borderRadius: 10,
              width: 20,
              height: 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text fontSize={8} color="white">
              ⚡
            </Text>
          </View>
        )}
      </View>

      <YStack alignItems="center" gap="$1">
        <Text fontSize={config.nameSize} fontWeight="600" color="$color">
          {name}
        </Text>
        {subtitle && (
          <Text fontSize="$4" color="$colorSecondary" fontWeight="400">
            {subtitle}
          </Text>
        )}
      </YStack>
    </YStack>
  );
};
