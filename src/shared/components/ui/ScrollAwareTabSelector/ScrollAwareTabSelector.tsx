import React, {useEffect, useRef} from 'react';
import {Animated, Pressable} from 'react-native';
import {Text, View, XStack} from 'tamagui';
import {useHapticFeedback} from '@/shared/components/feedback/Haptic/HapticContext';

interface ScrollAwareTabSelectorProps {
  currentTab: 'all' | 'unread';
  onTabChange: (tab: 'all' | 'unread') => void;
  unreadCount: number;
  scrollY: Animated.Value;
  headerHeight?: number;
  topOffset?: number;
}

export const ScrollAwareTabSelector: React.FC<ScrollAwareTabSelectorProps> = ({
                                                                                currentTab,
                                                                                onTabChange,
                                                                                unreadCount,
                                                                                scrollY,
                                                                                headerHeight = 60,
                                                                                topOffset = 60,
                                                                              }) => {
  const haptic = useHapticFeedback();
  const translateY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const isHidden = useRef(false);
  const scrollDirection = useRef<'up' | 'down'>('down');

  useEffect(() => {
    const listenerId = scrollY.addListener(({value}) => {
      const diff = value - lastScrollY.current;

      // Determina a direção do scroll
      if (diff > 0) {
        scrollDirection.current = 'down';
      } else if (diff < 0) {
        scrollDirection.current = 'up';
      }

      // Esconde quando rola para baixo (apenas se estiver além do header)
      if (diff > 2 && value > headerHeight && !isHidden.current) {
        isHidden.current = true;
        Animated.timing(translateY, {
          toValue: -100,
          duration: 400,
          useNativeDriver: true,
        }).start();
      }
      // Mostra APENAS quando rola para cima de forma intencional
      else if (diff < -10 && isHidden.current && scrollDirection.current === 'up') {
        isHidden.current = false;
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
      // Mostra quando está realmente no topo (próximo de zero)
      else if (value < 10 && isHidden.current) {
        isHidden.current = false;
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }

      lastScrollY.current = value;
    });

    return () => {
      scrollY.removeListener(listenerId);
    };
  }, [scrollY, headerHeight]);

  const handleTabPress = (tab: 'all' | 'unread') => {
    haptic.light();
    onTabChange(tab);
  };

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: topOffset,
        left: 0,
        right: 0,
        transform: [{translateY}],
        zIndex: 100,
        elevation: 5,
      }}
    >
      <XStack
        backgroundColor="transparent"
        padding="$2"
        marginHorizontal="$4"
        marginTop="$3"
        marginBottom="$2"
        borderRadius="$3"
        shadowColor="$shadowColor"
        shadowOffset={{width: 0, height: 2}}
        shadowOpacity={0.1}
        shadowRadius={4}
      >
        <Pressable onPress={() => handleTabPress('all')} style={{flex: 1}}>
          <View
            flex={1}
            backgroundColor={currentTab === 'all' ? '$button' : '$colorInverse'}
            borderRadius="$4"
            borderBottomRightRadius="$0"
            borderTopRightRadius="$0"
            paddingVertical="$2"
            alignItems="center"
            justifyContent="center"
            borderWidth="$0.5"
            borderColor="$button"
          >
            <Text
              color={currentTab === 'all' ? '$buttonLabel' : '$primary'}
              fontWeight={currentTab === 'all' ? '500' : '600'}
              fontSize="$4"
            >
              Todas
            </Text>
          </View>
        </Pressable>

        <Pressable onPress={() => handleTabPress('unread')} style={{flex: 1}}>
          <View
            flex={1}
            backgroundColor={currentTab === 'unread' ? '$button' : '$colorInverse'}
            borderRadius="$4"
            borderBottomLeftRadius="$0"
            borderTopLeftRadius="$0"
            paddingVertical="$2"
            alignItems="center"
            borderWidth="$0.5"
            borderColor="$button"
            justifyContent="center"
          >
            <XStack gap="$2" alignItems="center">
              <Text
                color={currentTab === 'unread' ? '$buttonLabel' : '$primary'}
                fontWeight={currentTab === 'unread' ? '500' : '600'}
                fontSize="$4"
              >
                Não Lidas
              </Text>
              {unreadCount > 0 && (
                <View
                  backgroundColor={currentTab === 'unread' ? '$buttonLabel' : '$primary'}
                  paddingHorizontal="$2"
                  paddingVertical="$0.5"
                  borderRadius="$6"
                  minWidth={20}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text
                    color={currentTab === 'unread' ? '$primary' : '$buttonLabel'}
                    fontSize="$2"
                    fontWeight="bold"
                  >
                    {unreadCount}
                  </Text>
                </View>
              )}
            </XStack>
          </View>
        </Pressable>
      </XStack>
    </Animated.View>
  );
};
