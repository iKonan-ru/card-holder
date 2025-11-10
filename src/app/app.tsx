import { useEffect, useCallback, type FC } from 'react';
import { MainPage } from '@pages/main-page';
import { ModalProvider, usePWAUpdate, setErrorModalHandler } from '@shared/lib';
import { ModalContainer } from '@shared/ui';
import {
  initGlobalErrorHandler,
  ErrorHandlerProvider,
  showError,
} from '@features/error-handling';
import { useCardManagementStore } from '@features/card-management';
import '@shared/assets/styles/index.less';

export const App: FC = () => {
  usePWAUpdate();
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

  return (
    <ModalProvider onModalOpen={handleModalOpen}>
      <ErrorHandlerProvider>
        <MainPage />
        <ModalContainer />
      </ErrorHandlerProvider>
    </ModalProvider>
  );
};
