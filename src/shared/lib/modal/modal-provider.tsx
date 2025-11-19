import {
  useState,
  useCallback,
  useRef,
  useMemo,
  type FC,
  type PropsWithChildren,
  type ReactNode,
} from 'react';
import { ModalContext } from './modal-context';
import type { IModalContextValue, IModalItem } from './types';

interface IModalProviderProps extends PropsWithChildren {
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
      ariaLabelledBy?: string,
      ariaDescribedBy?: string,
      title?: string
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
          { id, content, title, ariaLabelledBy, ariaDescribedBy },
        ];
      });
    },
    [onModalOpen]
  );

  const closeModal = useCallback((id: string) => {
    setModals((prevModals) => prevModals.filter((m) => m.id !== id));
  }, []);

  const closeAllModals = useCallback(() => {
    setModals([]);
  }, []);

  const updateModalPreventClose = useCallback(
    (id: string, preventClose: boolean) => {
      setModals((prevModals) => {
        return prevModals.map((modal) => {
          if (modal.id === id) {
            return { ...modal, preventClose };
          }

          return modal;
        });
      });
    },
    []
  );

  const value: IModalContextValue = useMemo(
    () => ({
      modals,
      openModal,
      closeModal,
      closeAllModals,
      updateModalPreventClose,
      userActionRef,
    }),
    [modals, openModal, closeModal, closeAllModals, updateModalPreventClose]
  );

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};
