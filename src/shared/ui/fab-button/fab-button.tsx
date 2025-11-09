import { type FC, useMemo } from 'react';
import { bem, useClassName } from '@shared/lib';
import type { IFabButtonProps } from './model';
import { FAB_BUTTON_BLOCK } from './lib';
import './fab-button.less';

export const FabButton: FC<IFabButtonProps> = ({
  icon: IconComponent,
  ariaLabel,
  onClick,
  disabled,
  isActive,
  ariaPressed,
}) => {
  const modifiers = useMemo(
    () =>
      [isActive && 'active', disabled && 'disabled'].filter(
        Boolean
      ) as string[],
    [isActive, disabled]
  );

  const className = useClassName({
    blockName: FAB_BUTTON_BLOCK,
    modifiers,
  });

  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      disabled={disabled}
      title={ariaLabel}
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
    >
      <IconComponent
        className={bem(FAB_BUTTON_BLOCK, 'icon')}
        aria-hidden="true"
      />
    </button>
  );
};
