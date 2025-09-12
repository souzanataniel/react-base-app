import {Checkbox, CheckboxProps, Text, XStack} from 'tamagui';
import {Check as CheckIcon} from '@tamagui/lucide-icons'

export function CheckboxLabel({
                                size,
                                label = 'Checkbox label',
                                checked,
                                onCheckedChange,
                                ...checkboxProps
                              }: CheckboxProps & { label?: string }) {

  const id = `checkbox-${(size || '').toString().slice(1)}`

  return (
    <XStack alignItems="center" gap="$2">
      <Checkbox
        id={id}
        size={size}
        {...checkboxProps}
        checked={checked}
        onCheckedChange={onCheckedChange}
        backgroundColor={checked ? '$primary' : 'transparent'}
        borderColor={checked ? '$primary' : '$absoluteTextTertiary'}
        borderWidth={2}
        borderRadius={4}
      >
        <Checkbox.Indicator>
          <CheckIcon color="white"/>
        </Checkbox.Indicator>
      </Checkbox>

      <Text
        fontSize="$3"
        color="$absoluteTextTertiary"
        lineHeight="$4"
        flex={1}
        onPress={() => onCheckedChange && onCheckedChange(!checked)}
        pressStyle={{opacity: 0.7}}
      >
        {label}
      </Text>
    </XStack>
  )
}
