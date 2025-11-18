import type { PropsWithChildren } from 'react';

export interface ISortableCardItemProps extends PropsWithChildren {
  id: string;
  isReorderMode: boolean;
}
