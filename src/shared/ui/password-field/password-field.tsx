import { useMemo, type FC } from 'react';
import { ParentClassProvider, usePasswordVisibility } from '@shared/lib';
import type { TPropsWithParentClass } from '@shared/types';
import {
  FormField,
  PasswordToggleButton,
  type IFormFieldProps,
} from '@shared/ui';

interface IPasswordFieldProps
  extends
    Omit<IFormFieldProps, 'type' | 'rightContent'>,
    TPropsWithParentClass {
  showPasswordToggle?: boolean;
  isPasswordVisible?: boolean;
  onPasswordVisibilityChange?: (isVisible: boolean) => void;
}

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
