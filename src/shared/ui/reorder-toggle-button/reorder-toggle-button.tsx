import { type FC } from 'react';
import { bem, createClassName } from '@shared/lib';
import { MdDragIndicator, MdOutlineDone } from 'react-icons/md';
import { REORDER_TOGGLE_BUTTON_BLOCK } from './lib';
import type { IReorderToggleButtonProps } from './model';
import './reorder-toggle-button.less';

export const ReorderToggleButton: FC<IReorderToggleButtonProps> = ({
  isActive,
  onClick,
  parentClass,
}) => {
  const modifiers = [];

  if (isActive) {
    modifiers.push('active');
  }

  const className = createClassName({
    blockName: REORDER_TOGGLE_BUTTON_BLOCK,
    modifiers,
    parentClass,
  });

  const IconComponent = isActive ? MdOutlineDone : MdDragIndicator;

  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      aria-pressed={isActive}
    >
      <IconComponent
        className={bem(REORDER_TOGGLE_BUTTON_BLOCK, 'icon')}
        aria-hidden="true"
      />
    </button>
  );
};
