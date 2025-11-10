import { useCallback, useId, type ReactNode } from 'react';
import { useModalContext } from '../modal';
import type { IUseModalReturn } from './types';

export const useModal = (): IUseModalReturn => {
  const { openModal, closeModal, userActionRef } = useModalContext();
  const modalId = useId();

  const open = useCallback(
    (content: ReactNode, ariaLabelledBy?: string, ariaDescribedBy?: string) => {
      openModal(modalId, content, ariaLabelledBy, ariaDescribedBy);
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
