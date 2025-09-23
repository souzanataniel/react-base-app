import type {User as SbUser} from '@supabase/supabase-js'
import {User} from '@/features/auth/types/auth.types';

export function mapSupabaseUser(sb: SbUser): User {
  return {
    id: sb.id,
    email: sb.email ?? '',
    firstName: (sb.user_metadata?.firstName ?? sb.user_metadata?.first_name ?? '') as string,
    lastName: (sb.user_metadata?.lastName ?? sb.user_metadata?.last_name ?? '') as string,
    createdAt: (sb.created_at ?? '') as string,
  }
}
