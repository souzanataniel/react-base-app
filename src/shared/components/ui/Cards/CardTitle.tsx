import React from 'react';
import { Text, View, XStack, YStack } from 'tamagui';
import Svg, { Circle, Rect, Line } from 'react-native-svg';

export type CardTitleProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

// Padrão geométrico sofisticado - Network/Rede
const GeometricPattern = () => {
  return (
    <Svg
      width="200"
      height="120"
      viewBox="0 0 200 120"
      style={{
        position: 'absolute',
        right: -30,
        top: -10,
        opacity: 0.5,
      }}
    >
      <Circle cx="95" cy="18" r="1.5" fill="white" />
      <Circle cx="118" cy="25" r="1.2" fill="white" />
      <Circle cx="142" cy="12" r="1" fill="white" />
      <Circle cx="165" cy="22" r="1.5" fill="white" />
      <Circle cx="178" cy="35" r="1.2" fill="white" />

      <Circle cx="88" cy="42" r="1" fill="white" />
      <Circle cx="110" cy="48" r="1.5" fill="white" />
      <Circle cx="135" cy="38" r="1.2" fill="white" />
      <Circle cx="158" cy="52" r="1" fill="white" />
      <Circle cx="182" cy="45" r="1.2" fill="white" />

      <Circle cx="102" cy="65" r="1.5" fill="white" />
      <Circle cx="125" cy="72" r="1" fill="white" />
      <Circle cx="148" cy="68" r="1.2" fill="white" />
      <Circle cx="172" cy="75" r="1.5" fill="white" />

      <Circle cx="80" cy="85" r="1.2" fill="white" />
      <Circle cx="115" cy="92" r="1" fill="white" />
      <Circle cx="138" cy="88" r="1.5" fill="white" />
      <Circle cx="160" cy="95" r="1.2" fill="white" />

      <Circle cx="95" cy="108" r="1" fill="white" />
      <Circle cx="128" cy="112" r="1.2" fill="white" />
      <Circle cx="152" cy="105" r="1" fill="white" />

      <Line x1="95" y1="18" x2="118" y2="25" stroke="white" strokeWidth="0.5" />
      <Line x1="118" y1="25" x2="142" y2="12" stroke="white" strokeWidth="0.5" />
      <Line x1="142" y1="12" x2="165" y2="22" stroke="white" strokeWidth="0.5" />
      <Line x1="165" y1="22" x2="178" y2="35" stroke="white" strokeWidth="0.5" />

      <Line x1="95" y1="18" x2="88" y2="42" stroke="white" strokeWidth="0.5" />
      <Line x1="95" y1="18" x2="110" y2="48" stroke="white" strokeWidth="0.5" />
      <Line x1="118" y1="25" x2="135" y2="38" stroke="white" strokeWidth="0.5" />
      <Line x1="142" y1="12" x2="135" y2="38" stroke="white" strokeWidth="0.5" />
      <Line x1="165" y1="22" x2="158" y2="52" stroke="white" strokeWidth="0.5" />
      <Line x1="178" y1="35" x2="182" y2="45" stroke="white" strokeWidth="0.5" />

      <Line x1="88" y1="42" x2="110" y2="48" stroke="white" strokeWidth="0.5" />
      <Line x1="110" y1="48" x2="135" y2="38" stroke="white" strokeWidth="0.5" />
      <Line x1="135" y1="38" x2="158" y2="52" stroke="white" strokeWidth="0.5" />
      <Line x1="158" y1="52" x2="182" y2="45" stroke="white" strokeWidth="0.5" />

      <Line x1="110" y1="48" x2="102" y2="65" stroke="white" strokeWidth="0.5" />
      <Line x1="110" y1="48" x2="125" y2="72" stroke="white" strokeWidth="0.5" />
      <Line x1="135" y1="38" x2="148" y2="68" stroke="white" strokeWidth="0.5" />
      <Line x1="158" y1="52" x2="148" y2="68" stroke="white" strokeWidth="0.5" />
      <Line x1="158" y1="52" x2="172" y2="75" stroke="white" strokeWidth="0.5" />

      <Line x1="102" y1="65" x2="125" y2="72" stroke="white" strokeWidth="0.5" />
      <Line x1="125" y1="72" x2="148" y2="68" stroke="white" strokeWidth="0.5" />
      <Line x1="148" y1="68" x2="172" y2="75" stroke="white" strokeWidth="0.5" />

      <Line x1="102" y1="65" x2="80" y2="85" stroke="white" strokeWidth="0.5" />
      <Line x1="102" y1="65" x2="115" y2="92" stroke="white" strokeWidth="0.5" />
      <Line x1="125" y1="72" x2="138" y2="88" stroke="white" strokeWidth="0.5" />
      <Line x1="148" y1="68" x2="138" y2="88" stroke="white" strokeWidth="0.5" />
      <Line x1="148" y1="68" x2="160" y2="95" stroke="white" strokeWidth="0.5" />
      <Line x1="172" y1="75" x2="160" y2="95" stroke="white" strokeWidth="0.5" />

      <Line x1="80" y1="85" x2="115" y2="92" stroke="white" strokeWidth="0.5" />
      <Line x1="115" y1="92" x2="138" y2="88" stroke="white" strokeWidth="0.5" />
      <Line x1="138" y1="88" x2="160" y2="95" stroke="white" strokeWidth="0.5" />

      <Line x1="80" y1="85" x2="95" y2="108" stroke="white" strokeWidth="0.5" />
      <Line x1="115" y1="92" x2="128" y2="112" stroke="white" strokeWidth="0.5" />
      <Line x1="138" y1="88" x2="128" y2="112" stroke="white" strokeWidth="0.5" />
      <Line x1="160" y1="95" x2="152" y2="105" stroke="white" strokeWidth="0.5" />

      <Line x1="95" y1="108" x2="128" y2="112" stroke="white" strokeWidth="0.5" />
      <Line x1="128" y1="112" x2="152" y2="105" stroke="white" strokeWidth="0.5" />

      <Line x1="88" y1="42" x2="125" y2="72" stroke="white" strokeWidth="0.5" />
      <Line x1="118" y1="25" x2="110" y2="48" stroke="white" strokeWidth="0.5" />
    </Svg>
  );
};

export const CardTitle = ({ icon, title, description }: CardTitleProps) => {
  return (
    <YStack
      padding="$4"
      backgroundColor="$cardHeader"
      borderRadius="$4"
      position="relative"
      overflow="hidden"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.16,
        shadowRadius: 4,
        elevation: 8,
      }}
    >
      <GeometricPattern />

      <XStack gap="$3" alignItems="center" zIndex={1}>
        <View
          width={48}
          height={48}
          backgroundColor="rgba(255, 255, 255, 0.2)"
          borderRadius={24}
          alignItems="center"
          justifyContent="center"
        >
          {icon}
        </View>

        <YStack gap="$0.5" flex={1}>
          <Text
            fontSize="$5"
            fontWeight="600"
            color="$defaultWhite"
            letterSpacing={-0.3}
          >
            {title}
          </Text>
          <Text
            fontSize="$2"
            fontWeight="400"
            color="rgba(255, 255, 255, 0.9)"
            lineHeight={18}
          >
            {description}
          </Text>
        </YStack>
      </XStack>
    </YStack>
  );
};
