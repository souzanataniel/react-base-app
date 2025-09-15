import {createClient} from '@supabase/supabase-js';
import {
  AuthResponse,
  ForgotPasswordCredentials,
  ForgotPasswordResponse,
  ResetPasswordCredentials,
  ResetPasswordResponse,
  SignInCredentials,
  SignUpCredentials,
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

    // Busca dados do perfil
    const {data: profile} = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    const user: User = {
      id: data.user.id,
      email: data.user.email!,
      firstName: profile?.first_name,
      lastName: profile?.last_name,
      createdAt: data.user.created_at,
    };

    console.log('👤 Dados do usuário preparados:', user.email);
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

    const user: User = {
      id: data.user.id,
      email: data.user.email!,
      firstName: credentials.firstName?.trim(),
      lastName: credentials.lastName?.trim(),
      phone: credentials.phone?.trim(),
      createdAt: data.user.created_at,
    };

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
 * Obtém usuário atual
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

    const {data: profile, error: profileError} = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.warn('⚠️ Erro ao buscar perfil:', profileError.message);
    }

    const userData: User = {
      // Básicos
      id: user.id,
      email: user.email!,
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
      createdAt: profile?.created_at || user.created_at,
      updatedAt: profile?.updated_at || user.created_at,
    };

    console.log('✅ Dados do usuário recuperados:', {
      hasProfile: !!profile,
      email: userData.email,
      displayName: userData.displayName,
      isActive: userData.isActive
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
 * Escuta mudanças no estado de autenticação
 */
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  console.log('👂 Configurando listener de mudanças de auth...');

  return supabase.auth.onAuthStateChange(async (event, session) => {
    console.log('🔄 Auth state changed:', {event, hasSession: !!session, hasUser: !!session?.user});

    if (session?.user) {
      console.log('🔄 Session User Found');
      const user = await getCurrentUser();
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
    console.log('🔐 Atualizando senha do usuário...');

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

    // Buscar dados completos do perfil
    const userData = await getCurrentUser();

    return {
      isValid: true,
      user: userData || undefined
    };
  } catch (error) {
    console.error('💥 Erro ao verificar token:', error);
    return {isValid: false};
  }
};
