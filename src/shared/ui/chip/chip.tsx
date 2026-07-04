import type { FC } from 'react';
import { FiX } from 'react-icons/fi';
import { ARIA_HIDDEN_TRUE, bem, useClassName } from '@shared/lib';
import type { Procedure } from '@shared/types';
import { CHIP_BLOCK, CHIP_REMOVE_ARIA_LABEL_PREFIX } from './constants';
import './chip.less';

interface IChipProps {
  label: string;
  onRemove?: Procedure;
  ariaLabel?: string;
}

export const Chip: FC<IChipProps> = ({ label, onRemove, ariaLabel }) => {
  const className = useClassName({ blockName: CHIP_BLOCK });
  const removeAriaLabel =
    ariaLabel ?? `${CHIP_REMOVE_ARIA_LABEL_PREFIX} ${label}`;

  return (
    <span className={className}>
      <span className={bem(CHIP_BLOCK, 'label')}>{label}</span>
      {onRemove && (
        <button
          type="button"
          className={bem(CHIP_BLOCK, 'remove')}
          onClick={onRemove}
          aria-label={removeAriaLabel}
        >
          <FiX aria-hidden={ARIA_HIDDEN_TRUE} />
        </button>
      )}
    </span>
  );
};
