import type { IFormFieldProps } from '../../form-field';

export interface IPasswordFieldProps
  extends Omit<IFormFieldProps, 'type' | 'rightContent'> {
  showPasswordToggle?: boolean;
  isPasswordVisible?: boolean;
  onPasswordVisibilityChange?: (isVisible: boolean) => void;
}
