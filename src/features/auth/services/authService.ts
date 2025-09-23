import {createClient} from '@supabase/supabase-js';
import {
  AuthResponse,
  ForgotPasswordCredentials,
  ForgotPasswordResponse,
  ResetPasswordCredentials,
  ResetPasswordResponse,
  SignInCredentials,
  SignUpCredentials,
  UpdatePasswordCredentials,
  UpdatePasswordResponse,
  User
} from '@/features/auth/types/auth.types';
import {formatErrors} from '@/features/auth/utils/authUtils';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: require('@react-native-async-storage/async-storage').default,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

/**
 * 🎯 MAPEIA Supabase User + Profile → User de domínio
 */
const mapSupabaseUserToDomain = async (supabaseUser: any): Promise<User | null> => {
  if (!supabaseUser) return null;

  try {
    // Busca dados do perfil
    const {data: profile} = await supabase
      .from('profiles')
      .select('*')
      .eq('id', supabaseUser.id)
      .single();

    const user: User = {
      // Básicos
      id: supabaseUser.id,
      email: supabaseUser.email!,
      firstName: profile?.first_name,
      lastName: profile?.last_name,
      displayName: profile?.display_name,
      phone: profile?.phone,
      dateOfBirth: profile?.date_of_birth,

      // Visual
      avatarUrl: profile?.avatar_url,

      // Localização
      country: profile?.country,
      city: profile?.city,
      timezone: profile?.timezone || 'America/Sao_Paulo',
      language: profile?.language || 'pt-BR',

      // Status
      isActive: profile?.is_active ?? true,
      isVerified: profile?.is_verified ?? false,

      // Preferências
      pushNotifications: profile?.push_notifications ?? true,
      emailNotifications: profile?.email_notifications ?? true,
      themePreference: profile?.theme_preference || 'system',

      // UX
      firstLoginAt: profile?.first_login_at,
      lastActiveAt: profile?.last_active_at || new Date().toISOString(),

      // Timestamps
      createdAt: profile?.created_at || supabaseUser.created_at,
      updatedAt: profile?.updated_at || supabaseUser.created_at,
    };

    return user;
  } catch (error) {
    console.error('❌ Erro ao mapear usuário:', error);
    // Retorna versão mínima se falhar
    return {
      id: supabaseUser.id,
      email: supabaseUser.email!,
      firstName: '',
      lastName: '',
      createdAt: supabaseUser.created_at,
    };
  }
};

/**
 * Faz login do usuário
 */
export const signIn = async (credentials: SignInCredentials): Promise<AuthResponse> => {
  try {
    console.log('🔐 Tentando fazer login...');

    const {data, error} = await supabase.auth.signInWithPassword({
      email: credentials.email.trim().toLowerCase(),
      password: credentials.password,
    });

    if (error) {
      console.log('❌ Erro no login:', error.message);
      return {user: null, error: formatErrors(error)};
    }

    if (!data.user) {
      console.log('❌ Nenhum usuário retornado');
      return {user: null, error: 'Erro ao fazer login'};
    }

    console.log('✅ Login realizado com sucesso:', data.user.email);

    // 🎯 MAPEAR CORRETAMENTE
    const user = await mapSupabaseUserToDomain(data.user);

    console.log('👤 Dados do usuário preparados:', user?.email);
    return {user, error: null};
  } catch (error) {
    console.error('💥 Exceção no login:', error);
    return {user: null, error: formatErrors(error)};
  }
};

/**
 * Cadastra novo usuário
 */
export const signUp = async (credentials: SignUpCredentials): Promise<AuthResponse> => {
  try {
    const {data, error} = await supabase.auth.signUp({
      email: credentials.email.trim().toLowerCase(),
      password: credentials.password,
      options: {
        data: {
          first_name: credentials.firstName?.trim(),
          last_name: credentials.lastName?.trim(),
          phone: credentials.phone?.trim(),
        },
      },
    });

    if (error) {
      console.log('❌ Erro detalhado no cadastro:', {
        message: error.message,
        status: error.status,
        details: error
      });
      return {user: null, error: formatErrors(error)};
    }

    if (!data.user) {
      console.log('❌ Nenhum usuário retornado no cadastro');
      return {user: null, error: 'Erro ao criar conta'};
    }

    console.log('✅ Usuário criado no auth:', data.user.id);

    // Verificar se o perfil foi criado
    await new Promise(resolve => setTimeout(resolve, 200)); // Aguarda 200ms

    const {data: profile, error: profileError} = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      console.log('⚠️ Erro ao buscar perfil criado:', profileError);
      console.log('🔧 Tentando criar perfil manualmente...');

      const {error: insertError} = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          first_name: credentials.firstName?.trim(),
          last_name: credentials.lastName?.trim(),
          display_name: `${credentials.firstName?.trim()} ${credentials.lastName?.trim()}`.trim(),
          phone: credentials.phone?.trim(),
        });

      if (insertError) {
        console.log('❌ Erro ao criar perfil manualmente:', insertError);
        return {user: null, error: 'Erro ao criar perfil do usuário'};
      }

      console.log('✅ Perfil criado manualmente');
    } else {
      console.log('✅ Perfil encontrado:', profile);
    }

    // 🎯 MAPEAR CORRETAMENTE
    const user = await mapSupabaseUserToDomain(data.user);

    return {user, error: null};
  } catch (error) {
    console.error('💥 Exceção no cadastro:', error);
    return {user: null, error: formatErrors(error)};
  }
};

/**
 * Faz logout do usuário
 */
export const signOut = async (): Promise<{ error: string | null }> => {
  try {
    console.log('🚪 Fazendo logout...');
    const {error} = await supabase.auth.signOut();

    if (error) {
      console.log('❌ Erro no logout:', error.message);
      return {error: formatErrors(error)};
    }

    console.log('✅ Logout realizado com sucesso');
    return {error: null};
  } catch (error) {
    console.error('💥 Exceção no logout:', error);
    return {error: formatErrors(error)};
  }
};

/**
 * 🎯 CORRIGIDO: Obtém usuário atual (já mapeado)
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    console.log('👤 Buscando usuário atual...');

    const {data: {user}} = await supabase.auth.getUser();

    if (!user) {
      console.log('❌ Nenhum usuário encontrado');
      return null;
    }

    console.log('👤 Usuário encontrado:', user.email);

    // 🎯 MAPEAR CORRETAMENTE
    const userData = await mapSupabaseUserToDomain(user);

    console.log('✅ Dados do usuário recuperados:', {
      hasProfile: !!userData,
      email: userData?.email,
      displayName: userData?.displayName,
      isActive: userData?.isActive
    });

    return userData;
  } catch (error) {
    console.error('💥 Erro ao obter usuário atual:', error);
    return null;
  }
};

/**
 * Obtém sessão atual
 */
export const getSession = async () => {
  try {
    console.log('🔍 Verificando sessão atual...');

    const {data: {session}, error} = await supabase.auth.getSession();

    if (error) {
      console.log('❌ Erro ao verificar sessão:', error.message);
      return null;
    }

    console.log('🔍 Sessão verificada:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      expiresAt: session?.expires_at,
      email: session?.user?.email
    });

    return session;
  } catch (error) {
    console.error('💥 Erro ao obter sessão:', error);
    return null;
  }
};

/**
 * 🎯 CORRIGIDO: Escuta mudanças no estado de autenticação
 * Agora retorna User de domínio (não Session)
 */
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  console.log('👂 Configurando listener de mudanças de auth...');

  return supabase.auth.onAuthStateChange(async (event, session) => {
    console.log('🔄 Auth state changed:', {event, hasSession: !!session, hasUser: !!session?.user});

    if (session?.user) {
      console.log('🔄 Session User Found');
      // 🎯 MAPEAR CORRETAMENTE antes de chamar callback
      const user = await mapSupabaseUserToDomain(session.user);
      callback(user);
    } else {
      callback(null);
    }
  });
};

/**
 * Envia email de recuperação de senha
 */
export const forgotPassword = async (credentials: ForgotPasswordCredentials): Promise<ForgotPasswordResponse> => {
  try {
    console.log('📧 Enviando email de recuperação para:', credentials.email);

    const {error} = await supabase.auth.resetPasswordForEmail(credentials.email, {
      redirectTo: `${process.env.EXPO_PUBLIC_APP_URL}/(auth)/reset-password`,
    });

    if (error) {
      console.log('❌ Erro ao enviar email de recuperação:', error.message);
      return {
        success: false,
        error: formatErrors(error),
        message: formatErrors(error)
      };
    }

    console.log('✅ Email de recuperação enviado com sucesso');
    return {
      success: true,
      message: 'Email de recuperação enviado com sucesso. Verifique sua caixa de entrada.'
    };
  } catch (error) {
    console.error('💥 Exceção ao enviar email de recuperação:', error);
    return {
      success: false,
      error: formatErrors(error),
      message: 'Erro inesperado ao enviar email de recuperação'
    };
  }
};

/**
 * Atualiza a senha do usuário
 */
export const resetPassword = async (credentials: ResetPasswordCredentials): Promise<ResetPasswordResponse> => {
  try {
    console.log('🔑 Atualizando senha do usuário...');

    const {error} = await supabase.auth.updateUser({
      password: credentials.password
    });

    if (error) {
      console.log('❌ Erro ao atualizar senha:', error.message);
      return {
        success: false,
        error: formatErrors(error),
        message: formatErrors(error)
      };
    }

    console.log('✅ Senha atualizada com sucesso');
    return {
      success: true,
      message: 'Senha atualizada com sucesso!'
    };
  } catch (error) {
    console.error('💥 Exceção ao atualizar senha:', error);
    return {
      success: false,
      error: formatErrors(error),
      message: 'Erro inesperado ao atualizar senha'
    };
  }
};

/**
 * Verifica se o token de reset é válido
 */
export const verifyResetToken = async (): Promise<{ isValid: boolean; user?: User }> => {
  try {
    console.log('🔍 Verificando token de reset...');

    const {data: {user}, error} = await supabase.auth.getUser();

    if (error || !user) {
      console.log('❌ Token inválido ou expirado');
      return {isValid: false};
    }

    console.log('✅ Token válido para usuário:', user.email);

    // 🎯 MAPEAR CORRETAMENTE
    const userData = await mapSupabaseUserToDomain(user);

    return {
      isValid: true,
      user: userData || undefined
    };
  } catch (error) {
    console.error('💥 Erro ao verificar token:', error);
    return {isValid: false};
  }
};

/**
 * Atualiza a senha do usuário após validar a senha atual
 */
export const updatePassword = async (credentials: UpdatePasswordCredentials): Promise<UpdatePasswordResponse> => {
  try {
    console.log('🔑 Atualizando senha do usuário...');

    // Primeiro, obter o usuário atual para pegar o email
    const {data: {user}, error: userError} = await supabase.auth.getUser();

    if (userError || !user) {
      console.log('❌ Usuário não encontrado ou não autenticado');
      return {
        success: false,
        error: 'Usuário não autenticado',
        message: 'Você precisa estar logado para alterar a senha'
      };
    }

    console.log('👤 Validando senha atual para:', user.email);

    // Validar a senha atual tentando fazer login
    const {error: signInError} = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: credentials.currentPassword
    });

    if (signInError) {
      console.log('❌ Senha atual incorreta:', signInError.message);
      return {
        success: false,
        error: 'Senha atual incorreta',
        message: 'A senha atual informada está incorreta'
      };
    }

    console.log('✅ Senha atual validada, atualizando para nova senha...');

    // Atualizar para a nova senha
    const {error: updateError} = await supabase.auth.updateUser({
      password: credentials.newPassword
    });

    if (updateError) {
      console.log('❌ Erro ao atualizar senha:', updateError.message);
      return {
        success: false,
        error: formatErrors(updateError),
        message: formatErrors(updateError)
      };
    }

    console.log('✅ Senha atualizada com sucesso');
    return {
      success: true,
      message: 'Senha atualizada com sucesso!'
    };
  } catch (error) {
    console.error('💥 Exceção ao atualizar senha:', error);
    return {
      success: false,
      error: formatErrors(error),
      message: 'Erro inesperado ao atualizar senha'
    };
  }
};
