import { useCallback, useRef, type FC } from 'react';
import {
  useModalContext,
  useModalHistory,
  useModalKeyboard,
  useModalPopstate,
  useModalStack,
  type IModalItem,
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

  const topModalId = modals[modals.length - 1]?.id;

  const renderModal = useCallback(
    ({ id, preventClose, title, content }: IModalItem) => {
      const isTopModal = id === topModalId;
      const handleClose = () => {
        userActionRef.current = true;
        closeModal(id);
      };
      const handleRegisterClose = (closeWithAnimation: Procedure) =>
        modalRequestCloseRef.current.set(id, closeWithAnimation);

      return (
        <Modal
          key={id}
          onClose={handleClose}
          onRegisterClose={handleRegisterClose}
          isTopModal={isTopModal}
          preventClose={preventClose}
          title={title}
        >
          {content}
        </Modal>
      );
    },
    [topModalId, closeModal, userActionRef, modalRequestCloseRef],
  );

  if (!modals.length) {
    return null;
  }

  return <Portal>{modals.map(renderModal)}</Portal>;
};
