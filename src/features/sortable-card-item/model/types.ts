import type { ReactNode } from 'react';

export interface ISortableCardItemProps {
  id: string;
  isReorderMode: boolean;
  children: ReactNode;
}
