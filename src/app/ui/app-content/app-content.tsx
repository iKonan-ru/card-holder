import { type FC } from 'react';
import { useAppUpdateModal } from '@app/lib';
import { MainPage } from '@pages/main-page';
import { ErrorHandlerProvider } from '@features/error-handling';
import { ModalContainer } from '@shared/ui';

export const AppContent: FC = () => {
  useAppUpdateModal();

  return (
    <ErrorHandlerProvider>
      <MainPage />
      <ModalContainer />
    </ErrorHandlerProvider>
  );
};
