import type { IBeforeInstallPromptEvent } from '../../types';
import { logError } from './logger';

export const checkForServiceWorkerUpdate = async (
  registration: ServiceWorkerRegistration,
): Promise<void> => {
  if (registration.installing || !navigator.onLine) {
    return;
  }

  try {
    await registration.update();
  } catch (error: unknown) {
    logError({ message: 'SW update check error', error });
  }
};

export const checkIsBeforeInstallPromptEvent = (
  event: Event,
): event is IBeforeInstallPromptEvent => {
  return 'prompt' in event && 'userChoice' in event;
};

export const checkHasNavigatorStandalone = (
  navigator: Navigator,
): navigator is Navigator & { standalone: boolean } => {
  return 'standalone' in navigator;
};
