import { useCallback, useEffect } from 'react';
import { useCardManagementStore } from '@features/card-management';
import { initGlobalErrorHandler, showError } from '@features/error-handling';
import { setErrorModalHandler } from '@shared/lib';
import type { Procedure } from '@shared/types';

interface IUseAppResult {
  handleModalOpen: Procedure;
}

export const useApp = (): IUseAppResult => {
  const setReorderMode = useCardManagementStore(
    (state) => state.setReorderMode,
  );

  useEffect(() => {
    initGlobalErrorHandler();
    setErrorModalHandler(showError);
  }, []);

  const handleModalOpen = useCallback(() => {
    setReorderMode(false);
  }, [setReorderMode]);

  return {
    handleModalOpen,
  };
};
