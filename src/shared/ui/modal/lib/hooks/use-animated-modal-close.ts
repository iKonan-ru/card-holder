import { useCallback } from 'react';
import { useModalClose } from './use-modal-close';

export const useAnimatedModalClose = (callback?: () => void): (() => void) => {
  const closeModal = useModalClose();

  return useCallback(() => {
    closeModal();

    if (callback) {
      callback();
    }
  }, [callback, closeModal]);
};
