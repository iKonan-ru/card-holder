import type { PropsWithParentClass } from '@shared/types';

export interface ICopyableFieldProps extends PropsWithParentClass {
  value: string;
  title?: string;
  label?: string;
  modifier?: string;
  maskFn?: (value: string, showValue?: boolean) => string;
}
