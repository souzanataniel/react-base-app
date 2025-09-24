import { useCallback, useEffect, useState, useRef } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getCurrentUser } from '@/features/auth/services/authService';
import { AvatarService } from '@/features/profile/services/avatarService';

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
  const [loading, setLoading] = useState<boolean>(false);

  // Usar ref para evitar loop infinito
  const isInitializedRef = useRef(false);
  const refreshingRef = useRef(false);

  const refreshAvatar = useCallback(async (): Promise<void> => {
    // Evitar múltiplas chamadas simultâneas
    if (loading || refreshingRef.current) return;

    try {
      refreshingRef.current = true;
      setLoading(true);
      console.log('Refreshing avatar...');

      const user = await getCurrentUser();
      if (!user?.id) {
        console.log('No user found, clearing avatar');
        setAvatarUrl(null);
        return;
      }

      console.log('Getting avatar for user:', user.id);

      // Usar o método otimizado que verifica cache primeiro
      const avatarPath = await AvatarService.getAvatarUrl(user.id);

      if (avatarPath) {
        console.log('Avatar loaded:', avatarPath.includes('?t=') ? 'from cache' : 'from server');
        setAvatarUrl(avatarPath);
      } else {
        console.log('No avatar found');
        setAvatarUrl(null);
      }
    } catch (error) {
      console.error('Error refreshing avatar:', error);
      setAvatarUrl(null);
    } finally {
      setLoading(false);
      refreshingRef.current = false;
    }
  }, []); // Remover dependências para evitar loop

  const uploadAvatar = async (imageUri: string): Promise<string> => {
    try {
      setUploading(true);
      setProgress(0);
      console.log('Starting avatar upload...', { imageUri });

      const user = await getCurrentUser();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      setProgress(25);

      // Upload usando o serviço otimizado
      console.log('Calling optimized upload service...');
      const avatarUrl = await AvatarService.uploadAndUpdateAvatar(user.id, imageUri);

      setProgress(75);

      // Atualizar estado local
      console.log('Upload completed, updating local state:', avatarUrl);
      setAvatarUrl(avatarUrl);

      setProgress(100);
      return avatarUrl;

    } catch (error) {
      console.error('Error in uploadAvatar:', error);
      throw error instanceof Error ? error : new Error('Erro no upload');
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const deleteAvatar = async (): Promise<void> => {
    try {
      setUploading(true);
      console.log('Starting avatar deletion...');

      const user = await getCurrentUser();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Limpar estado local imediatamente
      setAvatarUrl(null);

      // Deletar usando serviço otimizado
      await AvatarService.deleteAndUpdateAvatar(user.id);
      console.log('Avatar deleted successfully');

    } catch (error) {
      console.error('Error deleting avatar:', error);
      // Tentar recarregar em caso de erro
      setTimeout(() => {
        if (!refreshingRef.current) {
          refreshAvatar();
        }
      }, 1000);
      throw error instanceof Error ? error : new Error('Erro ao deletar avatar');
    } finally {
      setUploading(false);
    }
  };

  const pickImage = async (source: 'camera' | 'gallery' = 'gallery'): Promise<string | undefined> => {
    try {
      console.log('Starting image picker...', { source });

      // Verificar permissões
      const permission = source === 'camera'
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert('Permissão Necessária', 'Permissão para acessar a galeria/câmera é necessária!');
        return undefined;
      }

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

      if (!result.canceled && result.assets?.[0]) {
        const selectedImageUri = result.assets[0].uri;
        console.log('Image selected:', selectedImageUri);
        return await uploadAvatar(selectedImageUri);
      }

      return undefined;
    } catch (error) {
      console.error('Error in pickImage:', error);
      throw error instanceof Error ? error : new Error('Erro ao selecionar imagem');
    }
  };

  // Carregar avatar apenas uma vez na inicialização
  useEffect(() => {
    if (!isInitializedRef.current) {
      console.log('useAvatar hook initialized, loading avatar...');
      isInitializedRef.current = true;
      refreshAvatar();
    }
  }, []); // Array vazio para executar apenas uma vez

  // Debug: Log state changes (sem causar re-renders)
  useEffect(() => {
    console.log('Avatar state changed:', {
      avatarUrl: avatarUrl ? (avatarUrl.includes('?t=') ? 'cached' : 'server') : 'none',
      uploading,
      loading,
      progress,
    });
  }, [avatarUrl, uploading, loading, progress]);

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
