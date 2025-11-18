import type { PropsWithChildren, ButtonHTMLAttributes } from 'react';

export type TButtonVariant = 'primary' | 'secondary' | 'danger';

export interface IButtonProps
  extends PropsWithChildren<
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'>
  > {
  variant?: TButtonVariant;
  isLoading?: boolean;
  fullWidth?: boolean;
}
