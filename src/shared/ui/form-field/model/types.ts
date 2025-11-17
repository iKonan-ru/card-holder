import type { IBaseInputFieldProps, IInputChangeHandler } from '@shared/types';

export interface IFormFieldProps
  extends IBaseInputFieldProps,
    IInputChangeHandler {
  id: string;
  type?: 'text' | 'password';
  autoFocus?: boolean;
}
