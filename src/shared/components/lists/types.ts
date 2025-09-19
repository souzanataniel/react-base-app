export type MenuItemData = {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  iconBg?: string;
  showSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  onPress?: () => void;
  disabled?: boolean;
  rightContent?: React.ReactNode;
};

export type MenuSectionData = {
  title?: string;
  items: MenuItemData[];
};

export type ProfileHeaderProps = {
  name: string;
  subtitle?: string;
  avatarUri?: string;
  onEditPress?: () => void;
  size?: 'small' | 'medium' | 'large';
  showEditButton?: boolean;
};

export type ListSectionProps = {
  title?: string;
  children: React.ReactNode;
  showSeparators?: boolean;
  marginTop?: any;
};

export type ListItemProps = {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  iconBg?: string;
  iconSize?: number;
  showChevron?: boolean;
  showSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  onPress?: () => void;
  disabled?: boolean;
  rightContent?: React.ReactNode;
};
