import type { ReactNode } from 'react';
import type { PropsWithParentClass } from '@shared/types';

export interface IModalProps extends PropsWithParentClass {
  children: ReactNode;
  onClose: () => void;
  isTopModal: boolean;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
}
