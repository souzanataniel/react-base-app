import React from 'react'
import {LinearGradient} from 'expo-linear-gradient'
import {Stack} from 'tamagui'
import {gradients} from '@/shared/constants/gradient';

interface GradientBoxProps {
  gradient: keyof typeof gradients
  children?: React.ReactNode

  [key: string]: any // Para props do Stack
}

export const GradientBox: React.FC<GradientBoxProps> = ({
                                                          gradient,
                                                          children,
                                                          ...stackProps
                                                        }) => {
  const selectedGradient = gradients[gradient]

  if (!selectedGradient) {
    console.warn(`Gradiente "${gradient}" não encontrado`)
    return <Stack {...stackProps}>{children}</Stack>
  }

  return (
    <Stack position="relative" {...stackProps}>
      <LinearGradient
        colors={selectedGradient}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          borderRadius: stackProps.borderRadius || 0,
        }}
      />
      <Stack position="relative" zIndex={1}>
        {children}
      </Stack>
    </Stack>
  )
}

export const useGradient = (gradient: keyof typeof gradients) => {
  return gradients[gradient]
}
