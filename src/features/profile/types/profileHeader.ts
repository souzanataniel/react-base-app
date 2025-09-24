export interface ProfileHeaderProps {
  name: string;
  subtitle?: string;
  onEditPress?: () => void;
  size?: 'small' | 'medium' | 'large';
  showEditButton?: boolean;
  enableAvatarUpload?: boolean;
  onAvatarUploadSuccess?: (url: string) => void;
  onAvatarUploadError?: (error: Error) => void;
}
