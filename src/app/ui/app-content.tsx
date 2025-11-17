import { type FC } from 'react';
import { MainPage } from '@pages/main-page';
import { ModalContainer } from '@shared/ui';
import { ErrorHandlerProvider } from '@features/error-handling';
import { useAppUpdateModal } from '../lib';

export const AppContent: FC = () => {
  useAppUpdateModal();

  return (
    <ErrorHandlerProvider>
      <MainPage />
      <ModalContainer />
    </ErrorHandlerProvider>
  );
};
