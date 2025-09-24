import {useCallback, useEffect, useState} from 'react';
import {Alert} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {getCurrentUser} from '@/features/auth/services/authService';
import {AvatarService} from '@/features/profile/services/avatarService';

interface UseAvatarReturn {
  avatarUrl: string | null;
  uploading: boolean;
  progress: number;
  uploadAvatar: (imageUri: string) => Promise<string>;
  pickImage: (source?: 'camera' | 'gallery') => Promise<string | undefined>;
  deleteAvatar: () => Promise<void>;
  refreshAvatar: () => Promise<void>;
}

export const useAvatar = (): UseAvatarReturn => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const refreshAvatar = useCallback(async (): Promise<void> => {
    try {
      console.log('🔄 Refreshing avatar...');

      const user = await getCurrentUser();
      console.log('👤 Current user:', {
        id: user?.id,
        email: user?.email,
        avatarUrl: user?.avatarUrl,
        hasUser: !!user
      });

      if (user?.avatarUrl) {
        // Limpar cache adicionando timestamp
        const cleanUrl = user.avatarUrl.split('?')[0]; // Remove existing query params
        const urlWithTimestamp = `${cleanUrl}?t=${Date.now()}`;

        console.log('✅ Setting avatar URL with cache-busting:', urlWithTimestamp);
        setAvatarUrl(urlWithTimestamp);
      } else {
        console.log('⚠️ No avatar URL found, setting to null');
        setAvatarUrl(null);
      }
    } catch (error) {
      console.error('❌ Error loading avatar:', error);
      setAvatarUrl(null); // Garantir que limpa em caso de erro
    }
  }, []);

  const uploadAvatar = async (imageUri: string): Promise<string> => {
    try {
      setUploading(true);
      setProgress(0);
      console.log('📸 Starting avatar upload...', {imageUri});

      const user = await getCurrentUser();
      if (!user) {
        console.error('❌ No user found');
        throw new Error('Usuário não autenticado');
      }

      console.log('👤 User for upload:', {id: user.id, email: user.email});
      setProgress(25);

      // IMPORTANTE: Limpar avatar atual antes do upload para evitar cache
      console.log('🧹 Clearing current avatar to prevent cache issues...');
      setAvatarUrl(null);

      // Upload usando o serviço
      console.log('⬆️ Calling AvatarService.uploadAndUpdateAvatar...');
      const newAvatarUrl = await AvatarService.uploadAndUpdateAvatar(user.id, imageUri);

      console.log('✅ Upload completed, new URL:', newAvatarUrl);
      setProgress(75);

      // Verificar se a URL está acessível
      console.log('🔍 Testing avatar URL accessibility...');
      try {
        const response = await fetch(newAvatarUrl, {method: 'HEAD'});
        console.log('🌐 URL test response:', {
          status: response.status,
          ok: response.ok,
          url: newAvatarUrl
        });
      } catch (fetchError) {
        console.warn('⚠️ Error testing URL accessibility:', fetchError);
      }

      setProgress(90);

      // Atualizar estado local com a nova URL (sem cache-busting)
      const cleanUrl = newAvatarUrl.split('?')[0]; // Remove query parameters
      const finalUrl = `${cleanUrl}?t=${Date.now()}`; // Add fresh timestamp

      console.log('✅ Setting new avatar with cache-busting:', finalUrl);
      setAvatarUrl(finalUrl);

      // Refresh para garantir sincronização (com delay maior)
      setTimeout(async () => {
        console.log('🔄 Auto-refreshing avatar after upload...');
        await refreshAvatar();
      }, 2000); // Aumentar delay para 2 segundos

      setProgress(100);
      return finalUrl;

    } catch (error) {
      console.error('❌ Error in uploadAvatar:', error);
      throw error instanceof Error ? error : new Error('Erro no upload');
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const deleteAvatar = async (): Promise<void> => {
    try {
      setUploading(true);
      console.log('🗑️ Starting avatar deletion...');

      const user = await getCurrentUser();
      if (!user) {
        console.error('❌ No user found for deletion');
        throw new Error('Usuário não autenticado');
      }

      console.log('👤 User for deletion:', {id: user.id, email: user.email});

      // Limpar estado local IMEDIATAMENTE
      console.log('🧹 Clearing avatar state immediately...');
      setAvatarUrl(null);

      // Deletar do storage e banco
      await AvatarService.deleteAndUpdateAvatar(user.id);
      console.log('✅ Avatar deleted successfully');

      // Garantir que o estado permanece limpo
      console.log('✅ Ensuring avatar state remains cleared');
      setAvatarUrl(null);

      // Refresh para confirmar sincronização (com delay)
      setTimeout(async () => {
        console.log('🔄 Auto-refreshing avatar after deletion...');
        await refreshAvatar();

        // Garantir que ainda está null após refresh
        setTimeout(() => {
          console.log('🔍 Final state check after delete refresh');
          setAvatarUrl(null);
        }, 500);
      }, 1000);

    } catch (error) {
      console.error('❌ Error deleting avatar:', error);
      throw error instanceof Error ? error : new Error('Erro ao deletar avatar');
    } finally {
      setUploading(false);
    }
  };

  const pickImage = async (source: 'camera' | 'gallery' = 'gallery'): Promise<string | undefined> => {
    try {
      console.log('🖼️ Starting image picker...', {source});

      // Verificar permissões
      const permission = source === 'camera'
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        console.warn('⚠️ Permission denied for', source);
        Alert.alert('Permissão Necessária', 'Permissão para acessar a galeria/câmera é necessária!');
        return undefined;
      }

      console.log('✅ Permission granted for', source);

      // Configurar opções
      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        exif: false,
      };

      // Abrir picker
      const result = source === 'camera'
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);

      console.log('📱 Image picker result:', {
        canceled: result.canceled,
        hasAssets: result.assets?.length || 0
      });

      if (!result.canceled && result.assets?.[0]) {
        const selectedImageUri = result.assets[0].uri;
        console.log('✅ Image selected:', {uri: selectedImageUri});

        return await uploadAvatar(selectedImageUri);
      }

      console.log('⚠️ Image selection cancelled or failed');
      return undefined;
    } catch (error) {
      console.error('❌ Error in pickImage:', error);
      throw error instanceof Error ? error : new Error('Erro ao selecionar imagem');
    }
  };

  useEffect(() => {
    console.log('🚀 useAvatar hook initialized, calling refreshAvatar...');
    refreshAvatar();
  }, [refreshAvatar]);

  // Debug: Log state changes
  useEffect(() => {
    console.log('🔄 Avatar state changed:', {
      avatarUrl,
      uploading,
      progress,
      hasUrl: !!avatarUrl
    });
  }, [avatarUrl, uploading, progress]);

  return {
    avatarUrl,
    uploading,
    progress,
    uploadAvatar,
    pickImage,
    deleteAvatar,
    refreshAvatar,
  };
};
