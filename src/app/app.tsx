import { type FC } from 'react';
import { MainPage } from '@pages/main-page';
import { ModalProvider } from '@shared/lib';
import { ModalContainer } from '@shared/ui';
import { ErrorHandlerProvider } from '@features/error-handling';
import { useApp } from './lib';
import '@shared/assets/styles/index.less';

export const App: FC = () => {
  const { handleModalOpen } = useApp();

  return (
    <ModalProvider onModalOpen={handleModalOpen}>
      <ErrorHandlerProvider>
        <MainPage />
        <ModalContainer />
      </ErrorHandlerProvider>
    </ModalProvider>
  );
};
