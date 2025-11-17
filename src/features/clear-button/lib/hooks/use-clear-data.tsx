import { useState, useCallback } from 'react';
import { useModalContext, INITIAL_FALSE } from '@shared/lib';
import { ConfirmModal } from '@shared/ui';
import {
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

const CONFIRM_MODAL_ID = 'confirm-clear-all';
const CONFIRM_MODAL_TITLE_ID = 'confirm-clear-all-title';
const CONFIRM_MODAL_MESSAGE_ID = 'confirm-clear-all-message';

export const useClearData = (params: IUseClearDataParams): IUseClearData => {
  const { onClear } = params;
  const [isClearing, setIsClearing] = useState(INITIAL_FALSE);
  const modalContext = useModalContext();

  const handleConfirm = useCallback(async () => {
    try {
      setIsClearing(true);
      await onClear();
      modalContext.closeModal(CONFIRM_MODAL_ID);
    } finally {
      setIsClearing(false);
    }
  }, [onClear, modalContext]);

  const clearData = useCallback(() => {
    const modalContent = (
      <ConfirmModal
        title={CONFIRM_CLEAR_TITLE}
        message={CONFIRM_CLEAR_MESSAGE}
        confirmText={CONFIRM_CLEAR_BUTTON}
        cancelText={CANCEL_CLEAR_BUTTON}
        onConfirm={handleConfirm}
      />
    );

    modalContext.openModal(
      CONFIRM_MODAL_ID,
      modalContent,
      CONFIRM_MODAL_TITLE_ID,
      CONFIRM_MODAL_MESSAGE_ID,
      CONFIRM_CLEAR_TITLE
    );
  }, [handleConfirm, modalContext]);

  return {
    isClearing,
    clearData,
  };
};
