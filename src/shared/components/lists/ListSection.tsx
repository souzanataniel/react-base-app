import {ListSectionProps} from '@/shared/components/lists/types';
import React from 'react';
import {Separator, Text, View, YStack} from 'tamagui';

export const ListSection = ({
                              title,
                              children,
                              showSeparators = true,
                              marginTop = '$6',
                            }: ListSectionProps) => {
  const childrenArray = React.Children.toArray(children);

  return (
    <YStack marginTop={marginTop}>
      {title && (
        <Text
          fontSize="$3"
          color="$colorSecondary"
          fontWeight="600"
          paddingHorizontal="$4"
          paddingBottom="$2"
          textTransform="uppercase"
          letterSpacing={0.5}
        >
          {title}
        </Text>
      )}

      <YStack
        backgroundColor="$card"
        marginHorizontal="$4"
        borderRadius="$3"
        style={{
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 2,
          borderWidth: 1,
          borderColor: 'rgba(0, 0, 0, 0.04)',
        }}
      >
        {childrenArray.map((child, index) => (
          <React.Fragment key={index}>
            {child}
            {showSeparators && index < childrenArray.length - 1 && (
              <View paddingLeft={44}>
                <Separator
                  borderColor="$defaultTertiaryLabel"
                  opacity={0.3}
                />
              </View>
            )}
          </React.Fragment>
        ))}
      </YStack>
    </YStack>
  );
};
