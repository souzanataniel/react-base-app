import {useCallback, useEffect, useRef, useState} from 'react';
import {getCurrentUser} from '@/features/auth/services/authService';
import {AvatarService} from '@/features/profile/services/avatarService';

interface UseAvatarThumbnailReturn {
  thumbnailUrl: string | null;
  loading: boolean;
  refreshThumbnail: () => Promise<void>;
  generateLocalThumbnail: (imageUri: string, size?: number) => Promise<string>;
}

export const useAvatarThumbnail = (): UseAvatarThumbnailReturn => {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Usar ref para evitar execução múltipla
  const isInitializedRef = useRef(false);
  const refreshingRef = useRef(false);

  const refreshThumbnail = useCallback(async (): Promise<void> => {
    // Evitar múltiplas chamadas simultâneas
    if (loading || refreshingRef.current) return;

    try {
      refreshingRef.current = true;
      setLoading(true);
      console.log('Refreshing avatar thumbnail...');

      const user = await getCurrentUser();
      if (!user?.id) {
        console.log('No user found, clearing thumbnail');
        setThumbnailUrl(null);
        return;
      }

      console.log('Getting thumbnail for user:', user.id);

      // Usar o método específico para thumbnail
      const thumbPath = await AvatarService.getAvatarThumbnailUrl(user.id);

      if (thumbPath) {
        console.log('Thumbnail loaded:', thumbPath.includes('?t=') ? 'from cache' : 'from server');
        setThumbnailUrl(thumbPath);
      } else {
        console.log('No thumbnail found');
        setThumbnailUrl(null);
      }
    } catch (error) {
      console.error('Error refreshing thumbnail:', error);
      setThumbnailUrl(null);
    } finally {
      setLoading(false);
      refreshingRef.current = false;
    }
  }, []); // Array vazio para evitar re-criação desnecessária

  const generateLocalThumbnail = useCallback(async (imageUri: string, size: number = 80): Promise<string> => {
    try {
      console.log('Generating local thumbnail...', {imageUri, size});
      const thumbnailUri = await AvatarService.generateThumbnail(imageUri, size);
      console.log('Local thumbnail generated:', thumbnailUri);
      return thumbnailUri;
    } catch (error) {
      console.error('Error generating local thumbnail:', error);
      throw error instanceof Error ? error : new Error('Erro ao gerar thumbnail');
    }
  }, []);

  // Carregar thumbnail apenas uma vez na inicialização
  useEffect(() => {
    if (!isInitializedRef.current) {
      console.log('useAvatarThumbnail hook initialized, loading thumbnail...');
      isInitializedRef.current = true;
      refreshThumbnail();
    }
  }, []); // Array vazio para executar apenas uma vez

  // Debug: Log state changes
  useEffect(() => {
    console.log('Thumbnail state changed:', {
      thumbnailUrl: thumbnailUrl ? (thumbnailUrl.includes('?t=') ? 'cached' : 'server') : 'none',
      loading,
    });
  }, [thumbnailUrl, loading]);

  return {
    thumbnailUrl,
    loading,
    refreshThumbnail,
    generateLocalThumbnail,
  };
};
