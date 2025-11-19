import { type FC } from 'react';
import { ModalProvider } from '@shared/lib';
import { useApp } from '../../lib';
import { AppContent } from '../app-content';
import '@shared/assets/styles/index.less';

export const App: FC = () => {
  const { handleModalOpen } = useApp();

  return (
    <ModalProvider onModalOpen={handleModalOpen}>
      <AppContent />
    </ModalProvider>
  );
};
