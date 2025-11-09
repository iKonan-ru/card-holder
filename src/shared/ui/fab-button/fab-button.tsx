import { type FC } from 'react';
import { bem, createClassName } from '@shared/lib';
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
  parentClass,
}) => {
  const modifiers = [];

  if (isActive) {
    modifiers.push('active');
  }

  if (disabled) {
    modifiers.push('disabled');
  }

  const className = createClassName({
    blockName: FAB_BUTTON_BLOCK,
    modifiers,
    parentClass,
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
