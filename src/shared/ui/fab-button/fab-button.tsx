import { useMemo, type FC } from 'react';
import type { IconType } from 'react-icons';
import { bem, buildModifiers, useClassName } from '@shared/lib';
import type { Procedure } from '@shared/types';
import { FAB_BUTTON_BLOCK } from './constants';
import './fab-button.less';

interface IFabButtonProps {
  icon: IconType;
  ariaLabel: string;
  onClick: Procedure;
  disabled?: boolean;
  isActive?: boolean;
  hasIndicator?: boolean;
}

export const FabButton: FC<IFabButtonProps> = ({
  icon: IconComponent,
  ariaLabel,
  onClick,
  disabled,
  isActive,
  hasIndicator,
}) => {
  const modifiers = useMemo(
    () => buildModifiers(isActive && 'active', disabled && 'disabled'),
    [isActive, disabled],
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
      aria-pressed={isActive}
    >
      <IconComponent
        className={bem(FAB_BUTTON_BLOCK, 'icon')}
        aria-hidden="true"
      />
      {hasIndicator && (
        <span
          className={bem(FAB_BUTTON_BLOCK, 'indicator')}
          aria-hidden="true"
        />
      )}
    </button>
  );
};
