import { createContext, useContext } from 'react';

export const ModalCloseContext = createContext<(() => void) | null>(null);

export const useModalClose = (): (() => void) => {
  const context = useContext(ModalCloseContext);

  if (!context) {
    return () => {};
  }

  return context;
};
