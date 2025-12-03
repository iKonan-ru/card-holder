import { createElement, useEffect, useRef } from 'react';
import { PWA_UPDATE_TITLE, PWAUpdate } from '@features/pwa-update';
import { useModal } from '@shared/lib';
import { usePWAUpdate } from './use-pwa-update';

export const useAppUpdateModal = (): void => {
  const { needRefresh, updateServiceWorker } = usePWAUpdate();
  const { open, close } = useModal();
  const wasOpenedRef = useRef(false);

  useEffect(() => {
    if (!needRefresh) {
      wasOpenedRef.current = false;

      return;
    }

    if (wasOpenedRef.current) {
      return;
    }

    wasOpenedRef.current = true;

    const handleUpdate = async () => {
      await updateServiceWorker(true);
    };

    const handleDismissUpdate = () => {
      close();
    };

    const modalContent = createElement(PWAUpdate, {
      onUpdate: handleUpdate,
      onDismiss: handleDismissUpdate,
    });

    open(modalContent, PWA_UPDATE_TITLE);
  }, [needRefresh, updateServiceWorker, open, close]);
};
