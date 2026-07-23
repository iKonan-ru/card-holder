import { useCallback, type FC, type ReactElement } from 'react';
import type { TSortDirection } from '@features/card-management';
import { bem, buildModifiers, useClassName } from '@shared/lib';
import { SORT_DIRECTION_OPTIONS } from '../../constants';
import { SORT_DIRECTION_TOGGLE_BLOCK } from './constants';
import './sort-direction-toggle.less';

interface ISortDirectionToggleProps {
  value: TSortDirection;
  disabled?: boolean;
  onChange: (direction: TSortDirection) => void;
}

export const SortDirectionToggle: FC<ISortDirectionToggleProps> = ({
  value,
  disabled,
  onChange,
}) => {
  const modifiers = buildModifiers(disabled && 'disabled');
  const className = useClassName({
    blockName: SORT_DIRECTION_TOGGLE_BLOCK,
    modifiers,
  });

  const renderOption = useCallback(
    (option: (typeof SORT_DIRECTION_OPTIONS)[number]): ReactElement => {
      const isSelected = option.value === value;
      const baseOptionClassName = bem(SORT_DIRECTION_TOGGLE_BLOCK, 'option');
      const optionModifiers = isSelected ? ['selected'] : undefined;
      const optionClassName = bem(baseOptionClassName, optionModifiers);

      const handleClick = () => {
        onChange(option.value);
      };

      return (
        <button
          key={option.value}
          type="button"
          className={optionClassName}
          onClick={handleClick}
          disabled={disabled}
          aria-pressed={isSelected}
        >
          {option.label}
        </button>
      );
    },
    [value, disabled, onChange],
  );

  return (
    <div className={className}>{SORT_DIRECTION_OPTIONS.map(renderOption)}</div>
  );
};
