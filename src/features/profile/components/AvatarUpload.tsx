import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageStyle,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import {useAvatar} from '../hooks/useAvatar';
import {Ionicons} from '@expo/vector-icons';
import type {ImageSource} from '../types/avatar';

interface AvatarUploadProps {
  size?: number;
  showEditIcon?: boolean;
  showDeleteOption?: boolean;
  onUploadSuccess?: (url: string) => void;
  onUploadError?: (error: Error) => void;
  style?: ViewStyle;
  disabled?: boolean;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({
                                                     size = 100,
                                                     showEditIcon = true,
                                                     showDeleteOption = true,
                                                     onUploadSuccess,
                                                     onUploadError,
                                                     style,
                                                     disabled = false,
                                                   }) => {
  const {avatarUrl, uploading, progress, pickImage, deleteAvatar} = useAvatar();

  const handleImagePicker = (): void => {
    if (disabled || uploading) return;

    const options = [
      {text: 'Câmera', onPress: () => handlePickImage('camera')},
      {text: 'Galeria', onPress: () => handlePickImage('gallery')},
    ];

    if (avatarUrl && showDeleteOption) {
      options.push({text: 'Remover Foto', onPress: handleDeleteAvatar});
    }

    options.push({text: 'Cancelar', onPress: () => new Promise<void>(() => {})});

    Alert.alert(
      'Foto do Perfil',
      'Escolha uma opção',
      options
    );
  };

  const handlePickImage = async (source: ImageSource): Promise<void> => {
    try {
      const result = await pickImage(source);
      if (result && onUploadSuccess) {
        onUploadSuccess(result);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error : new Error('Erro desconhecido');
      console.error('Erro no upload:', errorMessage);

      if (onUploadError) {
        onUploadError(errorMessage);
      } else {
        Alert.alert('Erro', 'Falha ao fazer upload da imagem');
      }
    }
  };

  const handleDeleteAvatar = async (): Promise<void> => {
    Alert.alert(
      'Confirmar',
      'Tem certeza que deseja remover sua foto do perfil?',
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAvatar();
            } catch (error) {
              Alert.alert('Erro', 'Falha ao remover foto do perfil');
            }
          }
        },
      ]
    );
  };

  // ✅ CORRIGIDO: Usar StyleSheet.flatten para arrays de estilos
  const containerStyle = StyleSheet.flatten([
    styles.container,
    {width: size, height: size},
    style
  ]);

  const avatarStyle = StyleSheet.flatten([
    styles.avatar,
    {width: size, height: size, borderRadius: size / 2}
  ]);

  const placeholderStyle = StyleSheet.flatten([
    styles.placeholder,
    {width: size, height: size, borderRadius: size / 2}
  ]);

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={handleImagePicker}
      disabled={disabled || uploading}
      activeOpacity={0.7}
    >
      {avatarUrl ? (
        <Image
          source={{uri: avatarUrl}}
          style={avatarStyle}
          resizeMode="cover"
        />
      ) : (
        <View style={placeholderStyle}>
          <Ionicons
            name="person"
            size={size * 0.4}
            color="#666"
          />
        </View>
      )}

      {showEditIcon && !uploading && (
        <View style={styles.editIcon}>
          <Ionicons
            name="camera"
            size={16}
            color="white"
          />
        </View>
      )}

      {uploading && (
        <View style={[styles.uploadingOverlay, {borderRadius: size / 2}]}>
          <ActivityIndicator color="white" size="small"/>
          <Text style={styles.uploadingText}>
            {progress > 0 ? `${progress}%` : 'Enviando...'}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

// ✅ CORRIGIDO: Interface de estilos mais específica
interface Styles {
  container: ViewStyle;
  avatar: ImageStyle;
  placeholder: ViewStyle;
  editIcon: ViewStyle;
  uploadingOverlay: ViewStyle;
  uploadingText: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    position: 'relative',
  },
  avatar: {
    backgroundColor: '#f0f0f0',
  },
  placeholder: {
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#dee2e6',
    borderStyle: 'dashed',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007AFF',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadingText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
});

export default AvatarUpload;
