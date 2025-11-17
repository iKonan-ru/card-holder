import { useEffect } from 'react';
import { type IModalItem, KEY_ESC } from '@shared/lib';

interface IUseModalKeyboardParams {
  modals: IModalItem[];
  closeTop: () => void;
  modalRequestCloseRef: React.MutableRefObject<Map<string, () => void>>;
  userActionRef: React.MutableRefObject<boolean>;
}

export const useModalKeyboard = ({
  modals,
  closeTop,
  modalRequestCloseRef,
  userActionRef,
}: IUseModalKeyboardParams) => {
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
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
      };
    }
  }, [modals, closeTop, modalRequestCloseRef, userActionRef]);
};
