import * as Haptics from 'expo-haptics';
import {useHaptic} from '@/shared/components/feedback/Haptic/HapticContext';
import React from 'react';

export const useControlledHaptics = () => {
  const {isHapticEnabled} = useHaptic();

  const impactLight = async () => {
    if (isHapticEnabled) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const impactMedium = async () => {
    if (isHapticEnabled) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const impactHeavy = async () => {
    if (isHapticEnabled) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
  };

  const selection = async () => {
    if (isHapticEnabled) {
      await Haptics.selectionAsync();
    }
  };

  const notificationSuccess = async () => {
    if (isHapticEnabled) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const notificationWarning = async () => {
    if (isHapticEnabled) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  };

  const notificationError = async () => {
    if (isHapticEnabled) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  return {
    impactAsync: {
      Light: impactLight,
      Medium: impactMedium,
      Heavy: impactHeavy,
    },
    selectionAsync: selection,
    notificationAsync: {
      Success: notificationSuccess,
      Warning: notificationWarning,
      Error: notificationError,
    },
    impact: {
      light: impactLight,
      medium: impactMedium,
      heavy: impactHeavy,
    },
    notification: {
      success: notificationSuccess,
      warning: notificationWarning,
      error: notificationError,
    },
    selection,
  };
};

export const createControlledHaptic = (isEnabled: boolean) => {
  return {
    impactAsync: async (style: Haptics.ImpactFeedbackStyle) => {
      if (isEnabled) {
        await Haptics.impactAsync(style);
      }
    },
    selectionAsync: async () => {
      if (isEnabled) {
        await Haptics.selectionAsync();
      }
    },
    notificationAsync: async (type: Haptics.NotificationFeedbackType) => {
      if (isEnabled) {
        await Haptics.notificationAsync(type);
      }
    },
  };
};

export const withControlledHaptic = <P extends object>(
  WrappedComponent: React.ComponentType<P & { haptic?: ReturnType<typeof useControlledHaptics> }>
) => {
  const ComponentWithHaptic = (props: P) => {
    const haptic = useControlledHaptics();
    return React.createElement(WrappedComponent, {...props, haptic} as P & {
      haptic: ReturnType<typeof useControlledHaptics>
    });
  };

  ComponentWithHaptic.displayName = `withControlledHaptic(${WrappedComponent.displayName || WrappedComponent.name})`;
  return ComponentWithHaptic;
};
