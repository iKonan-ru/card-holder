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
      isClosingFromHistoryRef.current = true;
      closeTop();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === ESC_KEY) {
        userActionRef.current = true;
        closeTop();
      }
    };

    if (modals.length > 0) {
      window.addEventListener('popstate', handlePopState);
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        window.removeEventListener('popstate', handlePopState);
        window.removeEventListener('keydown', handleKeyDown);
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
            isTopModal={isTopModal}
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
