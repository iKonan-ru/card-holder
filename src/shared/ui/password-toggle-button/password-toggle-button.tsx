import { bem, useClassName } from '@shared/lib';
import { type FC } from 'react';
import type { IPasswordToggleButtonProps } from './model';
import { PASSWORD_TOGGLE_BUTTON_BLOCK } from './lib';
import './password-toggle-button.less';

export const PasswordToggleButton: FC<IPasswordToggleButtonProps> = ({
  ariaLabel,
  Icon,
  onToggle,
}) => {
  const className = useClassName({
    blockName: PASSWORD_TOGGLE_BUTTON_BLOCK,
  });

  return (
    <button
      type="button"
      onClick={onToggle}
      className={className}
      aria-label={ariaLabel}
      tabIndex={-1}
    >
      <Icon className={bem(PASSWORD_TOGGLE_BUTTON_BLOCK, 'icon')} />
    </button>
  );
};
