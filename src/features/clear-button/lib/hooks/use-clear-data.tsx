import { useState, useCallback } from 'react';
import { useModalContext } from '@shared/lib';
import { ConfirmModal } from '@shared/ui';
import {
  CONFIRM_MODAL_ID,
  CONFIRM_CLEAR_TITLE,
  CONFIRM_CLEAR_MESSAGE,
  CONFIRM_CLEAR_BUTTON,
  CANCEL_CLEAR_BUTTON,
} from '../constants';

interface IUseClearDataParams {
  onClear: () => Promise<void>;
}

interface IUseClearData {
  isClearing: boolean;
  clearData: () => void;
}

export const useClearData = (params: IUseClearDataParams): IUseClearData => {
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
