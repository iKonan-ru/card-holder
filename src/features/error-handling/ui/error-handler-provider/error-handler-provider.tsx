import { useEffect, type FC, type PropsWithChildren } from 'react';
import { useModalContext } from '@shared/lib';
import { setModalContext } from '../../utils';

export const ErrorHandlerProvider: FC<PropsWithChildren> = ({ children }) => {
  const modalContext = useModalContext();

  useEffect(() => {
    setModalContext(modalContext);
  }, [modalContext]);

  return <>{children}</>;
};
