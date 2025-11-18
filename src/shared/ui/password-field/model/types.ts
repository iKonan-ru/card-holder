import type { IFormFieldProps } from '../../form-field';
import type { PropsWithParentClass } from '@shared/types';

export interface IPasswordFieldProps
  extends Omit<IFormFieldProps, 'type' | 'rightContent'>,
    PropsWithParentClass {
  showPasswordToggle?: boolean;
  isPasswordVisible?: boolean;
  onPasswordVisibilityChange?: (isVisible: boolean) => void;
}
