import { useCallback, useId, type ReactNode } from 'react';
import { useModalContext } from '../modal';
import type { IUseModalReturn } from './types';

export const useModal = (): IUseModalReturn => {
  const { openModal, closeModal, userActionRef } = useModalContext();
  const modalId = useId();

  const open = useCallback(
    (
      content: ReactNode,
      onClose?: () => void,
      ariaLabelledBy?: string,
      ariaDescribedBy?: string
    ) => {
      const handleClose = () => {
        if (onClose) {
          onClose();
        }
      };

      openModal(modalId, content, handleClose, ariaLabelledBy, ariaDescribedBy);
    },
    [modalId, openModal]
  );

  const close = useCallback(() => {
    userActionRef.current = true;
    closeModal(modalId);
  }, [modalId, closeModal, userActionRef]);

  return {
    open,
    close,
    modalId,
  };
};
