import { useEffect } from 'react';
import { ACTIVITY_EVENTS, INACTIVITY_TIMEOUT_MS } from '../constants';
import { useCryptoStore } from '../store';

export const useInactivityLock = (): void => {
  const lock = useCryptoStore((state) => state.lock);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(lock, INACTIVITY_TIMEOUT_MS);
    };

    ACTIVITY_EVENTS.forEach((event) => {
      document.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      ACTIVITY_EVENTS.forEach((event) => {
        document.removeEventListener(event, resetTimer);
      });
    };
  }, [lock]);
};
