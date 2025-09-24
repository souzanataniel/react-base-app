import {User} from '@/features/auth/types/auth.types';

export interface AvatarUploadResult {
  publicUrl: string;
  path: string;
}

export interface AvatarHookReturn {
  avatarUrl: string | null;
  uploading: boolean;
  progress: number;
  uploadAvatar: (imageUri: string) => Promise<string>;
  pickImage: (source?: 'camera' | 'gallery') => Promise<string | undefined>;
  loadAvatar: () => Promise<void>;
  deleteAvatar: () => Promise<void>;
  updateUserAvatar: (avatarUrl: string) => Promise<void>;
}

export type ImageSource = 'camera' | 'gallery';

export interface CompressedImage {
  uri: string;
  width: number;
  height: number;
}

export interface UserWithAvatar extends User {
  avatarUrl?: string;
}
