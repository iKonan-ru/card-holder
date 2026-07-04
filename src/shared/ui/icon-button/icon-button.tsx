import { useMemo, type FC } from 'react';
import type { IconType } from 'react-icons';
import { ARIA_HIDDEN_TRUE, bem, useClassName } from '@shared/lib';
import type { Procedure } from '@shared/types';
import { ICON_BUTTON_BLOCK } from './constants';
import './icon-button.less';

interface IIconButtonProps {
  icon: IconType;
  label?: string;
  badge?: number;
  isActive?: boolean;
  disabled?: boolean;
  title?: string;
  onClick: Procedure;
  ariaPressed?: boolean;
}

export const IconButton: FC<IIconButtonProps> = ({
  icon: IconComponent,
  label,
  badge,
  isActive,
  disabled,
  title,
  onClick,
  ariaPressed,
}) => {
  const modifiers = useMemo(
    () =>
      [isActive && 'active', disabled && 'disabled'].filter(
        Boolean,
      ) as string[],
    [isActive, disabled],
  );

  const className = useClassName({
    blockName: ICON_BUTTON_BLOCK,
    modifiers,
  });

  const hasBadge = badge !== undefined && badge > 0;
  const accessibleLabel = label ? undefined : title;

  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={accessibleLabel}
      aria-pressed={ariaPressed}
    >
      <IconComponent
        className={bem(ICON_BUTTON_BLOCK, 'icon')}
        aria-hidden={ARIA_HIDDEN_TRUE}
      />
      {label && (
        <span className={bem(ICON_BUTTON_BLOCK, 'label')}>{label}</span>
      )}
      {hasBadge && (
        <span className={bem(ICON_BUTTON_BLOCK, 'badge')}>{badge}</span>
      )}
    </button>
  );
};
