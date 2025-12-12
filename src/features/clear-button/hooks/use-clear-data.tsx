import { useCallback, useState } from 'react';
import { useModalContext } from '@shared/lib';
import type { Procedure } from '@shared/types';
import { ConfirmModal } from '@shared/ui';
import {
  CANCEL_CLEAR_BUTTON,
  CONFIRM_CLEAR_BUTTON,
  CONFIRM_CLEAR_MESSAGE,
  CONFIRM_CLEAR_TITLE,
  CONFIRM_MODAL_ID,
} from '../constants';

interface IUseClearDataParams {
  onClear: () => Promise<void>;
}

interface IUseClearDataResult {
  isClearing: boolean;
  clearData: Procedure;
}

export const useClearData = (
  params: IUseClearDataParams,
): IUseClearDataResult => {
  const { onClear } = params;
  const [isClearing, setIsClearing] = useState(false);
  const { openModal, closeModal } = useModalContext();

  const handleConfirm = useCallback(async () => {
    try {
      setIsClearing(true);
      await onClear();
      closeModal(CONFIRM_MODAL_ID);
    } finally {
      setIsClearing(false);
    }
  }, [onClear, closeModal]);

  const clearData = useCallback(() => {
    const modalContent = (
      <ConfirmModal
        message={CONFIRM_CLEAR_MESSAGE}
        confirmText={CONFIRM_CLEAR_BUTTON}
        cancelText={CANCEL_CLEAR_BUTTON}
        onConfirm={handleConfirm}
      />
    );

    openModal(CONFIRM_MODAL_ID, modalContent, CONFIRM_CLEAR_TITLE);
  }, [handleConfirm, openModal]);

  return {
    isClearing,
    clearData,
  };
};
