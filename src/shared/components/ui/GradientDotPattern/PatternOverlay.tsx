import React from 'react';
import { styled, View } from 'tamagui';
import { GradientDotPattern, GradientDotPatternProps } from './GradientDotPattern';

const OverlayContainer = styled(View, {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1,
});

export interface PatternOverlayProps extends GradientDotPatternProps {
  /**
   * Se deve mostrar o pattern ou não
   * @default true
   */
  enabled?: boolean;

  /**
   * Z-index do overlay
   * @default 1
   */
  zIndex?: number;
}

export const PatternOverlay: React.FC<PatternOverlayProps> = ({
                                                                enabled = true,
                                                                zIndex = 1,
                                                                ...patternProps
                                                              }) => {
  if (!enabled) {
    return null;
  }

  return (
    <OverlayContainer style={{ zIndex }}>
      <GradientDotPattern {...patternProps} />
    </OverlayContainer>
  );
};
