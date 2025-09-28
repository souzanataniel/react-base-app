import {createClient, SupabaseClient} from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: require('@react-native-async-storage/async-storage').default,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

if (__DEV__) {
  supabase.auth.onAuthStateChange((event, session) => {
    console.log('🔄 Auth Event:', event, session?.user?.email || 'No user');
  });
}
