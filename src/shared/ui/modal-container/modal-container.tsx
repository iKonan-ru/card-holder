import { useRef, type FC } from 'react';
import {
  useModalContext,
  useModalHistory,
  useModalKeyboard,
  useModalPopstate,
  useModalStack,
} from '@shared/lib';
import type { Procedure } from '@shared/types';
import { Modal } from '../modal';
import { Portal } from '../portal';

export const ModalContainer: FC = () => {
  const { modals, closeModal, userActionRef } = useModalContext();
  const { push, remove, closeTop } = useModalStack();
  const modalRequestCloseRef = useRef<Map<string, Procedure>>(new Map());

  const { isClosingFromHistoryRef } = useModalHistory({
    modals,
    push,
    remove,
    closeModal,
    userActionRef,
    modalRequestCloseRef,
  });

  useModalPopstate({
    modals,
    closeTop,
    modalRequestCloseRef,
    isClosingFromHistoryRef,
  });

  useModalKeyboard({
    modals,
    closeTop,
    modalRequestCloseRef,
    userActionRef,
  });

  if (modals.length === 0) {
    return null;
  }

  const topModalId = modals[modals.length - 1]?.id;

  const handleModalClose = (modalId: string) => {
    userActionRef.current = true;
    closeModal(modalId);
  };

  return (
    <Portal>
      {modals.map((modal) => {
        const isTopModal = modal.id === topModalId;

        return (
          <Modal
            key={modal.id}
            onClose={() => {
              handleModalClose(modal.id);
            }}
            onRegisterClose={(closeWithAnimation) => {
              modalRequestCloseRef.current.set(modal.id, closeWithAnimation);
            }}
            isTopModal={isTopModal}
            preventClose={modal.preventClose}
            title={modal.title}
          >
            {modal.content}
          </Modal>
        );
      })}
    </Portal>
  );
};
