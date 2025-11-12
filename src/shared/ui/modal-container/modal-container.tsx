import { type FC, useEffect, useRef } from 'react';
import { useModalContext, MODAL_STATE_KEY, useModalStack } from '@shared/lib';
import { Portal } from '../portal';
import { Modal } from '../modal';
import { ESC_KEY } from './lib/constants';

export const ModalContainer: FC = () => {
  const { modals, closeModal, userActionRef } = useModalContext();
  const { push, remove, closeTop } = useModalStack();
  const previousModalIdsRef = useRef<Set<string>>(new Set());
  const isClosingFromHistoryRef = useRef(false);
  const modalRequestCloseRef = useRef<Map<string, () => void>>(new Map());

  useEffect(() => {
    const currentModalIds = new Set(modals.map((modal) => modal.id));
    const previousModalIds = previousModalIdsRef.current;

    modals.forEach((modal) => {
      if (!previousModalIds.has(modal.id)) {
        const handleClose = () => {
          closeModal(modal.id);
        };

        push(modal.id, handleClose);
        window.history.pushState({ [MODAL_STATE_KEY]: true }, '');
      }
    });

    previousModalIds.forEach((modalId) => {
      if (!currentModalIds.has(modalId)) {
        remove(modalId);
        modalRequestCloseRef.current.delete(modalId);

        const shouldSkipHistoryBack =
          isClosingFromHistoryRef.current || userActionRef.current;

        if (!shouldSkipHistoryBack) {
          window.history.back();
        }

        isClosingFromHistoryRef.current = false;
        userActionRef.current = false;
      }
    });

    previousModalIdsRef.current = currentModalIds;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modals, push, remove, closeModal]);

  useEffect(() => {
    const handlePopState = () => {
      const topModalId = modals[modals.length - 1]?.id;
      const requestClose = modalRequestCloseRef.current.get(topModalId);

      if (requestClose) {
        isClosingFromHistoryRef.current = true;
        requestClose();
      } else {
        isClosingFromHistoryRef.current = true;
        closeTop();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === ESC_KEY) {
        const topModal = modals[modals.length - 1];
        const topModalId = topModal?.id;

        const isPreventClose = topModal?.preventClose ?? false;

        if (isPreventClose) {
          return;
        }

        const requestClose = modalRequestCloseRef.current.get(topModalId);

        if (requestClose) {
          userActionRef.current = true;
          requestClose();
        } else {
          userActionRef.current = true;
          closeTop();
        }
      }
    };

    const hasModals = modals.length > 0;

    if (hasModals) {
      window.addEventListener('popstate', handlePopState);
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';

      return () => {
        window.removeEventListener('popstate', handlePopState);
        window.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modals.length, closeTop]);

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
            ariaLabelledBy={modal.ariaLabelledBy}
            ariaDescribedBy={modal.ariaDescribedBy}
          >
            {modal.content}
          </Modal>
        );
      })}
    </Portal>
  );
};
