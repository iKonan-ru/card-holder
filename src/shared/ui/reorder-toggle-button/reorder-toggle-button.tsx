import { type FC, useMemo } from 'react';
import { FiMove, FiCheck } from 'react-icons/fi';
import { FabButton } from '@shared/ui';
import type { IReorderToggleButtonProps } from './model';
import {
  REORDER_BUTTON_ARIA_LABEL_ACTIVE,
  REORDER_BUTTON_ARIA_LABEL_INACTIVE,
} from './lib';

export const ReorderToggleButton: FC<IReorderToggleButtonProps> = ({
  isActive,
  onClick,
}) => {
  const icon = useMemo(() => (isActive ? FiCheck : FiMove), [isActive]);
  const ariaLabel = useMemo(
    () =>
      isActive
        ? REORDER_BUTTON_ARIA_LABEL_ACTIVE
        : REORDER_BUTTON_ARIA_LABEL_INACTIVE,
    [isActive]
  );

  return (
    <FabButton
      icon={icon}
      ariaLabel={ariaLabel}
      onClick={onClick}
      isActive={isActive}
      ariaPressed={isActive}
    />
  );
};
