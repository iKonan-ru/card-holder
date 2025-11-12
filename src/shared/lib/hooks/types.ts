import type { ReactNode } from 'react';

export interface IUseModalReturn {
  open: (
    content: ReactNode,
    ariaLabelledBy?: string,
    ariaDescribedBy?: string
  ) => void;
  close: () => void;
  updatePreventClose: (preventClose: boolean) => void;
  modalId: string;
}
