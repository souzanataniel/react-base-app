import {Checkbox, CheckboxProps, CheckedState, Label, XStack} from 'tamagui';
import {Check as CheckIcon} from '@tamagui/lucide-icons'
import {useState} from 'react';

export function CheckboxLabel({
                                size,
                                label = 'Checkbox label',
                                ...checkboxProps
                              }: CheckboxProps & { label?: string }) {

  const id = `checkbox-${(size || '').toString().slice(1)}`
  const [checked, setChecked] = useState<CheckedState>(false);

  return (
    <XStack alignItems="center" gap="$2">
      <Checkbox
        id={id}
        size={size}
        {...checkboxProps}
        checked={checked}
        onCheckedChange={setChecked}
        backgroundColor={checked ? '$oceanDark' : 'transparent'}
        borderColor={checked ? '$oceanDark' : '$gray8'}
        borderWidth={2}
        borderRadius={4}
      >
        <Checkbox.Indicator>
          <CheckIcon color="white"/>
        </Checkbox.Indicator>
      </Checkbox>

      <Label size={size} htmlFor={id}>
        {label}
      </Label>
    </XStack>
  )
}
