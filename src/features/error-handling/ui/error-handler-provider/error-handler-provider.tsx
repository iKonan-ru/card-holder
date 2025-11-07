import { useEffect, type FC, type ReactNode } from 'react';
import { useModalContext } from '@shared/lib';
import { setModalContext } from '../../lib/show-error';

interface IErrorHandlerProviderProps {
  children: ReactNode;
}

export const ErrorHandlerProvider: FC<IErrorHandlerProviderProps> = ({
  children,
}) => {
  const modalContext = useModalContext();

  useEffect(() => {
    setModalContext(modalContext);
  }, [modalContext]);

  return <>{children}</>;
};
