import {createClient} from '@supabase/supabase-js';
import {AuthResponse, SignInCredentials, SignUpCredentials, User} from '@/features/auth/types/auth.types';
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
    console.log('📝 Tentando cadastrar usuário...');

    const {data, error} = await supabase.auth.signUp({
      email: credentials.email.trim().toLowerCase(),
      password: credentials.password,
      options: {
        data: {
          first_name: credentials.firstName?.trim(),
          last_name: credentials.lastName?.trim(),
        },
      },
    });

    if (error) {
      console.log('❌ Erro no cadastro:', error.message);
      return {user: null, error: formatErrors(error)};
    }

    if (!data.user) {
      console.log('❌ Nenhum usuário retornado no cadastro');
      return {user: null, error: 'Erro ao criar conta'};
    }

    console.log('✅ Cadastro realizado com sucesso:', data.user.email);

    const user: User = {
      id: data.user.id,
      email: data.user.email!,
      firstName: credentials.firstName?.trim(),
      lastName: credentials.lastName?.trim(),
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

    // Busca dados do perfil
    const {data: profile} = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    const userData: User = {
      id: user.id,
      email: user.email!,
      firstName: profile?.first_name,
      lastName: profile?.last_name,
      createdAt: user.created_at,
    };

    console.log('✅ Dados do usuário recuperados');
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
      const user = await getCurrentUser();
      callback(user);
    } else {
      callback(null);
    }
  });
};
