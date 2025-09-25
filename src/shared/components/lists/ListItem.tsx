import React from 'react';
import {Pressable} from 'react-native';
import {Text, useTheme, View, XStack} from 'tamagui';
import {ChevronRight} from '@tamagui/lucide-icons';
import {BaseSwitch} from '@/shared/components/ui/Input/BaseSwitch';

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
  valueText?: string;
};

export const ListItem = ({
                           icon,
                           title,
                           subtitle,
                           iconBg = '$primary',
                           iconSize = 28,
                           showChevron = true,
                           showSwitch = false,
                           switchValue = false,
                           onSwitchChange,
                           onPress,
                           disabled = false,
                           rightContent,
                           valueText,
                         }: ListItemProps) => {
  const theme = useTheme();

  const getPressedColor = () => {
    const isDark = theme.background?.val?.includes('000') ||
      theme.background?.val?.includes('#1') ||
      theme.background?.val?.includes('#2') ||
      theme.background?.val?.includes('#3');

    return isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.03)';
  };

  const getRippleColor = () => {
    const isDark = theme.background?.val?.includes('000') ||
      theme.background?.val?.includes('#1') ||
      theme.background?.val?.includes('#2') ||
      theme.background?.val?.includes('#3');

    return isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.06)';
  };

  return (
    <Pressable
      onPress={!disabled && !showSwitch ? onPress : undefined}
      disabled={disabled}
      style={({pressed}) => ({
        backgroundColor: pressed ? getPressedColor() : 'transparent',
        opacity: disabled ? 0.5 : 1,
      })}
      android_ripple={{
        color: getRippleColor(),
        borderless: false,
      }}
    >
      <XStack
        alignItems="center"
        paddingHorizontal="$4"
        paddingVertical="$2.5"
        minHeight={48}
      >
        {icon && (
          <View
            width={iconSize}
            height={iconSize}
            backgroundColor={iconBg}
            borderRadius={6}
            alignItems="center"
            justifyContent="center"
            marginRight="$2.5"
          >
            {icon}
          </View>
        )}

        <View flex={1}>
          <Text
            fontSize="$4"
            color="$color"
            fontWeight="500"
            letterSpacing={-0.01}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              fontSize="$2"
              color="$colorSecondary"
              marginTop="$0.5"
            >
              {subtitle}
            </Text>
          )}
        </View>

        {rightContent ? (
          rightContent
        ) : showSwitch ? (
          <BaseSwitch checked={switchValue} onCheckedChange={onSwitchChange}/>
        ) : (
          <XStack alignItems="center" gap="$2">
            {valueText && (
              <Text fontSize="$4" color="$colorSecondary">
                {valueText}
              </Text>
            )}
            {showChevron && (
              <View style={{opacity: 0.6, transform: [{translateX: 2}]}}>
                <ChevronRight size={18} color="$gray11"/>
              </View>
            )}
          </XStack>
        )}
      </XStack>
    </Pressable>
  );
};
