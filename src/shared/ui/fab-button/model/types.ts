import type { IconType } from 'react-icons';

export interface IFabButtonProps {
  icon: IconType;
  ariaLabel: string;
  onClick: () => void;
  disabled?: boolean;
  isActive?: boolean;
  ariaPressed?: boolean;
}
