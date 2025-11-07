import { useContext } from 'react';
import { ModalContext } from './context';
import type { IModalContextValue } from './types';

export const useModalContext = (): IModalContextValue => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error('useModalContext must be used within ModalProvider');
  }

  return context;
};
