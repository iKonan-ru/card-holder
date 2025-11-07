import type { ChangeEvent, ReactNode } from 'react';
import type { PropsWithParentClass } from '@shared/types';

export interface IFormFieldProps extends PropsWithParentClass {
  id: string;
  name: string;
  label: string;
  value: string;
  error?: string;
  maxLength?: number;
  disabled?: boolean;
  required?: boolean;
  rightContent?: ReactNode;
  inputMode?: 'text' | 'numeric' | 'decimal' | 'tel' | 'email' | 'url';
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}
