import type { ReactNode, RefObject } from 'react';

export interface IModalItem {
  id: string;
  content: ReactNode;
  title?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  preventClose?: boolean;
}

export interface IModalContextValue {
  modals: IModalItem[];
  openModal: (
    id: string,
    content: ReactNode,
    ariaLabelledBy?: string,
    ariaDescribedBy?: string,
    title?: string
  ) => void;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
  updateModalPreventClose: (id: string, preventClose: boolean) => void;
  userActionRef: RefObject<boolean>;
}
