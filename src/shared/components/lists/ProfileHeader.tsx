import {Avatar, Text, View, YStack} from 'tamagui';
import {Edit3, User} from '@tamagui/lucide-icons';
import React from 'react';
import {Platform, Pressable} from 'react-native';
import {ProfileHeaderProps} from '@/shared/components/lists/types';

export const ProfileHeader = ({
                                name,
                                subtitle,
                                avatarUri,
                                onEditPress,
                                size = 'medium',
                                showEditButton = true,
                              }: ProfileHeaderProps) => {
  const sizeConfig = {
    small: {avatarSize: '$8', nameSize: '$6', padding: '$4'},
    medium: {avatarSize: '$10', nameSize: '$7', padding: '$3'},
    large: {avatarSize: '$12', nameSize: '$8', padding: '$6'},
  };

  const marginBottom = Platform.OS === 'ios' ? "$4": "$6";

  const config = sizeConfig[size];

  return (
    <YStack alignItems="center"
            paddingVertical={config.padding}
            marginLeft={16}
            marginRight={16}
            borderRadius="$4"
            backgroundColor="$card"
            style={{
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.06,
              shadowRadius: 8,
              elevation: 2,
              borderWidth: 1,
              borderColor: 'rgba(0, 0, 0, 0.04)',
            }}
            marginTop={marginBottom}
    >
      <View position="relative" marginBottom="$3">
        <Avatar circular size={config.avatarSize}>
          {avatarUri && (
            <Avatar.Image source={{uri: avatarUri}}/>
          )}
          <Avatar.Fallback backgroundColor="$defaultSecondarySystemBackground">
            <User size={size === 'large' ? 60 : 50} color="$defaultSecondaryLabel"/>
          </Avatar.Fallback>
        </Avatar>

        {showEditButton && (
          <Pressable
            onPress={onEditPress}
            style={{
              position: 'absolute',
              bottom: 4,
              right: 4,
              backgroundColor: 'white',
              borderRadius: 15,
              width: 30,
              height: 30,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 3},
              shadowOpacity: 0.15,
              shadowRadius: 6,
              elevation: 4,
            }}
          >
            <Edit3 size={20} color="#2873FF"/>
          </Pressable>
        )}
      </View>

      <YStack alignItems="center" gap="$1">
        <Text fontSize={config.nameSize} fontWeight="600" color="$color">
          {name}
        </Text>
        {subtitle && (
          <Text fontSize="$4" color="$colorSecondary" fontWeight="400">
            {subtitle}
          </Text>
        )}
      </YStack>
    </YStack>
  );
};
