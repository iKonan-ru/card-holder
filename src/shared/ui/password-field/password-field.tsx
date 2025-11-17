import { bem } from '@shared/lib';
import { type FC, useMemo } from 'react';
import { FormField } from '@shared/ui';
import type { IPasswordFieldProps } from './model';
import { PASSWORD_FIELD_BLOCK, usePasswordVisibility } from './lib';
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
      <button
        type="button"
        onClick={toggleVisibility}
        className={bem(PASSWORD_FIELD_BLOCK, 'toggle-button')}
        aria-label={ariaLabel}
        tabIndex={-1}
      >
        <Icon className={bem(PASSWORD_FIELD_BLOCK, 'toggle-icon')} />
      </button>
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
