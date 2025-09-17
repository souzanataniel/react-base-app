import React from 'react';
import {View, XStack, YStack} from 'tamagui';

type FormStepperProps = {
  currentStep: number;
  totalSteps: number;
};

export function FormStepper({currentStep, totalSteps}: FormStepperProps) {
  return (
    <YStack paddingHorizontal="$4">
      <XStack gap="$2" alignItems="center">
        {Array.from({length: totalSteps}, (_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          return (
            <View
              key={stepNumber}
              flex={1}
              height={4}
              backgroundColor={isActive || isCompleted ? '$defaultPrimary' : '$defaultPlaceholderText'}
              borderRadius="$1"
              animation="quick"
              animateOnly={['backgroundColor']}
            />
          );
        })}
      </XStack>
    </YStack>
  );
}
