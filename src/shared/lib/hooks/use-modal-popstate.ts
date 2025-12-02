import { useEffect, type RefObject } from 'react';
import type { Procedure } from '@shared/types';
import type { IModalItem } from '../context';

interface IUseModalPopstateParams {
  modals: IModalItem[];
  closeTop: Procedure;
  modalRequestCloseRef: RefObject<Map<string, Procedure>>;
  isClosingFromHistoryRef: RefObject<boolean>;
}

export const useModalPopstate = ({
  modals,
  closeTop,
  modalRequestCloseRef,
  isClosingFromHistoryRef,
}: IUseModalPopstateParams): void => {
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
