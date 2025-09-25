import {supabase} from '@/lib/supabase';
import {manipulateAsync, SaveFormat} from 'expo-image-manipulator';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class AvatarService {
  private static readonly BUCKET_NAME = 'avatars';
  private static readonly CACHE_KEY_PREFIX = 'avatar_cache_';
  private static readonly CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 dias

  /**
   * Obter thumbnail do avatar (80x80 para ícones)
   */
  static async getAvatarThumbnailUrl(userId: string): Promise<string | null> {
    try {
      console.log('Getting avatar thumbnail for user:', userId);

      // 1. Verificar cache do thumbnail
      const cachedThumb = await this.getCachedAvatar(`${userId}_thumb`);
      if (cachedThumb) {
        console.log('Using cached thumbnail data');
        return cachedThumb;
      }

      // 2. Buscar thumbnail do servidor
      const thumbUrl = await this.getServerThumbnailUrl(userId);
      if (!thumbUrl) {
        console.log('No thumbnail found, falling back to main avatar');
        // Fallback para avatar principal se thumbnail não existir
        return await this.getAvatarUrl(userId);
      }

      // 3. Cachear URL do thumbnail
      const cachedThumbUrl = `${thumbUrl}?t=${Date.now()}`;
      await this.cacheAvatarUrl(`${userId}_thumb`, cachedThumbUrl);

      console.log('Thumbnail URL cached:', cachedThumbUrl);
      return cachedThumbUrl;

    } catch (error) {
      console.error('Error getting thumbnail URL:', error);
      // Fallback para avatar principal em caso de erro
      return await this.getAvatarUrl(userId);
    }
  }

  /**
   * Verificar se thumbnail existe no servidor
   */
  private static async getServerThumbnailUrl(userId: string): Promise<string | null> {
    try {
      const fileName = `${userId}/avatar_thumb.jpg`;
      const {data: files, error} = await supabase.storage
        .from(this.BUCKET_NAME)
        .list(userId);

      if (error || !files || files.length === 0) return null;

      const thumbFile = files.find(f => f.name === 'avatar_thumb.jpg');
      if (!thumbFile) return null;

      const {data} = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error('Error getting server thumbnail URL:', error);
      return null;
    }
  }

  /**
   * Gerar thumbnail local a partir de uma imagem URI
   */
  static async generateThumbnail(imageUri: string, size: number = 80): Promise<string> {
    try {
      console.log('Generating thumbnail from URI:', imageUri);

      const thumbnail = await manipulateAsync(
        imageUri,
        [{resize: {width: size, height: size}}],
        {compress: 0.6, format: SaveFormat.JPEG}
      );

      console.log('Thumbnail generated:', thumbnail.uri);
      return thumbnail.uri;
    } catch (error) {
      console.error('Error generating thumbnail:', error);
      throw error instanceof Error ? error : new Error('Erro ao gerar thumbnail');
    }
  }

  static async getAvatarUrl(userId: string): Promise<string | null> {
    try {
      console.log('Getting avatar for user:', userId);

      // 1. Verificar cache no AsyncStorage
      const cachedData = await this.getCachedAvatar(userId);
      if (cachedData) {
        console.log('Using cached avatar data');
        return cachedData;
      }

      // 2. Buscar do servidor
      const serverUrl = await this.getServerAvatarUrl(userId);
      if (!serverUrl) {
        console.log('No avatar found on server');
        return null;
      }

      // 3. Cachear URL do servidor (com timestamp para cache-busting)
      const cachedUrl = `${serverUrl}?t=${Date.now()}`;
      await this.cacheAvatarUrl(userId, cachedUrl);

      console.log('Avatar URL cached:', cachedUrl);
      return cachedUrl;

    } catch (error) {
      console.error('Error getting avatar URL:', error);
      return null;
    }
  }

  /**
   * Obter avatar do cache AsyncStorage
   */
  private static async getCachedAvatar(userId: string): Promise<string | null> {
    try {
      const cacheKey = `${this.CACHE_KEY_PREFIX}${userId}`;
      const cachedDataStr = await AsyncStorage.getItem(cacheKey);

      if (!cachedDataStr) return null;

      const cachedData = JSON.parse(cachedDataStr);

      // Verificar se não expirou
      const isExpired = (Date.now() - cachedData.timestamp) > this.CACHE_DURATION;
      if (isExpired) {
        await AsyncStorage.removeItem(cacheKey);
        return null;
      }

      return cachedData.avatarUrl;
    } catch (error) {
      console.error('Error getting cached avatar:', error);
      return null;
    }
  }

  /**
   * Cachear URL do avatar no AsyncStorage
   */
  private static async cacheAvatarUrl(userId: string, avatarUrl: string): Promise<void> {
    try {
      const cacheKey = `${this.CACHE_KEY_PREFIX}${userId}`;
      const cacheData = {
        avatarUrl,
        timestamp: Date.now(),
      };

      await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error caching avatar URL:', error);
    }
  }

  /**
   * Limpar cache do usuário
   */
  private static async clearUserCache(userId: string): Promise<void> {
    try {
      const cacheKey = `${this.CACHE_KEY_PREFIX}${userId}`;
      await AsyncStorage.removeItem(cacheKey);
      console.log('Cache cleared for user:', userId);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  /**
   * Verificar se avatar existe no servidor
   */
  private static async getServerAvatarUrl(userId: string): Promise<string | null> {
    try {
      const fileName = `${userId}/avatar.jpg`;
      const {data: files, error} = await supabase.storage
        .from(this.BUCKET_NAME)
        .list(userId);

      if (error || !files || files.length === 0) return null;

      const avatarFile = files.find(f => f.name === 'avatar.jpg');
      if (!avatarFile) return null;

      const {data} = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error('Error getting server avatar URL:', error);
      return null;
    }
  }

  /**
   * Upload de avatar com thumbnail
   */
  static async uploadAvatar(userId: string, imageUri: string): Promise<string> {
    try {
      console.log('Starting avatar upload:', {userId, imageUri});

      // Comprimir imagem principal (400x400)
      const compressedImage = await manipulateAsync(
        imageUri,
        [{resize: {width: 400, height: 400}}],
        {compress: 0.8, format: SaveFormat.JPEG}
      );

      // Criar thumbnail (80x80 para ícones)
      const thumbnailImage = await manipulateAsync(
        imageUri,
        [{resize: {width: 80, height: 80}}],
        {compress: 0.6, format: SaveFormat.JPEG}
      );

      // Upload imagem principal
      const mainFormData = new FormData();
      mainFormData.append('file', {
        uri: compressedImage.uri,
        type: 'image/jpeg',
        name: 'avatar.jpg',
      } as any);

      const mainFileName = `${userId}/avatar.jpg`;
      const {error: mainError} = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(mainFileName, mainFormData, {
          cacheControl: '3600',
          upsert: true,
          contentType: 'image/jpeg',
        });

      if (mainError) throw mainError;

      // Upload thumbnail
      const thumbFormData = new FormData();
      thumbFormData.append('file', {
        uri: thumbnailImage.uri,
        type: 'image/jpeg',
        name: 'avatar_thumb.jpg',
      } as any);

      const thumbFileName = `${userId}/avatar_thumb.jpg`;
      const {error: thumbError} = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(thumbFileName, thumbFormData, {
          cacheControl: '3600',
          upsert: true,
          contentType: 'image/jpeg',
        });

      if (thumbError) {
        console.warn('Thumbnail upload failed, continuing with main image:', thumbError);
      } else {
        console.log('Thumbnail uploaded successfully');
      }

      // Obter URLs públicas
      const {data: mainUrlData} = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(mainFileName);

      const {data: thumbUrlData} = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(thumbFileName);

      const publicUrl = mainUrlData.publicUrl;
      const thumbUrl = thumbUrlData.publicUrl;

      // Cachear ambas URLs
      const timestamp = Date.now();
      const cachedUrl = `${publicUrl}?t=${timestamp}`;
      const cachedThumbUrl = `${thumbUrl}?t=${timestamp}`;

      await this.cacheAvatarUrl(userId, cachedUrl);
      await this.cacheAvatarUrl(`${userId}_thumb`, cachedThumbUrl);

      console.log('Upload successful and cached:', {main: cachedUrl, thumb: cachedThumbUrl});
      return cachedUrl;
    } catch (error) {
      console.error('Error in avatar upload:', error);
      throw error instanceof Error ? error : new Error('Erro no upload');
    }
  }

  /**
   * Deletar avatar e thumbnail
   */
  static async deleteAvatar(userId: string): Promise<void> {
    try {
      const mainFileName = `${userId}/avatar.jpg`;
      const thumbFileName = `${userId}/avatar_thumb.jpg`;

      // Deletar arquivo principal
      const {error: mainError} = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([mainFileName]);

      if (mainError) throw mainError;

      // Deletar thumbnail (não falha se não existir)
      const {error: thumbError} = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([thumbFileName]);

      if (thumbError) {
        console.warn('Thumbnail delete failed (may not exist):', thumbError);
      } else {
        console.log('Thumbnail deleted successfully');
      }

      // Limpar cache principal e thumbnail
      await this.clearUserCache(userId);
      await this.clearUserCache(`${userId}_thumb`);

      console.log('Avatar and thumbnail deleted successfully');
    } catch (error) {
      console.error('Error deleting avatar:', error);
      throw error instanceof Error ? error : new Error('Erro ao deletar avatar');
    }
  }

  /**
   * Atualizar avatar_url na tabela profiles
   */
  static async updateUserAvatar(userId: string, avatarUrl: string | null): Promise<void> {
    try {
      const updateData = {
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      };

      const {data, error} = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId)
        .select();

      if (error) throw error;
      console.log('Profile updated successfully:', data);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error instanceof Error ? error : new Error('Erro ao atualizar perfil');
    }
  }

  /**
   * Processo completo: upload + update profile
   */
  static async uploadAndUpdateAvatar(userId: string, imageUri: string): Promise<string> {
    try {
      const avatarUrl = await this.uploadAvatar(userId, imageUri);
      await this.updateUserAvatar(userId, avatarUrl.split('?')[0]); // Salvar URL limpa no banco
      return avatarUrl; // Retornar URL com timestamp para cache-busting
    } catch (error) {
      console.error('Error in uploadAndUpdateAvatar:', error);
      throw error;
    }
  }

  /**
   * Processo completo: delete + update profile
   */
  static async deleteAndUpdateAvatar(userId: string): Promise<void> {
    try {
      await this.deleteAvatar(userId);
      await this.updateUserAvatar(userId, null);
    } catch (error) {
      console.error('Error in deleteAndUpdateAvatar:', error);
      throw error;
    }
  }

  /**
   * Verificar se avatar existe no storage
   */
  static async checkAvatarExists(userId: string): Promise<boolean> {
    try {
      const fileName = `${userId}/avatar.jpg`;
      const {data, error} = await supabase.storage
        .from(this.BUCKET_NAME)
        .list(userId);

      if (error) return false;

      const exists = data.some(file => file.name === 'avatar.jpg');
      return exists;
    } catch (error) {
      console.error('Error checking avatar existence:', error);
      return false;
    }
  }

  /**
   * Limpar cache expirado (manutenção)
   */
  static async clearExpiredCache(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(this.CACHE_KEY_PREFIX));

      for (const key of cacheKeys) {
        const cachedDataStr = await AsyncStorage.getItem(key);
        if (!cachedDataStr) continue;

        const cachedData = JSON.parse(cachedDataStr);
        const isExpired = (Date.now() - cachedData.timestamp) > this.CACHE_DURATION;

        if (isExpired) {
          await AsyncStorage.removeItem(key);
        }
      }

      console.log('Expired cache cleared');
    } catch (error) {
      console.error('Error clearing expired cache:', error);
    }
  }

  // Manter métodos legados para compatibilidade
  static getAvatarUrlWithCacheBusting(userId: string): string {
    const {data} = supabase.storage
      .from(this.BUCKET_NAME)
      .getPublicUrl(`${userId}/avatar.jpg`);

    return `${data.publicUrl}?t=${Date.now()}`;
  }

  static async forceClearAvatarCache(userId: string): Promise<void> {
    await this.clearUserCache(userId);
  }
}
