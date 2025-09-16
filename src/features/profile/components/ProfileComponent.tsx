import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Button, ScrollView, Separator, Text, XStack, YStack} from 'tamagui';
import {ChevronRight, Edit3, Lock, LogOut, Mail, Settings} from '@tamagui/lucide-icons';
import {PatternOverlay} from '@/shared/components/ui/GradientDotPattern/PatternOverlay';
import {EditableAvatar} from '@/shared/components/ui/EditableAvatar/EditableAvatar';

interface ProfileOptionProps {
  icon: React.ReactNode;
  title: string;
  onPress: () => void;
}

const ProfileOption: React.FC<ProfileOptionProps> = ({icon, title, onPress,}) => (
  <Button
    backgroundColor="transparent"
    borderRadius={0}
    paddingHorizontal="$4"
    paddingVertical="$2"
    borderWidth={0}
    height="auto"
    minHeight="$5"
    onPress={onPress}
    width="100%"
    justifyContent="flex-start"
    alignItems="center"
  >
    <XStack
      alignItems="center"
      justifyContent="space-between"
      width="100%"
      flex={1}
      minHeight="$3"
    >
      <XStack alignItems="center" gap="$3" flex={1} minHeight="$3">
        <YStack justifyContent="center" minHeight="$3">
          {icon}
        </YStack>
        <YStack flex={1} justifyContent="center" minHeight="$3">
          <Text
            fontSize="$4"
            lineHeight="$4"
            color="$absoluteTextTertiary"
            fontWeight="400"
            numberOfLines={2}
            flexWrap="wrap"
          >
            {title}
          </Text>
        </YStack>
      </XStack>
      <YStack justifyContent="center" minHeight="$3" marginLeft="$2">
        <ChevronRight size={20} color="$gray10"/>
      </YStack>
    </XStack>
  </Button>
);

interface ProfileComponentProps {
  userName: string;
  userImage?: string;
  onEditProfile?: () => void;
  onChangePassword?: () => void;
  onChangeEmail?: () => void;
  onSettings?: () => void;
  onLogout?: () => void;
}

export const ProfileComponent: React.FC<ProfileComponentProps> = ({
                                                                    userName,
                                                                    userImage,
                                                                    onEditProfile,
                                                                    onChangePassword,
                                                                    onChangeEmail,
                                                                    onSettings,
                                                                    onLogout
                                                                  }) => {
  const insets = useSafeAreaInsets();

  const profileOptions = [
    {
      icon: <Edit3 size={24} color="$absoluteTextTertiary"/>,
      title: 'Alterar Dados Pessoais',
      onPress: onEditProfile || (() => {})
    },
    {
      icon: <Lock size={24} color="$absoluteTextTertiary"/>,
      title: 'Alterar Senha',
      onPress: onChangePassword || (() => {})
    },
    {
      icon: <Mail size={24} color="$absoluteTextTertiary"/>,
      title: 'Alterar Email Cadastrado',
      onPress: onChangeEmail || (() => {})
    },
    {
      icon: <Settings size={24} color="$absoluteTextTertiary"/>,
      title: 'Configurações',
      onPress: onSettings || (() => {})
    },
  ];

  return (
    <YStack flex={1} backgroundColor="$lightest">
      {/* Header Verde */}
      <YStack
        backgroundColor="$absolutePrimary"
        paddingTop={insets.top}
        paddingBottom="$12"
        position="relative"
        zIndex={1}
      >
        <PatternOverlay
          spacing={10}
          dotSize={3}
          baseOpacity={0.3}
          color="white"
          startX={15}
          gradientIntensity={1}
          containerWidth={800}
          containerHeight={800}
          zIndex={-1}
        />

        {/* Área do perfil */}
        <YStack alignItems="center" paddingHorizontal="$4" marginTop="$10">
          <EditableAvatar
            imageUri="https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250"
            userName={userName}
            size="$12"
            onImageChange={(newUri) => {
              console.log('Nova imagem:', newUri);
            }}
            textColor="white"
          />
        </YStack>
      </YStack>

      {/* Card de opções sobrepondo o header */}
      <YStack
        backgroundColor="$absoluteWhite"
        marginHorizontal="$4"
        borderRadius="$6"
        marginTop="$-10"
        paddingVertical="$4"
        elevation={4}
        shadowColor="$shadowColor"
        shadowOffset={{width: 0, height: 2}}
        shadowOpacity={0.1}
        shadowRadius={8}
        zIndex={2}
        position="relative"
        maxHeight="45%"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{flexGrow: 1}}
          scrollEnabled={true}
          bounces={false} // Desabilita bounce sempre
          overScrollMode="never" // Android: remove efeito glow
          alwaysBounceVertical={false} // iOS: desabilita bounce vertical
        >
          {profileOptions.map((option, index) => (
            <YStack key={index}>
              <ProfileOption
                icon={option.icon}
                title={option.title}
                onPress={option.onPress}
              />
              {index < profileOptions.length - 1 && (
                <Separator marginHorizontal="$4" borderColor="$absoluteBorderLight"/>
              )}
            </YStack>
          ))}

          <Separator marginHorizontal="$4" borderColor="$absoluteBorderLight"/>

          <ProfileOption
            icon={<LogOut size={24} color="$absoluteTextTertiary"/>}
            title="Sair do App"
            onPress={onLogout || (() => {})}
          />
        </ScrollView>
      </YStack>
    </YStack>
  );
};
