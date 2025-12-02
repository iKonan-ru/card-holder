import { useCallback } from 'react';
import type { Procedure } from '@shared/types';
import { useModalClose } from './use-modal-close';

export const useAnimatedModalClose = (callback?: Procedure): Procedure => {
  const closeModal = useModalClose();

  return useCallback(() => {
    closeModal();

    if (callback) {
      callback();
    }
  }, [callback, closeModal]);
};
