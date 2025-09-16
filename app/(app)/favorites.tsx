import {BasicHeader} from '@/shared/components/ui/Header/BasicHeader';
import {YStack} from 'tamagui';
import {Settings} from '@tamagui/lucide-icons';

export default function FavoritesScreen() {
  return (

    <YStack flex={1}>
      <BasicHeader
        title="Detalhes"
        showRight={true}
        rightIcon={<Settings size={22} color="white"/>}
      />
    </YStack>
  );
}
