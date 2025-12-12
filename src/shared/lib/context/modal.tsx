/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type FC,
  type PropsWithChildren,
  type ReactNode,
  type RefObject,
} from 'react';
import type { Procedure } from '@shared/types';

export interface IModalItem {
  id: string;
  content: ReactNode;
  title?: string;
  preventClose?: boolean;
}

export interface IModalContext {
  modals: IModalItem[];
  openModal: (id: string, content: ReactNode, title?: string) => void;
  closeModal: (id: string) => void;
  closeAllModals: Procedure;
  updateModalPreventClose: (id: string, preventClose: boolean) => void;
  userActionRef: RefObject<boolean>;
}

const Modal = createContext<IModalContext | null>(null);

interface IModalProviderProps extends PropsWithChildren {
  onModalOpen?: Procedure;
}

export const ModalProvider: FC<IModalProviderProps> = ({
  children,
  onModalOpen,
}) => {
  const [modals, setModals] = useState<IModalItem[]>([]);
  const userActionRef = useRef(false);

  const openModal = useCallback(
    (id: string, content: ReactNode, title?: string) => {
      if (onModalOpen) {
        onModalOpen();
      }

      setModals((prevModals) => {
        const existingModalIndex = prevModals.findIndex(
          (modal) => modal.id === id,
        );

        if (existingModalIndex !== -1) {
          return prevModals;
        }

        return [...prevModals, { id, content, title }];
      });
    },
    [onModalOpen],
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
    [],
  );

  const value: IModalContext = useMemo(
    () => ({
      modals,
      openModal,
      closeModal,
      closeAllModals,
      updateModalPreventClose,
      userActionRef,
    }),
    [modals, openModal, closeModal, closeAllModals, updateModalPreventClose],
  );

  return <Modal.Provider value={value}>{children}</Modal.Provider>;
};

export const useModalContext = (): IModalContext => {
  const context = useContext(Modal);

  if (!context) {
    throw new Error('useModalContext must be used within ModalProvider');
  }

  return context;
};
