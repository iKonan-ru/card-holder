import type { ReactNode, MutableRefObject } from 'react';

export interface IModalItem {
  id: string;
  content: ReactNode;
  onClose: () => void;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
}

export interface IModalContextValue {
  modals: IModalItem[];
  openModal: (
    id: string,
    content: ReactNode,
    onClose: () => void,
    ariaLabelledBy?: string,
    ariaDescribedBy?: string
  ) => void;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
  userActionRef: MutableRefObject<boolean>;
}
