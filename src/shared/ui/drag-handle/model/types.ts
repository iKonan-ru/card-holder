import type { ButtonHTMLAttributes } from 'react';

export interface IDragHandleProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  isVisible: boolean;
}
