import type { IFormFieldProps } from '../../form-field';
import type { IFormFieldChangeHandler } from '@shared/types';
import type { PropsWithParentClass } from '@shared/types';

export type TFieldFormatter = (value: string) => string;
export type TFieldValidator = (value: string) => string | undefined;

export interface IValidatedFieldProps
  extends Omit<IFormFieldProps, 'id' | 'onChange' | 'type' | 'autoFocus'>,
    Partial<IFormFieldChangeHandler>,
    PropsWithParentClass {
  formatter?: TFieldFormatter;
  validator?: TFieldValidator;
  instantValidateLength?: number;
  onValidate?: (name: string, error: string | undefined) => void;
}
