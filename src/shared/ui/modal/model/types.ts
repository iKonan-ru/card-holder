import type { PropsWithChildren } from 'react';

export interface IModalProps extends PropsWithChildren {
  onClose: () => void;
  onRegisterClose?: (closeWithAnimation: () => void) => void;
  isTopModal: boolean;
  preventClose?: boolean;
  title?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
}
