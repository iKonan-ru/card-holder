import type { ReactNode } from 'react';

export interface IModalProps {
  children: ReactNode;
  onClose: () => void;
  isTopModal: boolean;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
}
