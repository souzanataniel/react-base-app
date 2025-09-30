import React from 'react';
import {Alert} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {Avatar, Button, Text, YStack} from 'tamagui';
import {Edit3, User} from '@tamagui/lucide-icons';

interface EditableAvatarProps {
  imageUri?: string;
  userName: string;
  size?: '$8' | '$10' | '$12' | number;
  onImageChange?: (imageUri: string) => void;
  showEditIcon?: boolean;
  editIconSize?: number;
  editIconColor?: string;
  backgroundColor?: string;
  textColor?: string;
}

export const EditableAvatar: React.FC<EditableAvatarProps> = ({
                                                                imageUri,
                                                                userName,
                                                                size = '$12',
                                                                onImageChange,
                                                                backgroundColor = '$white1',
                                                                textColor = 'white'
                                                              }) => {
  const requestPermissions = async () => {
    const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permissão necessária',
        'Precisamos de permissão para acessar suas fotos.',
        [{text: 'OK'}]
      );
      return false;
    }
    return true;
  };

  const showImagePicker = () => {
    Alert.alert(
      'Alterar foto do perfil',
      'Localização da imagem:',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Câmera',
          onPress: openCamera
        },
        {
          text: 'Galeria',
          onPress: openGallery
        }
      ]
    );
  };

  const openCamera = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      onImageChange?.(result.assets[0].uri);
    }
  };

  const openGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      onImageChange?.(result.assets[0].uri);
    }
  };

  return (
    <YStack alignItems="center">
      <YStack position="relative" alignItems="center" justifyContent="center">
        <Button
          circular
          padding={0}
          borderWidth={0}
          backgroundColor="$white"
          pressStyle={{opacity: 0.8, scale: 0.95}}
          onPress={showImagePicker}
        >
          <YStack
            width={150}
            height={150}
            backgroundColor="$white"
            borderRadius={75}
            alignItems="center"
            justifyContent="center"
          >
            <Avatar
              circular
              size={size}
            >
              <Avatar.Image
                accessibilityLabel="Profile picture"
                src={imageUri}
              />
              <Avatar.Fallback
                backgroundColor={backgroundColor}
                alignItems="center"
                justifyContent="center"
              >
                <User size={40} color="$iconPlaceholder"/>
              </Avatar.Fallback>
            </Avatar>
          </YStack>
        </Button>

        <YStack
          position="absolute"
          top="150%"
          left="15%"
          backgroundColor="$white"
          borderRadius="$10"
          padding="$2"
          borderWidth={2}
          borderColor="$white"
          alignItems="center"
          justifyContent="center"
          width="$3"
          height="$3"
          zIndex={10}
        >
          <Edit3 size="$1" color="$absolutePrimary"/>
        </YStack>
      </YStack>

      <YStack marginTop="$10">
        <Text
          color="$white"
          fontSize="$7"
          fontWeight="600"
          textAlign="center"
        >
          {userName}
        </Text>
      </YStack>
    </YStack>
  );
};
