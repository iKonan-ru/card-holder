import type { ReactNode } from 'react';

export interface IUseModalReturn {
  open: (
    content: ReactNode,
    onClose?: () => void,
    ariaLabelledBy?: string,
    ariaDescribedBy?: string
  ) => void;
  close: () => void;
  modalId: string;
}
