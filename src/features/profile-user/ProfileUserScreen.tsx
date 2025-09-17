import React, {useState} from 'react';
import {Pressable, ScrollView} from 'react-native';
import {Avatar, Separator, Switch, Text, Theme, View, XStack, YStack,} from 'tamagui';
import {
  ArrowLeft,
  Building2,
  ChevronRight,
  Clock,
  Edit3,
  Eye,
  EyeOff,
  FileText,
  Lock,
  Shield,
  User,
} from '@tamagui/lucide-icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useRouter} from 'expo-router';

const ProfileHeader = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <YStack>
      <YStack height={insets.top} backgroundColor="$background"/>

      <XStack
        alignItems="center"
        paddingHorizontal="$4"
        backgroundColor="$background"
        minHeight={44}
        position="relative"
      >
        <Pressable
          onPress={() => router.back()}
          style={{
            position: 'absolute',
            left: 16,
            padding: 4,
            zIndex: 1,
          }}
        >
          <ArrowLeft size={24} color="$color"/>
        </Pressable>

        <XStack flex={1} alignItems="center" justifyContent="center">
          <Text fontSize="$5" fontWeight="600" color="$color">
            Profile
          </Text>
        </XStack>
      </XStack>
    </YStack>
  );
};

type MenuItemProps = {
  icon: React.ReactNode;
  title: string;
  showSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  onPress?: () => void;
};

const MenuItem = ({
                    icon,
                    title,
                    showSwitch = false,
                    switchValue = false,
                    onSwitchChange,
                    onPress,
                  }: MenuItemProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => ({
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <XStack
        alignItems="center"
        paddingVertical="$2.5"
        paddingHorizontal="$4"
        backgroundColor="white"
        minHeight={48}
      >
        <XStack alignItems="center" flex={1} gap="$3">
          <View
            width={32}
            height={32}
            backgroundColor="$primary"
            borderRadius={8}
            borderWidth={0}
            alignItems="center"
            justifyContent="center"
          >
            {icon}
          </View>
          <Text fontSize="$4" color="$color" fontWeight="500">
            {title}
          </Text>
        </XStack>

        {showSwitch ? (
          <Switch
            size="$3"
            checked={switchValue}
            onCheckedChange={onSwitchChange}
          >
            <Switch.Thumb animation="quick"/>
          </Switch>
        ) : (
          <ChevronRight size={18} color="$lighter"/>
        )}
      </XStack>
    </Pressable>
  );
};

// Componente de Seção
type SectionProps = {
  title?: string;
  children: React.ReactNode;
};

const Section = ({title, children}: SectionProps) => {
  return (
    <YStack gap="$1" marginTop="$4">
      {title && (
        <Text
          fontSize="$2"
          color="$color10"
          fontWeight="600"
          paddingBottom="$2"
          textTransform="uppercase"
        >
          {title}
        </Text>
      )}
      <YStack backgroundColor="white" borderRadius="$4" overflow="hidden">
        {children}
      </YStack>
    </YStack>
  );
};

export function ProfileUserScreen() {
  const [faceIdEnabled, setFaceIdEnabled] = useState(true);
  const [hideBalances, setHideBalances] = useState(false);

  return (
    <Theme name="light">
      <YStack flex={1} backgroundColor="$backgroundSoft">
        <ProfileHeader/>

        <ScrollView showsVerticalScrollIndicator={false}>
          <YStack paddingHorizontal="$4" paddingTop="$2">
            {/* Profile Section */}
            <YStack alignItems="center" gap="$4" marginBottom="$6">
              {/* Avatar centralizado com ícone de edição */}
              <XStack alignItems="flex-end" position="relative">
                <Avatar circular size="$9" backgroundColor="$gray8">
                  <Avatar.Image
                    source={{
                      uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
                    }}
                  />
                  <Avatar.Fallback backgroundColor="$gray8">
                    <User size={50} color="$gray11"/>
                  </Avatar.Fallback>
                </Avatar>

                {/* Ícone de edição */}
                <Pressable
                  style={{
                    position: 'absolute',
                    bottom: 2,
                    right: 2,
                    backgroundColor: 'white',
                    borderRadius: 16,
                    padding: 6,
                    shadowColor: '#000',
                    shadowOffset: {width: 0, height: 1},
                    shadowOpacity: 0.2,
                    shadowRadius: 2,
                    elevation: 2,
                  }}
                >
                  <Edit3 size={16} color="$color10"/>
                </Pressable>
              </XStack>

              {/* Nome e subtítulo centralizados abaixo do avatar */}
              <YStack alignItems="center" gap="$1">
                <Text fontSize="$6" fontWeight="700" color="$color">
                  Adrian UIUX
                </Text>
                <Text fontSize="$3" color="$color10">
                  Personal account
                </Text>
              </YStack>
            </YStack>

            {/* Profile Menu Section */}
            <Section title="Profile">
              <MenuItem
                icon={<User size={22} color="$white"/>}
                title="Card confirmation"
              />
              <YStack paddingLeft={46}>
                <Separator/>
              </YStack>
              <MenuItem
                icon={<Building2 size={22} color="$white"/>}
                title="Account details"
              />
              <YStack paddingLeft={46}>
                <Separator/>
              </YStack>
              <MenuItem
                icon={<Clock size={22} color="$white"/>}
                title="Transaction history"
              />
              <YStack paddingLeft={46}>
                <Separator/>
              </YStack>
              <MenuItem
                icon={<FileText size={22} color="$white"/>}
                title="Documents"
              />
            </Section>

            {/* Security Menu Section */}
            <Section title="Security">
              <MenuItem
                icon={<Shield size={22} color="$white"/>}
                title="Devices"
              />
              <YStack paddingLeft={46}>
                <Separator/>
              </YStack>
              <MenuItem
                icon={<User size={22} color="$white"/>}
                title="Card confirmation"
              />
              <YStack paddingLeft={46}>
                <Separator/>
              </YStack>
              <MenuItem
                icon={<Lock size={22} color="$white"/>}
                title="Privacy"
              />
              <YStack paddingLeft={46}>
                <Separator/>
              </YStack>
              <MenuItem
                icon={<Eye size={22} color="$white"/>}
                title="Face Id"
                showSwitch
                switchValue={faceIdEnabled}
                onSwitchChange={setFaceIdEnabled}
              />
              <YStack paddingLeft={46}>
                <Separator/>
              </YStack>
              <MenuItem
                icon={<EyeOff size={22} color="$white"/>}
                title="Hide balances"
                showSwitch
                switchValue={hideBalances}
                onSwitchChange={setHideBalances}
              />
            </Section>

            {/* Bottom spacing */}
            <YStack height={60}/>
          </YStack>
        </ScrollView>
      </YStack>
    </Theme>
  );
}
