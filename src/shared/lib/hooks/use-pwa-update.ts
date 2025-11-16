import { useRegisterSW } from 'virtual:pwa-register/react';

const UPDATE_CHECK_INTERVAL = 60 * 1000;

export interface IUsePWAUpdateReturn {
  needRefresh: boolean;
  updateServiceWorker: (reloadPage?: boolean) => Promise<void>;
}

export const usePWAUpdate = (): IUsePWAUpdateReturn => {
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

        try {
          await registration.update();
        } catch (error) {
          console.error('SW update check error', error);
        }
      }, UPDATE_CHECK_INTERVAL);
    },
    onRegisterError(error) {
      console.error('SW registration error', error);
    },
  });

  return {
    needRefresh,
    updateServiceWorker,
  };
};
