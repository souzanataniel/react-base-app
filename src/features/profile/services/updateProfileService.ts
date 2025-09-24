import {User} from '@/features/auth/types/auth.types';
import {UpdateProfileFormData} from '@/features/profile/schema/updateProfileSchema';
import {supabase} from '@/lib/supabase';

export interface UpdateProfileResponse {
  user: User | null;
  error: string | null;
  success: boolean;
}

/**
 * Atualiza o perfil do usuário no Supabase
 */
export const updateProfile = async (
  userId: string,
  profileData: UpdateProfileFormData
): Promise<UpdateProfileResponse> => {
  try {
    console.log('🔄 Atualizando perfil do usuário:', userId);
    console.log('📝 Dados a serem atualizados:', profileData);

    // Prepara os dados para o formato do banco
    const updateData = {
      first_name: profileData.firstName?.trim(),
      last_name: profileData.lastName?.trim(),
      display_name: profileData.displayName?.trim(),
      phone: profileData.phone?.trim(),
      date_of_birth: profileData.dateOfBirth?.trim(),
      updated_at: new Date().toISOString(),
    };

    const cleanedData = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== '' && value !== undefined)
    );

    console.log('🧹 Dados limpos para atualização:', cleanedData);

    const {data: updatedProfile, error: updateError} = await supabase
      .from('profiles')
      .update(cleanedData)
      .eq('id', userId)
      .select('*')
      .single();

    if (updateError) {
      console.log('❌ Erro ao atualizar perfil:', updateError.message);
      return {
        user: null,
        error: `Erro ao atualizar perfil: ${updateError.message}`,
        success: false
      };
    }

    if (!updatedProfile) {
      console.log('❌ Nenhum perfil retornado após atualização');
      return {
        user: null,
        error: 'Erro: perfil não encontrado após atualização',
        success: false
      };
    }

    console.log('✅ Perfil atualizado com sucesso:', updatedProfile);

    const {data: {user: authUser}, error: authError} = await supabase.auth.getUser();

    if (authError || !authUser) {
      console.log('⚠️ Erro ao buscar dados do auth após atualização');
      return {
        user: null,
        error: 'Erro ao sincronizar dados do usuário',
        success: false
      };
    }

    // Monta objeto User completo
    const updatedUser: User = {
      // Básicos
      id: authUser.id,
      email: authUser.email!,
      firstName: updatedProfile.first_name,
      lastName: updatedProfile.last_name,
      displayName: updatedProfile.display_name,
      phone: updatedProfile.phone,
      dateOfBirth: updatedProfile.date_of_birth,

      // Visual
      avatarUrl: updatedProfile.avatar_url,

      // Localização
      country: updatedProfile.country,
      city: updatedProfile.city,
      timezone: updatedProfile.timezone || 'America/Sao_Paulo',
      language: updatedProfile.language || 'pt-BR',

      // Status
      isActive: updatedProfile.is_active ?? true,
      isVerified: updatedProfile.is_verified ?? false,

      // Preferências
      pushNotifications: updatedProfile.push_notifications ?? true,
      emailNotifications: updatedProfile.email_notifications ?? true,
      themePreference: updatedProfile.theme_preference || 'system',

      // UX
      firstLoginAt: updatedProfile.first_login_at,
      lastActiveAt: updatedProfile.last_active_at || new Date().toISOString(),

      // Timestamps
      createdAt: updatedProfile.created_at || authUser.created_at,
      updatedAt: updatedProfile.updated_at,
    };

    console.log('✅ Dados do usuário atualizados preparados:', {
      email: updatedUser.email,
      displayName: updatedUser.displayName,
      phone: updatedUser.phone,
      dateOfBirth: updatedUser.dateOfBirth
    });

    return {
      user: updatedUser,
      error: null,
      success: true
    };

  } catch (error) {
    console.error('💥 Exceção ao atualizar perfil:', error);
    return {
      user: null,
      error: error instanceof Error ? error.message : 'Erro inesperado ao atualizar perfil',
      success: false
    };
  }
};

/**
 * Atualiza apenas campos específicos do perfil
 */
export const updateProfileField = async (
  userId: string,
  field: keyof UpdateProfileFormData,
  value: string
): Promise<UpdateProfileResponse> => {
  try {
    console.log(`🔄 Atualizando campo ${field} do usuário:`, userId);

    const fieldMap: Record<keyof UpdateProfileFormData, string> = {
      firstName: 'first_name',
      lastName: 'last_name',
      displayName: 'display_name',
      phone: 'phone',
      dateOfBirth: 'date_of_birth',
    };

    const dbField = fieldMap[field];
    if (!dbField) {
      return {
        user: null,
        error: `Campo ${field} não é válido`,
        success: false
      };
    }

    const updateData = {
      [dbField]: value?.trim(),
      updated_at: new Date().toISOString(),
    };

    const {error} = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId);

    if (error) {
      console.log(`❌ Erro ao atualizar ${field}:`, error.message);
      return {
        user: null,
        error: `Erro ao atualizar ${field}: ${error.message}`,
        success: false
      };
    }

    console.log(`✅ Campo ${field} atualizado com sucesso`);

    // Retorna dados atualizados
    return await getCurrentUserProfile(userId);

  } catch (error) {
    console.error(`💥 Exceção ao atualizar ${field}:`, error);
    return {
      user: null,
      error: error instanceof Error ? error.message : `Erro inesperado ao atualizar ${field}`,
      success: false
    };
  }
};

/**
 * Busca perfil completo do usuário atual
 */
export const getCurrentUserProfile = async (userId: string): Promise<UpdateProfileResponse> => {
  try {
    console.log('👤 Buscando perfil completo do usuário:', userId);

    const {data: profile, error: profileError} = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.log('❌ Erro ao buscar perfil:', profileError.message);
      return {
        user: null,
        error: `Erro ao buscar perfil: ${profileError.message}`,
        success: false
      };
    }

    const {data: {user: authUser}, error: authError} = await supabase.auth.getUser();

    if (authError || !authUser) {
      return {
        user: null,
        error: 'Erro ao buscar dados de autenticação',
        success: false
      };
    }

    const user: User = {
      // Básicos
      id: authUser.id,
      email: authUser.email!,
      firstName: profile.first_name,
      lastName: profile.last_name,
      displayName: profile.display_name,
      phone: profile.phone,
      dateOfBirth: profile.date_of_birth,

      // Visual
      avatarUrl: profile.avatar_url,

      // Localização
      country: profile.country,
      city: profile.city,
      timezone: profile.timezone || 'America/Sao_Paulo',
      language: profile.language || 'pt-BR',

      // Status
      isActive: profile.is_active ?? true,
      isVerified: profile.is_verified ?? false,

      // Preferências
      pushNotifications: profile.push_notifications ?? true,
      emailNotifications: profile.email_notifications ?? true,
      themePreference: profile.theme_preference || 'system',

      // UX
      firstLoginAt: profile.first_login_at,
      lastActiveAt: profile.last_active_at || new Date().toISOString(),

      // Timestamps
      createdAt: profile.created_at || authUser.created_at,
      updatedAt: profile.updated_at,
    };

    return {
      user,
      error: null,
      success: true
    };

  } catch (error) {
    console.error('💥 Exceção ao buscar perfil:', error);
    return {
      user: null,
      error: error instanceof Error ? error.message : 'Erro inesperado ao buscar perfil',
      success: false
    };
  }
};
