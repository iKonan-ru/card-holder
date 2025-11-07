import type { PropsWithParentClass } from '@shared/types';

export interface IReorderToggleButtonProps extends PropsWithParentClass {
  isActive: boolean;
  onClick: () => void;
}
