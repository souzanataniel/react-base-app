import React from 'react';
import { View } from 'react-native';

export interface GradientDotPatternProps {
  /**
   * Espaçamento entre os pontos
   * @default 24
   */
  spacing?: number;

  /**
   * Tamanho de cada ponto
   * @default 2.5
   */
  dotSize?: number;

  /**
   * Opacidade base dos pontos
   * @default 0.15
   */
  baseOpacity?: number;

  /**
   * Cor dos pontos
   * @default 'white'
   */
  color?: string;

  /**
   * Posição X de início do gradiente (em porcentagem)
   * @default 40
   */
  startX?: number;

  /**
   * Intensidade do gradiente
   * @default 1.5
   */
  gradientIntensity?: number;

  /**
   * Largura do container (para cálculos)
   * @default 500
   */
  containerWidth?: number;

  /**
   * Altura do container (para cálculos)
   * @default 300
   */
  containerHeight?: number;
}

interface DotPosition {
  key: string;
  left: number;
  top: number;
  opacity: number;
}

export const GradientDotPattern = React.memo<GradientDotPatternProps>(({
                                                                         spacing = 24,
                                                                         dotSize = 2.5,
                                                                         baseOpacity = 0.15,
                                                                         color = 'white',
                                                                         startX = 40,
                                                                         gradientIntensity = 1.5,
                                                                         containerWidth = 500,
                                                                         containerHeight = 300
                                                                       }) => {
  const dots = React.useMemo(() => {
    const result: DotPosition[] = [];
    const cols = Math.ceil(containerWidth / spacing);
    const rows = Math.ceil(containerHeight / spacing);
    const startPosition = (startX / 100) * containerWidth;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const xPosition = j * spacing + spacing / 2;

        let opacity = 0;
        if (xPosition >= startPosition) {
          const normalizedX = (xPosition - startPosition) / (containerWidth - startPosition);
          opacity = Math.min(
            baseOpacity * Math.pow(normalizedX * gradientIntensity, 0.7),
            baseOpacity
          );
        }

        if (opacity > 0.01) {
          result.push({
            key: `dot-${i}-${j}`,
            left: xPosition - dotSize / 2,
            top: i * spacing + spacing / 2 - dotSize / 2,
            opacity: opacity,
          });
        }
      }
    }
    return result;
  }, [spacing, dotSize, baseOpacity, startX, gradientIntensity, containerWidth, containerHeight]);

  return (
    <>
      {dots.map((dot) => (
        <View
          key={dot.key}
          style={{
            position: 'absolute',
            left: dot.left,
            top: dot.top,
            width: dotSize,
            height: dotSize,
            borderRadius: dotSize / 2,
            backgroundColor: color,
            opacity: dot.opacity,
          }}
        />
      ))}
    </>
  );
});

GradientDotPattern.displayName = 'GradientDotPattern';
