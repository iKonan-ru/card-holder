import { createContext, useContext } from 'react';
import type { Procedure } from '@shared/types';

export const ModalCloseContext = createContext<Procedure | null>(null);

export const useModalClose = (): Procedure => {
  const context = useContext(ModalCloseContext);

  if (!context) {
    return () => {};
  }

  return context;
};
