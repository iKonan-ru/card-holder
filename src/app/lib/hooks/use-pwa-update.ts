// @ts-expect-error - virtual module from vite-plugin-pwa
import { useRegisterSW } from 'virtual:pwa-register/react';
import { useEffect, useRef } from 'react';
import {
  checkForServiceWorkerUpdate,
  INITIAL_UPDATE_DELAY,
  UPDATE_CHECK_INTERVAL,
} from '@shared/lib';

export interface IUsePWAUpdateReturn {
  needRefresh: boolean;
  updateServiceWorker: (reloadPage?: boolean) => Promise<void>;
}

export const usePWAUpdate = (): IUsePWAUpdateReturn => {
  const registrationRef = useRef<ServiceWorkerRegistration | null>(null);
  const intervalIdRef = useRef<number | null>(null);

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

      registrationRef.current = registration;

      const handleInitialCheck = () => {
        setTimeout(() => {
          void checkForServiceWorkerUpdate(registration);
        }, INITIAL_UPDATE_DELAY);
      };

      handleInitialCheck();

      intervalIdRef.current = window.setInterval(() => {
        void checkForServiceWorkerUpdate(registration);
      }, UPDATE_CHECK_INTERVAL);
    },
    onRegisterError(error: Error) {
      console.error('SW registration error', error);
    },
  });

  useEffect(() => {
    const handleFocus = () => {
      if (registrationRef.current) {
        void checkForServiceWorkerUpdate(registrationRef.current);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && registrationRef.current) {
        void checkForServiceWorkerUpdate(registrationRef.current);
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      if (intervalIdRef.current !== null) {
        window.clearInterval(intervalIdRef.current);
      }
    };
  }, []);

  return {
    needRefresh,
    updateServiceWorker,
  };
};
