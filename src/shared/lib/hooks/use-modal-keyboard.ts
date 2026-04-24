import { useEffect, type RefObject } from 'react';
import type { Procedure } from '@shared/types';
import { KEY_ESC } from '../constants';
import type { IModalItem } from '../context';

interface IUseModalKeyboardParams {
  modals: IModalItem[];
  closeTop: Procedure;
  modalRequestCloseRef: RefObject<Map<string, Procedure>>;
  userActionRef: RefObject<boolean>;
}

export const useModalKeyboard = ({
  modals,
  closeTop,
  modalRequestCloseRef,
  userActionRef,
}: IUseModalKeyboardParams): void => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === KEY_ESC) {
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
      const previousOverflow = document.body.style.overflow;
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = previousOverflow;
      };
    }
  }, [modals, closeTop, modalRequestCloseRef, userActionRef]);
};
