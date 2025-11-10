import { useCallback } from 'react';
import { useModalClose } from './modal-close-context';

export const useAnimatedModalClose = (callback?: () => void): (() => void) => {
  const closeModal = useModalClose();

  return useCallback(() => {
    closeModal();

    if (callback) {
      callback();
    }
  }, [callback, closeModal]);
};
