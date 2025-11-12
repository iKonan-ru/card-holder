import type { ReactNode, ButtonHTMLAttributes } from 'react';

export type TButtonVariant = 'primary' | 'secondary' | 'danger';

export interface IButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  children: ReactNode;
  variant?: TButtonVariant;
  isLoading?: boolean;
  fullWidth?: boolean;
}
