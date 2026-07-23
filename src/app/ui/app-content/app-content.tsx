import { type FC } from 'react';
import { useAppUpdateModal } from '@app/hooks';
import { MainPage } from '@pages/main-page';
import {
  LockScreen,
  useCryptoStore,
  useInactivityLock,
} from '@features/app-lock';
import { ErrorHandlerProvider } from '@features/error-handling';
import { checkSecureProtocol } from '@shared/lib';
import { HttpWarningBanner, ModalContainer } from '@shared/ui';

const isSecure = checkSecureProtocol();

const AppInner: FC = () => {
  useAppUpdateModal();
  useInactivityLock();

  return (
    <ErrorHandlerProvider>
      <MainPage />
      <ModalContainer />
    </ErrorHandlerProvider>
  );
};

export const AppContent: FC = () => {
  const isUnlocked = useCryptoStore((state) => state.isUnlocked);
  const content = isUnlocked ? <AppInner /> : <LockScreen />;

  return (
    <>
      {!isSecure && <HttpWarningBanner />}
      {content}
    </>
  );
};
