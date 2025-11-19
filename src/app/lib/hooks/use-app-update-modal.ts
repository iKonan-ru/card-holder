import { useEffect, useRef, createElement } from 'react';
import { useModal } from '@shared/lib';
import {
  PWAUpdate,
  PWA_UPDATE_TITLE_ID,
  PWA_UPDATE_MESSAGE_ID,
  PWA_UPDATE_TITLE,
} from '@features/pwa-update';
import { usePWAUpdate } from './use-pwa-update';

export const useAppUpdateModal = (): void => {
  const { needRefresh, updateServiceWorker } = usePWAUpdate();
  const updateModal = useModal();
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
      updateModal.close();
    };

    const modalContent = createElement(PWAUpdate, {
      onUpdate: handleUpdate,
      onDismiss: handleDismissUpdate,
    });

    updateModal.open(
      modalContent,
      PWA_UPDATE_TITLE_ID,
      PWA_UPDATE_MESSAGE_ID,
      PWA_UPDATE_TITLE
    );
  }, [needRefresh, updateServiceWorker, updateModal]);
};
