import React from 'react';
import {ActivityIndicator, Image, StyleSheet, View, ViewStyle} from 'react-native';
import {User} from '@tamagui/lucide-icons';
import {useAvatarThumbnail} from '@/features/profile/hooks/useAvatarThumbnail';

interface AvatarIconProps {
  size?: number;
  style?: ViewStyle;
  borderRadius?: number;
  backgroundColor?: string;
  showLoading?: boolean;
  userId?: string; // Para usar avatar específico de outro usuário
}

export const AvatarIcon: React.FC<AvatarIconProps> = ({
                                                        size = 40,
                                                        style,
                                                        borderRadius,
                                                        backgroundColor = '#f8f9fa',
                                                        showLoading = true,
                                                        userId,
                                                      }) => {
  const {thumbnailUrl, loading} = useAvatarThumbnail();

  const finalBorderRadius = borderRadius !== undefined ? borderRadius : size / 2;

  const containerStyle: ViewStyle = {
    width: size,
    height: size,
    borderRadius: finalBorderRadius,
    backgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...style,
  };

  if (loading && showLoading) {
    return (
      <View style={containerStyle}>
        <ActivityIndicator size="small" color="#666"/>
      </View>
    );
  }

  if (thumbnailUrl) {
    return (
      <View style={containerStyle}>
        <Image
          source={{uri: thumbnailUrl}}
          style={{
            width: size,
            height: size,
            borderRadius: finalBorderRadius,
          }}
          resizeMode="cover"
          onError={() => console.warn('Thumbnail failed to load:', thumbnailUrl)}
        />
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      <User size={size * 0.6} color="#666"/>
    </View>
  );
};

// Componente especializado para lista/cards pequenos
export const AvatarIconSmall: React.FC<Omit<AvatarIconProps, 'size'>> = (props) => (
  <AvatarIcon size={32} {...props} />
);

// Componente especializado para ícones médios
export const AvatarIconMedium: React.FC<Omit<AvatarIconProps, 'size'>> = (props) => (
  <AvatarIcon size={48} {...props} />
);

// Componente com badge/indicador
interface AvatarIconWithBadgeProps extends AvatarIconProps {
  badgeColor?: string;
  showBadge?: boolean;
}

export const AvatarIconWithBadge: React.FC<AvatarIconWithBadgeProps> = ({
                                                                          badgeColor = '#28a745',
                                                                          showBadge = false,
                                                                          ...props
                                                                        }) => {
  return (
    <View style={styles.badgeContainer}>
      <AvatarIcon {...props} />
      {showBadge && (
        <View
          style={[
            styles.badge,
            {
              backgroundColor: badgeColor,
              width: (props.size || 40) * 0.25,
              height: (props.size || 40) * 0.25,
              borderRadius: ((props.size || 40) * 0.25) / 2,
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  badgeContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: 'white',
  },
});

export default AvatarIcon;
