import type { ReactNode } from 'react';

export interface IModalProps {
  children: ReactNode;
  onClose: () => void;
  onRegisterClose?: (closeWithAnimation: () => void) => void;
  isTopModal: boolean;
  preventClose?: boolean;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
}
