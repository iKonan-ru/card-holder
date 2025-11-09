import { useState, useCallback, useRef, type FC, type ReactNode } from 'react';
import { ModalContext } from './context';
import type { IModalContextValue, IModalItem } from './types';

interface IModalProviderProps {
  children: ReactNode;
  onModalOpen?: () => void;
}

export const ModalProvider: FC<IModalProviderProps> = ({
  children,
  onModalOpen,
}) => {
  const [modals, setModals] = useState<IModalItem[]>([]);
  const userActionRef = useRef(false);

  const openModal = useCallback(
    (
      id: string,
      content: ReactNode,
      onClose: () => void,
      ariaLabelledBy?: string,
      ariaDescribedBy?: string
    ) => {
      if (onModalOpen) {
        onModalOpen();
      }

      setModals((prevModals) => {
        const existingModalIndex = prevModals.findIndex(
          (modal) => modal.id === id
        );

        if (existingModalIndex !== -1) {
          return prevModals;
        }

        return [
          ...prevModals,
          { id, content, onClose, ariaLabelledBy, ariaDescribedBy },
        ];
      });
    },
    [onModalOpen]
  );

  const closeModal = useCallback((id: string) => {
    setModals((prevModals) => {
      const modal = prevModals.find((m) => m.id === id);

      if (modal) {
        modal.onClose();
      }

      return prevModals.filter((m) => m.id !== id);
    });
  }, []);

  const closeAllModals = useCallback(() => {
    setModals((prevModals) => {
      prevModals.forEach((modal) => {
        modal.onClose();
      });

      return [];
    });
  }, []);

  const value: IModalContextValue = {
    modals,
    openModal,
    closeModal,
    closeAllModals,
    userActionRef,
  };

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};
