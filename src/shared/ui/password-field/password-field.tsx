import { type FC, useMemo } from 'react';
import { FormField } from '../form-field';
import type { IPasswordFieldProps } from './model';
import { usePasswordVisibility } from './lib/hooks/use-password-visibility';
import { PasswordVisibilityToggle } from './ui/password-visibility-toggle';
import './password-field.less';

export const PasswordField: FC<IPasswordFieldProps> = ({
  showPasswordToggle = true,
  isPasswordVisible,
  onPasswordVisibilityChange,
  ...formFieldProps
}) => {
  const isControlled =
    isPasswordVisible !== undefined && onPasswordVisibilityChange !== undefined;

  const { inputType, ariaLabel, Icon, toggleVisibility } =
    usePasswordVisibility({
      isControlled,
      externalIsVisible: isPasswordVisible,
      onExternalChange: onPasswordVisibilityChange,
    });

  const rightContent = useMemo(() => {
    if (!showPasswordToggle) {
      return undefined;
    }

    return (
      <PasswordVisibilityToggle
        onClick={toggleVisibility}
        ariaLabel={ariaLabel}
        Icon={Icon}
      />
    );
  }, [showPasswordToggle, toggleVisibility, ariaLabel, Icon]);

  return (
    <FormField
      {...formFieldProps}
      type={inputType}
      rightContent={rightContent}
    />
  );
};
