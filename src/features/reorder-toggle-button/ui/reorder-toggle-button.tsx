import { useMemo, type FC } from 'react';
import { FiCheck, FiMove } from 'react-icons/fi';
import type { Procedure } from '@shared/types';
import { FabButton } from '@shared/ui';
import {
  REORDER_BUTTON_ARIA_LABEL_ACTIVE,
  REORDER_BUTTON_ARIA_LABEL_INACTIVE,
} from '../constants';

interface IReorderToggleButtonProps {
  isActive: boolean;
  onClick: Procedure;
}

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
    [isActive],
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
