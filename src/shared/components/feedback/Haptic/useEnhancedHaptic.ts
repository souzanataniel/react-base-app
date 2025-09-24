import {useCallback} from 'react';
import {useHapticFeedback} from '@/shared/components/feedback/Haptic/HapticContext';

export const useActionWithHaptic = () => {
  const haptic = useHapticFeedback();

  const withHaptic = useCallback((
    action: () => void | Promise<void>,
    hapticType: 'light' | 'medium' | 'heavy' | 'selection' | 'success' | 'warning' | 'error' = 'light'
  ) => {
    return async () => {
      haptic[hapticType]();
      await action();
    };
  }, [haptic]);

  return {withHaptic};
};

export const useNavigationWithHaptic = () => {
  const haptic = useHapticFeedback();

  const navigateWithHaptic = useCallback((
    navigationFn: () => void,
    hapticType: 'light' | 'medium' | 'heavy' | 'selection' = 'light'
  ) => {
    haptic[hapticType]();
    navigationFn();
  }, [haptic]);

  return {navigateWithHaptic};
};

export const useSwitchWithHaptic = () => {
  const haptic = useHapticFeedback();

  const createSwitchHandler = useCallback((
    setter: (value: boolean) => void,
    hapticType: 'selection' | 'light' = 'selection'
  ) => {
    return (value: boolean) => {
      haptic[hapticType]();
      setter(value);
    };
  }, [haptic]);

  return {createSwitchHandler};
};

export const useUploadWithHaptic = () => {
  const haptic = useHapticFeedback();

  const onUploadSuccess = useCallback((callback?: (url: string) => void) => {
    return (url: string) => {
      haptic.success();
      callback?.(url);
    };
  }, [haptic]);

  const onUploadError = useCallback((callback?: (error: Error) => void) => {
    return (error: Error) => {
      haptic.error();
      callback?.(error);
    };
  }, [haptic]);

  return {onUploadSuccess, onUploadError};
};
