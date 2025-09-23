import React, {memo, useMemo} from 'react';
import {Progress, Text, XStack, YStack} from 'tamagui';

type PasswordStrength = 'weak' | 'medium' | 'strong';

interface PasswordStrengthIndicatorProps {
  password: string;
  strength?: PasswordStrength; // Opcional - se não fornecido, calcula automaticamente
  showWhenEmpty?: boolean;
  label?: string;
  marginTop?: string;
  paddingHorizontal?: string;
  showRequirements?: boolean; // Mostrar lista de requisitos
}

interface StrengthConfig {
  color: string;
  progress: number;
  text: string;
}

const strengthConfig: Record<PasswordStrength, StrengthConfig> = {
  weak: {color: '$error', progress: 33, text: 'Fraca'},
  medium: {color: '$warning', progress: 66, text: 'Média'},
  strong: {color: '$success', progress: 100, text: 'Forte'},
};

// Função para calcular a força da senha
const calculatePasswordStrength = (password: string): PasswordStrength => {
  if (password.length === 0) return 'weak';

  let score = 0;

  // Critérios de força
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1; // Caracteres especiais

  if (score >= 5) return 'strong';
  if (score >= 3) return 'medium';
  return 'weak';
};

// Função para verificar requisitos individuais
const checkRequirements = (password: string) => ({
  minLength: password.length >= 8,
  hasLowercase: /[a-z]/.test(password),
  hasUppercase: /[A-Z]/.test(password),
  hasNumber: /\d/.test(password),
  hasSpecialChar: /[^a-zA-Z0-9]/.test(password),
});

export const PasswordStrengthIndicator = memo<PasswordStrengthIndicatorProps>(({
                                                                                 password,
                                                                                 strength,
                                                                                 showWhenEmpty = false,
                                                                                 label = 'Força da senha:',
                                                                                 marginTop = '$1',
                                                                                 paddingHorizontal = '$2',
                                                                                 showRequirements = false
                                                                               }) => {
  // Calcular força automaticamente se não fornecida
  const calculatedStrength = useMemo(() =>
      strength || calculatePasswordStrength(password),
    [password, strength]
  );

  const requirements = useMemo(() =>
      checkRequirements(password),
    [password]
  );

  // Não mostrar se a senha estiver vazia (a menos que showWhenEmpty seja true)
  if (password.length === 0 && !showWhenEmpty) {
    return null;
  }

  const currentStrength = strengthConfig[calculatedStrength];

  return (
    <YStack gap="$2" paddingHorizontal={paddingHorizontal} marginTop={marginTop}>
      {/* Indicador principal */}
      <XStack justifyContent="space-between" alignItems="center">
        <Text fontSize="$2" color="$light">
          {label}
        </Text>
        <Text fontSize="$2" color={currentStrength.color} fontWeight="600">
          {currentStrength.text}
        </Text>
      </XStack>

      <Progress
        value={currentStrength.progress}
        backgroundColor="$lighter"
        height={4}
      >
        <Progress.Indicator
          backgroundColor={currentStrength.color}
          animation="bouncy"
        />
      </Progress>

      {/* Lista de requisitos (opcional) */}
      {showRequirements && password.length > 0 && (
        <YStack gap="$1" marginTop="$1">
          <Text fontSize="$1" color="$light" fontWeight="500">
            Requisitos:
          </Text>

          <RequirementItem
            met={requirements.minLength}
            text="Mínimo 8 caracteres"
          />
          <RequirementItem
            met={requirements.hasLowercase}
            text="Letra minúscula"
          />
          <RequirementItem
            met={requirements.hasUppercase}
            text="Letra maiúscula"
          />
          <RequirementItem
            met={requirements.hasNumber}
            text="Número"
          />
          <RequirementItem
            met={requirements.hasSpecialChar}
            text="Caractere especial"
          />
        </YStack>
      )}
    </YStack>
  );
});

// Componente auxiliar para mostrar requisitos
const RequirementItem = memo<{ met: boolean; text: string }>(({met, text}) => (
  <XStack alignItems="center" gap="$1">
    <Text
      fontSize="$1"
      color={met ? '$success' : '$light'}
      fontWeight="500"
    >
      {met ? '✓' : '○'}
    </Text>
    <Text
      fontSize="$1"
      color={met ? '$success' : '$light'}
      textDecorationLine={met ? 'line-through' : 'none'}
    >
      {text}
    </Text>
  </XStack>
));
