import { useCallback, useId, type ReactNode } from 'react';
import type { Procedure } from '@shared/types';
import { useModalContext } from '../context';

export interface IUseModalResult {
  open: (content: ReactNode, title?: string) => void;
  close: Procedure;
  updatePreventClose: (preventClose: boolean) => void;
  modalId: string;
}

export const useModal = (): IUseModalResult => {
  const { openModal, closeModal, updateModalPreventClose, userActionRef } =
    useModalContext();
  const modalId = useId();

  const open = useCallback(
    (content: ReactNode, title?: string) => {
      openModal(modalId, content, title);
    },
    [modalId, openModal],
  );

  const close = useCallback(() => {
    userActionRef.current = true;
    closeModal(modalId);
  }, [modalId, closeModal, userActionRef]);

  const updatePreventClose = useCallback(
    (preventClose: boolean) => {
      updateModalPreventClose(modalId, preventClose);
    },
    [modalId, updateModalPreventClose],
  );

  return {
    open,
    close,
    updatePreventClose,
    modalId,
  };
};
