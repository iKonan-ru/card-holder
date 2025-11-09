import { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

const UPDATE_CHECK_INTERVAL = 60 * 1000;

export const usePWAUpdate = (): void => {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl, registration) {
      if (!registration) {
        return;
      }

      setInterval(async () => {
        if (registration.installing || !navigator.onLine) {
          return;
        }

        await registration.update();
      }, UPDATE_CHECK_INTERVAL);
    },
    onRegisterError(error) {
      console.error('SW registration error', error);
    },
  });

  useEffect(() => {
    if (!needRefresh) {
      return;
    }

    void updateServiceWorker(true);
  }, [needRefresh, updateServiceWorker]);
};
