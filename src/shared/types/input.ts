import type { ReactNode } from 'react';

export interface IBaseInputProps {
  name: string;
  value: string;
  maxLength?: number;
  disabled?: boolean;
  required?: boolean;
  inputMode?: 'text' | 'numeric' | 'decimal' | 'tel' | 'email' | 'url';
  autoComplete?: string;
}

export interface IBaseInputFieldProps extends IBaseInputProps {
  label: string;
  error?: string;
  leftContent?: ReactNode;
  rightContent?: ReactNode;
}

export interface IFormFieldChangeHandler {
  onChange: (name: string, value: string) => void;
}
