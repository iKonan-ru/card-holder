import { useCallback, useState } from 'react';
import { MasterPasswordConfirmModal } from '@features/app-lock';
import { useModalContext } from '@shared/lib';
import type { Procedure } from '@shared/types';
import {
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
  const { openModal } = useModalContext();

  const handleConfirm = useCallback(async () => {
    setIsClearing(true);

    try {
      await onClear();
    } finally {
      setIsClearing(false);
    }
  }, [onClear]);

  const clearData = useCallback(() => {
    openModal(
      CONFIRM_MODAL_ID,
      <MasterPasswordConfirmModal
        message={CONFIRM_CLEAR_MESSAGE}
        onConfirm={handleConfirm}
      />,
      CONFIRM_CLEAR_TITLE,
    );
  }, [handleConfirm, openModal]);

  return {
    isClearing,
    clearData,
  };
};
