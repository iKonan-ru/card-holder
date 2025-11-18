import { useEffect, type FC, type PropsWithChildren } from 'react';
import { useModalContext } from '@shared/lib';
import { setModalContext } from '../../lib/show-error';

export const ErrorHandlerProvider: FC<PropsWithChildren> = ({ children }) => {
  const modalContext = useModalContext();

  useEffect(() => {
    setModalContext(modalContext);
  }, [modalContext]);

  return <>{children}</>;
};
