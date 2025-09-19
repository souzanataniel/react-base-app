import React, {forwardRef, memo, ReactNode, useEffect, useState} from 'react';
import {Button, InputProps, Sheet, StackProps, Text, useTheme, XStack, YStack} from 'tamagui';
import MaskInput from 'react-native-mask-input';
import {TextStyle} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {Calendar as CalendarIcon} from '@tamagui/lucide-icons';

type DateInputProps = Omit<InputProps, 'keyboardType' | 'maxLength'> & {
  label?: ReactNode;
  containerProps?: StackProps;
  labelFontSize?: InputProps['fontSize'];
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  showSuccessIcon?: boolean;
  successIcon?: ReactNode;
  validationFn?: (value: string) => boolean;
  minDate?: string; // formato: 'YYYY-MM-DD'
  maxDate?: string; // formato: 'YYYY-MM-DD'
};

// Máscara para data: DD/MM/AAAA
const DATE_MASK = [
  /\d/,
  /\d/,
  '/',
  /\d/,
  /\d/,
  '/',
  /\d/,
  /\d/,
  /\d/,
  /\d/,
];

const isValidDate = (dateString: string): boolean => {
  const numbers = dateString.replace(/\D/g, '');

  if (numbers.length !== 8) return false;

  const day = parseInt(numbers.slice(0, 2));
  const month = parseInt(numbers.slice(2, 4));
  const year = parseInt(numbers.slice(4, 8));

  if (day < 1 || day > 31) return false;
  if (month < 1 || month > 12) return false;
  if (year < 1900 || year > new Date().getFullYear()) return false;

  const dateObj = new Date(year, month - 1, day);
  return (
    dateObj.getDate() === day &&
    dateObj.getMonth() === month - 1 &&
    dateObj.getFullYear() === year
  );
};

// Converter DD/MM/AAAA para YYYY-MM-DD
const convertToCalendarFormat = (dateString: string): string => {
  const numbers = dateString.replace(/\D/g, '');
  if (numbers.length !== 8) return '';

  const day = numbers.slice(0, 2);
  const month = numbers.slice(2, 4);
  const year = numbers.slice(4, 8);

  return `${year}-${month}-${day}`;
};

// Converter YYYY-MM-DD para DD/MM/AAAA
const convertFromCalendarFormat = (dateString: string): string => {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

function BaseDateInput(
  {
    label,
    containerProps,
    labelFontSize = '$4',
    leftIcon,
    rightIcon,
    showSuccessIcon = false,
    successIcon,
    validationFn,
    height = 52,
    fontSize = '$4',
    onChangeText,
    placeholder = 'DD/MM/AAAA',
    value,
    minDate,
    maxDate,
    ...inputProps
  }: DateInputProps,
  ref: React.Ref<any>
) {
  const theme = useTheme();
  const [inputValue, setInputValue] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    if (value !== undefined && value !== inputValue) {
      setInputValue(value);
      const validation = validationFn ? validationFn(value) : isValidDate(value);
      setIsValid(validation);

      if (isValidDate(value)) {
        setSelectedDate(convertToCalendarFormat(value));
      }
    }
  }, [value, validationFn, inputValue]);

  const handleChangeText = (masked: string, unmasked: string) => {
    setInputValue(masked);
    const validation = validationFn ? validationFn(masked) : isValidDate(masked);
    setIsValid(validation);
    onChangeText?.(masked);
  };

  const handleCalendarPress = () => {
    setShowCalendar(true);
  };

  const handleDayPress = (day: any) => {
    const formattedDate = convertFromCalendarFormat(day.dateString);
    setInputValue(formattedDate);
    setSelectedDate(day.dateString);
    setIsValid(true);
    onChangeText?.(formattedDate);
    setShowCalendar(false);
  };

  const shouldShowSuccessIcon = showSuccessIcon && isValid && inputValue.trim().length > 0;
  const paddingLeft = leftIcon ? 45 : 16;
  const paddingRight = 85; // Espaço para ícone de calendário + sucesso

  const inputStyle: TextStyle = {
    height: typeof height === 'number' ? height : 52,
    fontSize: 14,
    paddingLeft,
    paddingRight,
    backgroundColor: theme.background?.get() || '#F9F9F9',
    color: theme.color?.get() || '#000000',
    borderRadius: 12,
    borderWidth: isFocused ? 1 : 0,
    borderColor: isFocused ? (theme.borderColor?.get() || 'rgba(60, 60, 67, 0.18)') : 'transparent',
  };

  const calendarTheme = {
    backgroundColor: theme.background?.get() || '#ffffff',
    calendarBackground: theme.background?.get() || '#ffffff',
    textSectionTitleColor: theme.color?.get() || '#000000',
    selectedDayBackgroundColor: theme.primary?.get() || '#007AFF',
    selectedDayTextColor: '#ffffff',
    todayTextColor: theme.primary?.get() || '#007AFF',
    dayTextColor: theme.color?.get() || '#000000',
    textDisabledColor: theme.gray9?.get() || '#d9e1e8',
    monthTextColor: theme.color?.get() || '#000000',
    arrowColor: theme.primary?.get() || '#007AFF',
  };

  return (
    <YStack gap="$2" {...containerProps}>
      {label ? (
        <Text fontSize={labelFontSize} color="$color" fontWeight="500">
          {label}
        </Text>
      ) : null}

      <YStack position="relative">
        {leftIcon && (
          <XStack
            position="absolute"
            left={12}
            top={0}
            bottom={0}
            alignItems="center"
            zIndex={1}
            pointerEvents="none"
          >
            {leftIcon}
          </XStack>
        )}

        <MaskInput
          ref={ref}
          value={inputValue}
          onChangeText={handleChangeText}
          mask={DATE_MASK}
          keyboardType="numeric"
          placeholder={placeholder}
          placeholderTextColor={theme.placeholderColor?.get() || '#999999'}
          style={inputStyle}
          onFocus={(e) => {
            setIsFocused(true);
            inputProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            inputProps.onBlur?.(e);
          }}
        />

        {/* Botão do Calendário */}
        <XStack
          position="absolute"
          right={shouldShowSuccessIcon ? 48 : 12}
          top={0}
          bottom={0}
          alignItems="center"
          zIndex={1}
        >
          <Button
            size="$3"
            circular
            backgroundColor="transparent"
            pressStyle={{opacity: 0.7}}
            onPress={handleCalendarPress}
            icon={<CalendarIcon size={20} color={theme.color?.get() || '#666'} />}
          />
        </XStack>

        {/* Ícone de Sucesso */}
        {shouldShowSuccessIcon && (
          <XStack
            position="absolute"
            right={12}
            top={0}
            bottom={0}
            alignItems="center"
            zIndex={1}
            pointerEvents="none"
          >
            {successIcon || rightIcon}
          </XStack>
        )}
      </YStack>

      {/* Calendário em Sheet */}
      <Sheet
        open={showCalendar}
        onOpenChange={setShowCalendar}
        snapPoints={[85]}
        dismissOnSnapToBottom
        zIndex={100000}
        modal
      >
        <Sheet.Overlay />
        <Sheet.Frame padding="$4">
          <Sheet.Handle />
          <YStack gap="$4">
            <Text fontSize="$6" fontWeight="600" textAlign="center">
              Selecione a Data
            </Text>

            <Calendar
              current={selectedDate || undefined}
              onDayPress={handleDayPress}
              markedDates={{
                [selectedDate]: {
                  selected: true,
                  selectedColor: theme.primary?.get() || '#007AFF'
                }
              }}
              minDate={minDate}
              maxDate={maxDate}
              theme={calendarTheme}
              enableSwipeMonths
            />

            <Button
              backgroundColor="$background"
              borderWidth={1}
              borderColor="$borderColor"
              onPress={() => setShowCalendar(false)}
            >
              Cancelar
            </Button>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </YStack>
  );
}

export const DateInput = memo(forwardRef(BaseDateInput));
