import React from 'react';
import {FlatList, Image, Pressable, View} from 'react-native';
import {styled, Text, XStack, YStack} from 'tamagui';
import {CollapsibleHeader, useCollapsibleHeader} from '@/shared/components/ui/Header/CollapsibleHeader';
import {mockUsers, User} from '@/features/favorites/mock-data';

const ListItem = styled(Pressable, {
  padding: 16,
  borderBottomWidth: 1,
  borderBottomColor: '#f0f0f0',
  backgroundColor: 'white',
  flexDirection: 'row',
  alignItems: 'center',
});

const Avatar = styled(Image, {
  width: 50,
  height: 50,
  borderRadius: 25,
  marginRight: 12,
});

const Badge = styled(XStack, {
  backgroundColor: '#25D366',
  borderRadius: 10,
  minWidth: 20,
  height: 20,
  alignItems: 'center',
  justifyContent: 'center',
  paddingHorizontal: 4,
});

const OnlineIndicator = styled(XStack, {
  width: 12,
  height: 12,
  borderRadius: 6,
  backgroundColor: '#25D366',
  borderWidth: 2,
  borderColor: 'white',
  position: 'absolute',
  bottom: 0,
  right: 0,
});

export function FavoritesScreen() {
  const {scrollY, onScroll, onScrollEndDrag, onMomentumScrollEnd, flatListRef, paddingTop} = useCollapsibleHeader();

  const renderItem = ({item}: { item: User }) => (
    <ListItem>
      <XStack position="relative">
        <Avatar source={{uri: item.avatar}}/>
        {item.isOnline && <OnlineIndicator/>}
      </XStack>

      <YStack flex={1}>
        <XStack justifyContent="space-between" alignItems="center">
          <Text fontWeight="600" fontSize={16}>{item.name}</Text>
          <Text color="$gray10" fontSize={12}>{item.timestamp}</Text>
        </XStack>

        <XStack justifyContent="space-between" alignItems="center" marginTop={4}>
          <Text color="$gray11" fontSize={14} numberOfLines={1} flex={1}>
            {item.lastMessage}
          </Text>

          {item.unreadCount && item.unreadCount > 0 && (
            <Badge>
              <Text color="white" fontSize={10} fontWeight="bold">
                {item.unreadCount}
              </Text>
            </Badge>
          )}
        </XStack>
      </YStack>
    </ListItem>
  );

  // Componente de espaçamento para o header
  const HeaderSpacer = () => <View style={{height: paddingTop}}/>;

  return (
    <YStack flex={1}>
      <CollapsibleHeader
        title="Chats"
        scrollY={scrollY}
        backgroundColor="$background"
      />

      <FlatList
        ref={flatListRef}
        data={mockUsers}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onScroll={onScroll}
        onScrollEndDrag={onScrollEndDrag}
        onMomentumScrollEnd={onMomentumScrollEnd}
        scrollEventThrottle={16}
        ListHeaderComponent={HeaderSpacer}
        showsVerticalScrollIndicator={false}
        style={{flex: 1}}
      />
    </YStack>
  );
}
