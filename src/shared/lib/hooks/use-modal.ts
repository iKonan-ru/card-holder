import { useCallback, useId, type ReactNode } from 'react';
import { useModalContext } from '../modal';

export interface IUseModalReturn {
  open: (
    content: ReactNode,
    ariaLabelledBy?: string,
    ariaDescribedBy?: string,
    title?: string
  ) => void;
  close: () => void;
  updatePreventClose: (preventClose: boolean) => void;
  modalId: string;
}

export const useModal = (): IUseModalReturn => {
  const { openModal, closeModal, updateModalPreventClose, userActionRef } =
    useModalContext();
  const modalId = useId();

  const open = useCallback(
    (
      content: ReactNode,
      ariaLabelledBy?: string,
      ariaDescribedBy?: string,
      title?: string
    ) => {
      openModal(modalId, content, ariaLabelledBy, ariaDescribedBy, title);
    },
    [modalId, openModal]
  );

  const close = useCallback(() => {
    userActionRef.current = true;
    closeModal(modalId);
  }, [modalId, closeModal, userActionRef]);

  const updatePreventClose = useCallback(
    (preventClose: boolean) => {
      updateModalPreventClose(modalId, preventClose);
    },
    [modalId, updateModalPreventClose]
  );

  return {
    open,
    close,
    updatePreventClose,
    modalId,
  };
};
