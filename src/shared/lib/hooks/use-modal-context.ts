import { useContext } from 'react';
import { ModalContext, type IModalContextValue } from '../modal';

export const useModalContext = (): IModalContextValue => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error('useModalContext must be used within ModalProvider');
  }

  return context;
};
