import React, {forwardRef, memo, ReactNode, useEffect, useRef, useState} from 'react';
import {InputProps, StackProps, Text, useTheme, XStack, YStack} from 'tamagui';
import {Animated, Easing, Keyboard, Modal, Platform, Pressable, TouchableOpacity, View, ViewStyle} from 'react-native';
import DateTimePicker, {DateTimePickerEvent} from '@react-native-community/datetimepicker';

type DateInputProps = Omit<InputProps, 'keyboardType' | 'maxLength' | 'editable'> & {
  label?: ReactNode;
  containerProps?: StackProps;
  labelFontSize?: InputProps['fontSize'];
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  showSuccessIcon?: boolean;
  successIcon?: ReactNode;
  validationFn?: (value: string) => boolean;
  minDate?: Date;
  maxDate?: Date;
  mode?: 'date' | 'datetime' | 'time';
  // Novo: permite controlar o formato de saída
  outputFormat?: 'DD/MM/YYYY' | 'YYYY-MM-DD';
  // Novo: se deve normalizar automaticamente o valor inicial
  autoNormalize?: boolean;
};

const PICKER_HEIGHT = 400;

// Detecta o formato da data baseado na string
const detectDateFormat = (dateString: string): 'DD/MM/YYYY' | 'YYYY-MM-DD' | 'unknown' => {
  if (!dateString) return 'unknown';

  // Remove espaços e verifica padrões
  const clean = dateString.trim();

  // Formato YYYY-MM-DD (ISO)
  if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) {
    return 'YYYY-MM-DD';
  }

  // Formato DD/MM/YYYY
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(clean)) {
    return 'DD/MM/YYYY';
  }

  return 'unknown';
};

const isValidDate = (dateString: string): boolean => {
  if (!dateString) return false;

  const format = detectDateFormat(dateString);

  if (format === 'DD/MM/YYYY') {
    const numbers = dateString.replace(/\D/g, '');
    if (numbers.length !== 8) return false;

    const day = parseInt(numbers.slice(0, 2), 10);
    const month = parseInt(numbers.slice(2, 4), 10);
    const year = parseInt(numbers.slice(4, 8), 10);

    if (day < 1 || day > 31) return false;
    if (month < 1 || month > 12) return false;
    if (year < 1900 || year > new Date().getFullYear()) return false;

    // month - 1 porque Date() usa zero-indexado
    const dateObj = new Date(year, month - 1, day);
    return (
      dateObj.getDate() === day &&
      dateObj.getMonth() === month - 1 && // comparar com month - 1
      dateObj.getFullYear() === year
    );
  }

  if (format === 'YYYY-MM-DD') {
    const parts = dateString.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10); // mês 1-12 na string
    const day = parseInt(parts[2], 10);

    if (day < 1 || day > 31) return false;
    if (month < 1 || month > 12) return false;
    if (year < 1900 || year > new Date().getFullYear()) return false;

    // IMPORTANTE: month - 1 para Date(), mas comparar com month - 1 também
    const dateObj = new Date(year, month - 1, day);
    return (
      dateObj.getDate() === day &&
      dateObj.getMonth() === month - 1 && // Date().getMonth() retorna 0-11
      dateObj.getFullYear() === year
    );
  }

  return false;
};

const formatDateToString = (date: Date, format: 'DD/MM/YYYY' | 'YYYY-MM-DD' = 'DD/MM/YYYY'): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  if (format === 'YYYY-MM-DD') {
    return `${year}-${month}-${day}`;
  }

  return `${day}/${month}/${year}`;
};

const parseStringToDate = (dateString: string): Date | null => {
  if (!dateString) return null;

  const format = detectDateFormat(dateString);

  if (format === 'DD/MM/YYYY') {
    const numbers = dateString.replace(/\D/g, '');

    if (numbers.length === 8) {
      const day = parseInt(numbers.slice(0, 2), 10);
      const month = parseInt(numbers.slice(2, 4), 10);
      const year = parseInt(numbers.slice(4, 8), 10);

      // month - 1 porque Date() usa mês zero-indexado (0-11)
      const date = new Date(year, month - 1, day);

      if (!isNaN(date.getTime()) && isValidDate(dateString)) {
        return date;
      }
    }
  }

  if (format === 'YYYY-MM-DD') {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10); // mês de 1-12 no formato ISO
      const day = parseInt(parts[2], 10);

      // IMPORTANTE: month - 1 porque Date() usa mês zero-indexado
      // Se a string é "2024-01-15", month será 1 (Janeiro)
      // Mas Date() precisa de 0 para Janeiro
      const date = new Date(year, month - 1, day);

      if (!isNaN(date.getTime()) && isValidDate(dateString)) {
        return date;
      }
    }
  }

  return null;
};

// Converte qualquer formato de entrada para o formato de exibição DD/MM/YYYY
const convertToDisplayFormat = (dateString: string): string => {
  if (!dateString) return '';

  const parsedDate = parseStringToDate(dateString);
  if (!parsedDate) return dateString; // Retorna original se não conseguir converter

  return formatDateToString(parsedDate, 'DD/MM/YYYY');
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
    maxDate = new Date(),
    mode = 'date',
    onBlur,
    outputFormat = 'DD/MM/YYYY', // Formato padrão para compatibilidade
    autoNormalize = true, // Por padrão, normaliza automaticamente
  }: DateInputProps,
  ref: React.Ref<any>
) {
  const theme = useTheme();
  const slideAnim = useRef(new Animated.Value(PICKER_HEIGHT)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  const [inputValue, setInputValue] = useState('');
  const [displayValue, setDisplayValue] = useState(''); // Valor mostrado no input (sempre DD/MM/YYYY)
  const [isValid, setIsValid] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const getDefaultDate = (): Date => {
    const defaultDate = new Date(maxDate);
    defaultDate.setFullYear(defaultDate.getFullYear() - 1);
    return defaultDate;
  };

  const [selectedDate, setSelectedDate] = useState<Date>(getDefaultDate());

  useEffect(() => {
    if (value !== undefined && value !== inputValue) {
      // Converte para formato de exibição
      const display = convertToDisplayFormat(value);
      setDisplayValue(display);

      const validation = validationFn ? validationFn(value) : isValidDate(value);
      setIsValid(validation);

      if (value && isValidDate(value)) {
        const parsedDate = parseStringToDate(value);
        if (parsedDate) {
          setSelectedDate(parsedDate);

          // IMPORTANTE: Normaliza o valor para o outputFormat esperado
          // Se value veio do banco como YYYY-MM-DD mas outputFormat é DD/MM/YYYY
          // ou vice-versa, converte para o formato correto
          if (autoNormalize) {
            const normalizedValue = formatDateToString(parsedDate, outputFormat);
            setInputValue(normalizedValue);

            // Se o valor normalizado é diferente do valor original,
            // chama onChangeText para atualizar o formulário
            if (normalizedValue !== value && onChangeText) {
              // Usa setTimeout para evitar loops de re-render
              setTimeout(() => {
                onChangeText(normalizedValue);
              }, 0);
            }
          } else {
            setInputValue(value);
          }
        }
      } else {
        setInputValue(value);
      }
    }
  }, [value, validationFn, outputFormat, onChangeText, autoNormalize]);

  useEffect(() => {
    if (showPicker) {
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          damping: 15,
          mass: 1,
          stiffness: 120,
          overshootClamping: false,
          restDisplacementThreshold: 0.01,
          restSpeedThreshold: 0.01,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showPicker]);

  const animateOut = (callback?: () => void) => {
    Animated.parallel([
      Animated.timing(backdropAnim, {
        toValue: 0,
        duration: 150,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: PICKER_HEIGHT,
        duration: 200,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowPicker(false);
      callback?.();
    });
  };

  const handleCalendarPress = () => {
    Keyboard.dismiss();

    if (!displayValue || !isValidDate(displayValue)) {
      setSelectedDate(getDefaultDate());
    }

    setTimeout(() => {
      setShowPicker(true);
    }, 150);
  };

  const handleDateChange = (event: DateTimePickerEvent, receivedDate?: Date) => {
    if (event.type === 'dismissed' || event.type === 'neutralButtonPressed') {
      animateOut();
      return;
    }

    if (Platform.OS === 'android') {
      setShowPicker(false);
    }

    const dateToUse = receivedDate || selectedDate;

    if (!dateToUse || !(dateToUse instanceof Date) || isNaN(dateToUse.getTime())) {
      return;
    }

    setSelectedDate(dateToUse);

    // Formato para exibição (sempre DD/MM/YYYY)
    const displayDate = formatDateToString(dateToUse, 'DD/MM/YYYY');
    setDisplayValue(displayDate);

    // Formato para o callback (conforme outputFormat)
    const outputDate = formatDateToString(dateToUse, outputFormat);
    setInputValue(outputDate);

    setIsValid(true);
    onChangeText?.(outputDate);

    if (Platform.OS === 'android' && onBlur) {
      setTimeout(() => {
        // @ts-ignore
        onBlur();
      }, 100);
    }
  };

  const handleIOSConfirm = () => {
    animateOut(() => {
      if (onBlur) {
        // @ts-ignore
        onBlur();
      }
    });
  };

  const handleBackdropPress = () => {
    if (Platform.OS === 'ios') {
      animateOut();
    }
  };

  const shouldShowSuccessIcon = showSuccessIcon && isValid && displayValue.trim().length > 0;
  const paddingLeft = leftIcon ? 45 : 16;
  const paddingRight = 48;

  const inputContainerStyle: ViewStyle = {
    height: typeof height === 'number' ? height : 52,
    paddingLeft,
    paddingRight,
    backgroundColor: theme.backgroundInput?.get() || '#F9F9F9',
    borderRadius: 12,
    borderWidth: 0,
    borderColor: 'transparent',
    justifyContent: 'center',
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

        <TouchableOpacity
          onPress={handleCalendarPress}
          activeOpacity={0.7}
        >
          <View style={inputContainerStyle}>
            <Text
              fontSize={14}
              color={displayValue ? (theme.color?.get() || '#000000') : (theme.placeholderTex?.get() || '#999999')}
            >
              {displayValue || placeholder}
            </Text>
          </View>
        </TouchableOpacity>

        {shouldShowSuccessIcon && successIcon && (
          <XStack
            position="absolute"
            right={12}
            top={0}
            bottom={0}
            alignItems="center"
            zIndex={2}
            pointerEvents="none"
          >
            {successIcon}
          </XStack>
        )}
      </YStack>

      {/* Modal iOS */}
      {Platform.OS === 'ios' && showPicker && (
        <Modal
          transparent
          visible={true}
          onRequestClose={() => animateOut()}
        >
          <Animated.View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              opacity: backdropAnim,
            }}
          >
            <Pressable
              style={{flex: 1}}
              onPress={handleBackdropPress}
            />
          </Animated.View>

          <Animated.View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              transform: [{translateY: slideAnim}],
            }}
          >
            <Pressable onPress={(e) => e.stopPropagation()}>
              <View
                style={{
                  backgroundColor: theme.background?.get() || '#ffffff',
                  borderTopLeftRadius: 24,
                  borderTopRightRadius: 24,
                  paddingBottom: 34,
                  shadowColor: '#000',
                  shadowOffset: {width: 0, height: -2},
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 5,
                }}
              >
                <View style={{alignItems: 'center', paddingTop: 12, paddingBottom: 8}}>
                  <View
                    style={{
                      width: 40,
                      height: 5,
                      backgroundColor: theme.borderColor?.get() || '#D0D0D0',
                      borderRadius: 3,
                    }}
                  />
                </View>

                <View style={{alignItems: 'center', paddingBottom: 8}}>
                  <DateTimePicker
                    value={selectedDate}
                    mode={mode}
                    display="spinner"
                    onChange={handleDateChange}
                    minimumDate={minDate}
                    maximumDate={maxDate}
                    locale="pt-BR"
                    style={{width: '100%'}}
                  />
                </View>

                <YStack paddingHorizontal="$4" paddingTop="$2">
                  <TouchableOpacity
                    onPress={handleIOSConfirm}
                    style={{
                      backgroundColor: theme.primary?.get() || '#007AFF',
                      paddingVertical: 16,
                      borderRadius: 14,
                      alignItems: 'center',
                      shadowColor: theme.primary?.get() || '#007AFF',
                      shadowOffset: {width: 0, height: 4},
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                      elevation: 4,
                    }}
                  >
                    <Text color="$buttonLabel" fontWeight="500" fontSize={17}>
                      Confirmar
                    </Text>
                  </TouchableOpacity>
                </YStack>
              </View>
            </Pressable>
          </Animated.View>
        </Modal>
      )}

      {/* Android */}
      {showPicker && Platform.OS === 'android' && (
        <DateTimePicker
          value={selectedDate}
          mode={mode}
          display="default"
          onChange={handleDateChange}
          minimumDate={minDate}
          maximumDate={maxDate}
          locale="pt-BR"
        />
      )}
    </YStack>
  );
}

export const DateInput = memo(forwardRef(BaseDateInput));
