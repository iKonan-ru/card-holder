import { useEffect, useRef, createElement } from 'react';
import { useModal } from '@shared/lib';
import {
  UpdateModal,
  UPDATE_MODAL_TITLE_ID,
  UPDATE_MODAL_MESSAGE_ID,
  UPDATE_MODAL_TITLE,
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

    const modalContent = createElement(UpdateModal, {
      onUpdate: handleUpdate,
      onDismiss: handleDismissUpdate,
    });

    updateModal.open(
      modalContent,
      UPDATE_MODAL_TITLE_ID,
      UPDATE_MODAL_MESSAGE_ID,
      UPDATE_MODAL_TITLE
    );
  }, [needRefresh, updateServiceWorker, updateModal]);
};
