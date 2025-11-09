import type { IconType } from 'react-icons';
import type { PropsWithParentClass } from '@shared/types';

export interface IFabButtonProps extends PropsWithParentClass {
  icon: IconType;
  ariaLabel: string;
  onClick: () => void;
  disabled?: boolean;
  isActive?: boolean;
  ariaPressed?: boolean;
}
