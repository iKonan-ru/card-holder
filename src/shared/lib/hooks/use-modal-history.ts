import { useEffect, useRef, type RefObject } from 'react';
import type { Procedure } from '@shared/types';
import { MODAL_STATE_KEY } from '../constants';
import type { IModalItem } from '../context';

interface IUseModalHistoryParams {
  modals: IModalItem[];
  push: (id: string, onClose: Procedure) => void;
  remove: (id: string) => void;
  closeModal: (id: string) => void;
  userActionRef: RefObject<boolean>;
  modalRequestCloseRef: RefObject<Map<string, Procedure>>;
}

interface IUseModalHistoryResult {
  isClosingFromHistoryRef: RefObject<boolean>;
}

export const useModalHistory = ({
  modals,
  push,
  remove,
  closeModal,
  userActionRef,
  modalRequestCloseRef,
}: IUseModalHistoryParams): IUseModalHistoryResult => {
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
  }, [modals, push, remove, closeModal, userActionRef, modalRequestCloseRef]);

  return { isClosingFromHistoryRef };
};
