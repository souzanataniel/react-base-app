import {useGlobalLoader} from './BaseLoaderProvider';

export function useBaseLoader() {
  const loader = useGlobalLoader();

  const withLoader = async <T, >(
    operation: () => Promise<T>,
    message?: string,
    minDuration = 500
  ): Promise<T> => {
    const startTime = Date.now();

    try {
      loader.show(message);
      const result = await operation();

      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minDuration - elapsed);

      if (remaining > 0) {
        await new Promise(resolve => setTimeout(resolve, remaining));
      }

      return result;
    } finally {
      loader.hide();
    }
  };

  return {
    ...loader,
    withLoader,
  };
}
