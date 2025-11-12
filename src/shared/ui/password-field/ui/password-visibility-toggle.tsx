import { type FC } from 'react';
import type { IconType } from 'react-icons';
import { bem } from '@shared/lib';
import { PASSWORD_FIELD_BLOCK } from '../lib';

interface IPasswordVisibilityToggleProps {
  onClick: () => void;
  ariaLabel: string;
  Icon: IconType;
}

export const PasswordVisibilityToggle: FC<IPasswordVisibilityToggleProps> = ({
  onClick,
  ariaLabel,
  Icon,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={bem(PASSWORD_FIELD_BLOCK, 'toggle-button')}
      aria-label={ariaLabel}
      tabIndex={-1}
    >
      <Icon className={bem(PASSWORD_FIELD_BLOCK, 'toggle-icon')} />
    </button>
  );
};
