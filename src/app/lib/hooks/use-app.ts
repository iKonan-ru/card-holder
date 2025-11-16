import { useEffect, useCallback } from 'react';
import { setErrorModalHandler } from '@shared/lib';
import { initGlobalErrorHandler, showError } from '@features/error-handling';
import { useCardManagementStore } from '@features/card-management';

export const useApp = () => {
  const setReorderMode = useCardManagementStore(
    (state) => state.setReorderMode
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
