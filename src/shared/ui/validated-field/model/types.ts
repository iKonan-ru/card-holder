import type { ReactNode } from 'react';

export type TFieldFormatter = (value: string) => string;
export type TFieldValidator = (value: string) => string | undefined;

export interface IValidatedFieldProps {
  name: string;
  label: string;
  value: string;
  error?: string;
  maxLength?: number;
  parentClass?: string;
  disabled?: boolean;
  required?: boolean;
  rightContent?: ReactNode;
  inputMode?: 'text' | 'numeric' | 'decimal' | 'tel' | 'email' | 'url';
  formatter?: TFieldFormatter;
  validator?: TFieldValidator;
  instantValidateLength?: number;
  onChange: (name: string, value: string) => void;
  onValidate?: (name: string, error: string | undefined) => void;
}
