import {SessionInfo} from './auth.types';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  emailVerified: boolean;
  phoneNumber?: string;
  phoneVerified?: boolean;
  dateOfBirth?: string;
  gender?: UserGender;
  language?: string;
  timezone?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export type UserGender = 'male' | 'female' | 'other' | 'prefer_not_to_say';

export interface UserProfile extends User {
  bio?: string;
  website?: string;
  location?: string;
  socialLinks?: SocialLinks;
  preferences?: UserPreferences;
  stats?: UserStats;
}

export interface SocialLinks {
  twitter?: string;
  linkedin?: string;
  github?: string;
  instagram?: string;
  facebook?: string;
}

export interface UserPreferences {
  notifications: NotificationPreferences;
  privacy: PrivacyPreferences;
  appearance: AppearancePreferences;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  marketing: boolean;
  updates: boolean;
  security: boolean;
}

export interface PrivacyPreferences {
  profileVisibility: 'public' | 'friends' | 'private';
  showEmail: boolean;
  showPhone: boolean;
  allowSearchByEmail: boolean;
  allowSearchByPhone: boolean;
}

export interface AppearancePreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  fontSize: 'small' | 'medium' | 'large';
  reducedMotion: boolean;
}

export interface UserStats {
  loginCount: number;
  lastActiveAt: string;
  accountAge: number; // em dias
  profileCompleteness: number; // 0-100
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: UserGender;
  bio?: string;
  website?: string;
  location?: string;
  language?: string;
  timezone?: string;
  socialLinks?: Partial<SocialLinks>;
}

export interface UpdatePreferencesRequest {
  notifications?: Partial<NotificationPreferences>;
  privacy?: Partial<PrivacyPreferences>;
  appearance?: Partial<AppearancePreferences>;
}

export interface UserActions {
  setUser: (user: User) => void;
  updateUser: (userData: Partial<User>) => void;
  refreshUser: () => Promise<void>;
  updateProfile: (data: UpdateUserRequest) => Promise<User>;
  clearUser: () => void;
}

export interface UserHelpers {
  isEmailVerified: () => boolean;
  getUserInitials: () => string;
  getUserDisplayName: () => string;
  getProfileCompleteness: () => number;
  canUpdateEmail: () => boolean;
  needsEmailVerification: () => boolean;
}

export interface AvatarUploadRequest {
  file: File | FormData;
  cropData?: CropData;
}

export interface CropData {
  x: number;
  y: number;
  width: number;
  height: number;
  scale?: number;
}

export interface AvatarResponse {
  url: string;
  thumbnailUrl?: string;
  originalUrl?: string;
}

export interface EmailVerificationRequest {
  email?: string;
}

export interface PhoneVerificationRequest {
  phoneNumber: string;
}

export interface VerificationCodeRequest {
  code: string;
  type: 'email' | 'phone';
}

export interface UserSearchParams {
  query?: string;
  email?: string;
  name?: string;
  verified?: boolean;
  lastLoginAfter?: string;
  lastLoginBefore?: string;
  limit?: number;
  offset?: number;
  orderBy?: UserOrderBy;
  orderDirection?: 'asc' | 'desc';
}

export type UserOrderBy = 'name' | 'email' | 'createdAt' | 'lastLoginAt';

export interface UserSearchResult {
  users: User[];
  total: number;
  hasMore: boolean;
}

export interface DeleteAccountRequest {
  password: string;
  reason?: string;
  feedback?: string;
}

export interface AccountDeletionInfo {
  scheduledAt: string;
  effectiveAt: string;
  canCancel: boolean;
}

export interface UserDataExport {
  user: User;
  preferences: UserPreferences;
  sessions: SessionInfo[];
  exportedAt: string;
  format: 'json' | 'csv';
}

export type {SessionInfo} from './auth.types';

export interface UserData {
  user: User | null;
  isLoadingUser: boolean;
}

export interface UserActions {
  setUser: (user: User) => void;
  updateUser: (userData: Partial<User>) => void;
  refreshUser: () => Promise<void>;
  updateProfile: (data: UpdateUserRequest) => Promise<User>;
  clearUser: () => void;
}

export interface UserHelpers {
  isEmailVerified: () => boolean;
  getUserInitials: () => string;
  getUserDisplayName: () => string;
}

export type UserState = UserData & UserActions & UserHelpers;
