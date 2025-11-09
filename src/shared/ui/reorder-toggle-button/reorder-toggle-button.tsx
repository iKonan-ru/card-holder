import { type FC } from 'react';
import { MdDragIndicator, MdOutlineDone } from 'react-icons/md';
import { FabButton } from '../fab-button';
import type { IReorderToggleButtonProps } from './model';

const REORDER_BUTTON_ARIA_LABEL_INACTIVE = 'Включить режим сортировки';
const REORDER_BUTTON_ARIA_LABEL_ACTIVE = 'Выключить режим сортировки';

export const ReorderToggleButton: FC<IReorderToggleButtonProps> = ({
  isActive,
  onClick,
}) => {
  const icon = isActive ? MdOutlineDone : MdDragIndicator;
  const ariaLabel = isActive
    ? REORDER_BUTTON_ARIA_LABEL_ACTIVE
    : REORDER_BUTTON_ARIA_LABEL_INACTIVE;

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
