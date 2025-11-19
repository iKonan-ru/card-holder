import { useEffect } from 'react';
import type { IModalItem } from '../modal';

interface IUseModalPopstateParams {
  modals: IModalItem[];
  closeTop: () => void;
  modalRequestCloseRef: React.MutableRefObject<Map<string, () => void>>;
  isClosingFromHistoryRef: React.MutableRefObject<boolean>;
}

export const useModalPopstate = ({
  modals,
  closeTop,
  modalRequestCloseRef,
  isClosingFromHistoryRef,
}: IUseModalPopstateParams) => {
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

    const hasModals = modals.length > 0;

    if (hasModals) {
      window.addEventListener('popstate', handlePopState);

      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [modals, closeTop, modalRequestCloseRef, isClosingFromHistoryRef]);
};
