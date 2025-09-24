import {supabase} from '@/lib/supabase';
import {manipulateAsync, SaveFormat} from 'expo-image-manipulator';

export class AvatarService {
  private static readonly BUCKET_NAME = 'avatars';

  /**
   * Upload de avatar com compressão
   */
  static async uploadAvatar(userId: string, imageUri: string): Promise<string> {
    try {
      console.log('📸 AvatarService.uploadAvatar started:', {userId, imageUri});

      // Comprimir imagem
      console.log('🔄 Compressing image...');
      const compressedImage = await manipulateAsync(
        imageUri,
        [{resize: {width: 400, height: 400}}],
        {compress: 0.8, format: SaveFormat.JPEG}
      );

      console.log('✅ Image compressed:', {
        originalUri: imageUri,
        compressedUri: compressedImage.uri,
        width: compressedImage.width,
        height: compressedImage.height
      });

      // Preparar FormData
      console.log('📦 Preparing FormData...');
      const formData = new FormData();
      formData.append('file', {
        uri: compressedImage.uri,
        type: 'image/jpeg',
        name: 'avatar.jpg',
      } as any);

      const fileName = `${userId}/avatar.jpg`;
      console.log('📂 Upload filename:', fileName);

      // Upload para Supabase Storage
      console.log('⬆️ Uploading to Supabase Storage...');
      const {data, error} = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(fileName, formData, {
          cacheControl: '3600',
          upsert: true,
          contentType: 'image/jpeg',
        });

      if (error) {
        console.error('❌ Supabase upload error:', error);
        throw error;
      }

      console.log('✅ Upload successful:', data);

      // Obter URL público
      console.log('🔗 Getting public URL...');
      const {data: urlData} = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;
      console.log('✅ Public URL generated:', publicUrl);

      // Retornar URL limpa (sem timestamp) - o hook vai gerenciar cache-busting
      return publicUrl;
    } catch (error) {
      console.error('❌ Error in AvatarService.uploadAvatar:', error);
      throw error instanceof Error ? error : new Error('Erro no upload');
    }
  }

  /**
   * Deletar avatar
   */
  static async deleteAvatar(userId: string): Promise<void> {
    try {
      console.log('🗑️ AvatarService.deleteAvatar started:', {userId});

      const fileName = `${userId}/avatar.jpg`;
      console.log('📂 Delete filename:', fileName);

      const {error} = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([fileName]);

      if (error) {
        console.error('❌ Supabase delete error:', error);
        throw error;
      }

      console.log('✅ Avatar deleted from storage successfully');
    } catch (error) {
      console.error('❌ Error in AvatarService.deleteAvatar:', error);
      throw error instanceof Error ? error : new Error('Erro ao deletar avatar');
    }
  }

  /**
   * Atualizar avatar_url na tabela profiles
   */
  static async updateUserAvatar(userId: string, avatarUrl: string | null): Promise<void> {
    try {
      console.log('💾 AvatarService.updateUserAvatar started:', {
        userId,
        avatarUrl: avatarUrl ? `${avatarUrl.substring(0, 50)}...` : null
      });

      const updateData = {
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      };

      console.log('📝 Update data:', updateData);

      const {data, error} = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId)
        .select(); // Retornar dados atualizados para verificação

      if (error) {
        console.error('❌ Supabase profile update error:', error);
        throw error;
      }

      console.log('✅ Profile updated successfully:', data);

      // Verificar se a atualização realmente aconteceu
      if (data && data.length > 0) {
        console.log('✅ Update confirmed, new profile data:', {
          id: data[0].id,
          avatar_url: data[0].avatar_url,
          updated_at: data[0].updated_at
        });
      } else {
        console.warn('⚠️ Update completed but no data returned');
      }

    } catch (error) {
      console.error('❌ Error in AvatarService.updateUserAvatar:', error);
      throw error instanceof Error ? error : new Error('Erro ao atualizar perfil');
    }
  }

  /**
   * Processo completo: upload + update profile
   */
  static async uploadAndUpdateAvatar(userId: string, imageUri: string): Promise<string> {
    try {
      console.log('🚀 AvatarService.uploadAndUpdateAvatar started:', {userId});

      // 1. Upload da imagem
      console.log('📸 Step 1: Uploading avatar...');
      const avatarUrl = await this.uploadAvatar(userId, imageUri);
      console.log('✅ Step 1 completed - Avatar uploaded:', avatarUrl);

      // 2. Atualizar perfil
      console.log('💾 Step 2: Updating profile...');
      await this.updateUserAvatar(userId, avatarUrl);
      console.log('✅ Step 2 completed - Profile updated');

      console.log('🎉 uploadAndUpdateAvatar completed successfully');
      return avatarUrl;
    } catch (error) {
      console.error('❌ Error in uploadAndUpdateAvatar:', error);
      throw error;
    }
  }

  /**
   * Processo completo: delete + update profile
   */
  static async deleteAndUpdateAvatar(userId: string): Promise<void> {
    try {
      console.log('🚀 AvatarService.deleteAndUpdateAvatar started:', {userId});

      // 1. Deletar do storage
      console.log('🗑️ Step 1: Deleting from storage...');
      await this.deleteAvatar(userId);
      console.log('✅ Step 1 completed - Avatar deleted from storage');

      // 2. Limpar URL do perfil
      console.log('💾 Step 2: Clearing profile avatar_url...');
      await this.updateUserAvatar(userId, null);
      console.log('✅ Step 2 completed - Profile avatar_url cleared');

      console.log('🎉 deleteAndUpdateAvatar completed successfully');
    } catch (error) {
      console.error('❌ Error in deleteAndUpdateAvatar:', error);
      throw error;
    }
  }

  /**
   * Verificar se avatar existe no storage
   */
  static async checkAvatarExists(userId: string): Promise<boolean> {
    try {
      console.log('🔍 Checking if avatar exists for user:', userId);

      const fileName = `${userId}/avatar.jpg`;
      const {data, error} = await supabase.storage
        .from(this.BUCKET_NAME)
        .list(userId);

      if (error) {
        console.error('❌ Error checking avatar existence:', error);
        return false;
      }

      const exists = data.some(file => file.name === 'avatar.jpg');
      console.log('🔍 Avatar exists check result:', {exists, files: data});

      return exists;
    } catch (error) {
      console.error('❌ Error in checkAvatarExists:', error);
      return false;
    }
  }

  /**
   * Obter URL do avatar com cache-busting
   */
  static getAvatarUrlWithCacheBusting(userId: string): string {
    const {data} = supabase.storage
      .from(this.BUCKET_NAME)
      .getPublicUrl(`${userId}/avatar.jpg`);

    return `${data.publicUrl}?t=${Date.now()}`;
  }

  /**
   * Limpar cache de avatar forçando re-download
   */
  static async forceClearAvatarCache(userId: string): Promise<void> {
    try {
      const url = this.getAvatarUrlWithCacheBusting(userId);

      // Tentar fazer fetch da nova URL para forçar update do cache
      await fetch(url, {
        method: 'HEAD',
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      console.log('✅ Avatar cache cleared for user:', userId);
    } catch (error) {
      console.warn('⚠️ Could not clear avatar cache:', error);
    }
  }
}
