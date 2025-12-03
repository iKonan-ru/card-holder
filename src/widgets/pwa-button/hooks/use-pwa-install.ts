import { useCallback, useEffect, useState } from 'react';
import {
  checkHasNavigatorStandalone,
  checkIsBeforeInstallPromptEvent,
} from '@shared/lib';
import type { IBeforeInstallPromptEvent } from '@shared/types';

interface IUsePWAInstallResult {
  canInstall: boolean;
  isInstalled: boolean;
  handleInstall: () => Promise<void>;
}

export const usePWAInstall = (): IUsePWAInstallResult => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<IBeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      if (!checkIsBeforeInstallPromptEvent(event)) {
        return;
      }

      event.preventDefault();
      setDeferredPrompt(event);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsInstalled(true);
    };

    const checkIfInstalled = () => {
      const isStandalone = window.matchMedia(
        '(display-mode: standalone)'
      ).matches;
      const isNavigatorStandalone =
        checkHasNavigatorStandalone(window.navigator) &&
        window.navigator.standalone;
      const isInStandaloneMode = isNavigatorStandalone || isStandalone;

      if (isInStandaloneMode) {
        setIsInstalled(true);
      }
    };

    checkIfInstalled();

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = useCallback(async (): Promise<void> => {
    if (!deferredPrompt) {
      return;
    }

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  }, [deferredPrompt]);

  return {
    canInstall: Boolean(deferredPrompt),
    isInstalled,
    handleInstall,
  };
};
