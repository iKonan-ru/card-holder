// @ts-expect-error - virtual module from vite-plugin-pwa
import { useRegisterSW } from 'virtual:pwa-register/react';

const UPDATE_CHECK_INTERVAL = 60 * 60 * 1000;

export interface IUsePWAUpdateReturn {
  needRefresh: boolean;
  updateServiceWorker: (reloadPage?: boolean) => Promise<void>;
}

export const usePWAUpdate = (): IUsePWAUpdateReturn => {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(
      _swUrl: string,
      registration: ServiceWorkerRegistration | undefined
    ) {
      if (!registration) {
        return;
      }

      setInterval(async () => {
        if (registration.installing || !navigator.onLine) {
          return;
        }

        try {
          await registration.update();
        } catch (error: unknown) {
          console.error('SW update check error', error);
        }
      }, UPDATE_CHECK_INTERVAL);
    },
    onRegisterError(error: Error) {
      console.error('SW registration error', error);
    },
  });

  return {
    needRefresh,
    updateServiceWorker,
  };
};
