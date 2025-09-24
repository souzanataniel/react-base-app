import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

type HapticType =
  | 'light'
  | 'medium'
  | 'heavy'
  | 'selection'
  | 'success'
  | 'warning'
  | 'error';

interface HapticContextType {
  isHapticEnabled: boolean;
  setHapticEnabled: (enabled: boolean) => void;
  triggerHaptic: (type: HapticType) => void;
  toggleHaptic: () => void;
}

const HapticContext = createContext<HapticContextType | undefined>(undefined);

interface HapticProviderProps {
  children: ReactNode;
}

export const HapticProvider: React.FC<HapticProviderProps> = ({ children }) => {
  const [isHapticEnabled, setIsHapticEnabled] = useState(true);

  useEffect(() => {
    loadHapticPreference();
  }, []);

  const loadHapticPreference = async () => {
    try {
      const saved = await AsyncStorage.getItem('@haptic_enabled');
      if (saved !== null) {
        setIsHapticEnabled(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading haptic preference:', error);
    }
  };

  const setHapticEnabled = async (enabled: boolean) => {
    try {
      setIsHapticEnabled(enabled);
      await AsyncStorage.setItem('@haptic_enabled', JSON.stringify(enabled));
    } catch (error) {
      console.error('Error saving haptic preference:', error);
    }
  };

  const toggleHaptic = () => {
    setHapticEnabled(!isHapticEnabled);
  };

  const triggerHaptic = async (type: HapticType) => {
    if (!isHapticEnabled) return;

    try {
      switch (type) {
        case 'light':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'medium':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case 'heavy':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
        case 'selection':
          await Haptics.selectionAsync();
          break;
        case 'success':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        case 'warning':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          break;
        case 'error':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          break;
        default:
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (error) {
      console.error('Error triggering haptic feedback:', error);
    }
  };

  const value: HapticContextType = {
    isHapticEnabled,
    setHapticEnabled,
    triggerHaptic,
    toggleHaptic,
  };

  return (
    <HapticContext.Provider value={value}>
      {children}
    </HapticContext.Provider>
  );
};

export const useHaptic = () => {
  const context = useContext(HapticContext);
  if (context === undefined) {
    throw new Error('useHaptic must be used within a HapticProvider');
  }
  return context;
};

export const useHapticFeedback = () => {
  const { triggerHaptic } = useHaptic();

  return {
    light: () => triggerHaptic('light'),
    medium: () => triggerHaptic('medium'),
    heavy: () => triggerHaptic('heavy'),
    selection: () => triggerHaptic('selection'),
    success: () => triggerHaptic('success'),
    warning: () => triggerHaptic('warning'),
    error: () => triggerHaptic('error'),
  };
};
