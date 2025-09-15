import {BasicHeader} from '@/shared/components/ui/Header/BasicHeader';
import {YStack} from 'tamagui';

export const NotificationsScreen = () => {
  return (
    <YStack flex={1}>
      <BasicHeader
        title="Notificações"
        showBackButton={true}
      />
    </YStack>
  );
}
