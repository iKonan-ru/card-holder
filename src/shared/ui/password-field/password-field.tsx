import { type FC, useMemo } from 'react';
import { ParentClassProvider, usePasswordVisibility } from '@shared/lib';
import { FormField, PasswordToggleButton } from '@shared/ui';
import type { IPasswordFieldProps } from './model';

export const PasswordField: FC<IPasswordFieldProps> = ({
  showPasswordToggle = true,
  isPasswordVisible,
  onPasswordVisibilityChange,
  parentClass,
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
      <PasswordToggleButton
        ariaLabel={ariaLabel}
        Icon={Icon}
        onToggle={toggleVisibility}
      />
    );
  }, [showPasswordToggle, toggleVisibility, ariaLabel, Icon]);

  return (
    <ParentClassProvider parentClass={parentClass}>
      <FormField
        {...formFieldProps}
        type={inputType}
        rightContent={rightContent}
      />
    </ParentClassProvider>
  );
};
