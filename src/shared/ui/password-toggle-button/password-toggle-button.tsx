import { type ComponentType, type FC } from 'react';
import { bem, useClassName } from '@shared/lib';
import type { Procedure } from '@shared/types';
import { PASSWORD_TOGGLE_BUTTON_BLOCK } from './lib';
import './password-toggle-button.less';

interface IPasswordToggleButtonProps {
  ariaLabel: string;
  Icon: ComponentType<{ className?: string }>;
  onToggle: Procedure;
}

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
