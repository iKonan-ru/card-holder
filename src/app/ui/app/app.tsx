import { type FC } from 'react';
import { useApp } from '@app/hooks';
import { AppContent } from '@app/ui';
import { ModalProvider } from '@shared/lib';
import '@shared/assets/styles/index.less';

export const App: FC = () => {
  const { handleModalOpen } = useApp();

  return (
    <ModalProvider onModalOpen={handleModalOpen}>
      <AppContent />
    </ModalProvider>
  );
};
