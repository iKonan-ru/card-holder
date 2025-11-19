import type { BeforeInstallPromptEvent } from '../../types';

export const checkForServiceWorkerUpdate = async (
  registration: ServiceWorkerRegistration
): Promise<void> => {
  if (registration.installing || !navigator.onLine) {
    return;
  }

  try {
    await registration.update();
  } catch (error: unknown) {
    console.error('SW update check error', error);
  }
};

export const checkIsBeforeInstallPromptEvent = (
  event: Event
): event is BeforeInstallPromptEvent => {
  return 'prompt' in event && 'userChoice' in event;
};

export const checkHasNavigatorStandalone = (
  navigator: Navigator
): navigator is Navigator & { standalone: boolean } => {
  return 'standalone' in navigator;
};
