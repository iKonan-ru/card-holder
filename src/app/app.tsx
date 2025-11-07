import { useEffect, type FC } from 'react';
import { MainPage } from '@pages/main-page';
import { ModalProvider } from '@shared/lib';
import { ModalContainer } from '@shared/ui';
import {
  initGlobalErrorHandler,
  ErrorHandlerProvider,
} from '@features/error-handling';
import '@shared/assets/styles/index.less';

export const App: FC = () => {
  useEffect(() => {
    initGlobalErrorHandler();
  }, []);

  return (
    <ModalProvider>
      <ErrorHandlerProvider>
        <MainPage />
        <ModalContainer />
      </ErrorHandlerProvider>
    </ModalProvider>
  );
};
