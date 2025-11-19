import { type FC, useMemo } from 'react';
import { FiMove, FiCheck } from 'react-icons/fi';
import { FabButton } from '@shared/ui';
import {
  REORDER_BUTTON_ARIA_LABEL_ACTIVE,
  REORDER_BUTTON_ARIA_LABEL_INACTIVE,
} from '../lib';

interface IReorderToggleButtonProps {
  isActive: boolean;
  onClick: () => void;
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
