import { type FC, type MouseEvent } from 'react';
import { FiEdit } from 'react-icons/fi';
import {
  ARIA_HIDDEN_TRUE,
  ARIA_ROLE_OPTION,
  bem,
  BUTTON_TYPE_BUTTON,
} from '@shared/lib';
import {
  SELECT_BLOCK,
  SELECT_EDIT_OPTION_ARIA_LABEL,
  SELECT_OPTION_MODIFIER_ACTIVE,
  SELECT_OPTION_MODIFIER_SELECTED,
} from '../constants';
import type { ISelectOption } from '../types';

interface ISelectOptionProps {
  option: ISelectOption;
  isSelected: boolean;
  isActive: boolean;
  onSelect: (value: string) => void;
  onEdit?: (value: string) => void;
}

export const SelectOption: FC<ISelectOptionProps> = ({
  option,
  isSelected,
  isActive,
  onSelect,
  onEdit,
}) => {
  const modifiers = [
    isSelected && SELECT_OPTION_MODIFIER_SELECTED,
    isActive && SELECT_OPTION_MODIFIER_ACTIVE,
  ].filter(Boolean) as string[];
  const optionClassName = bem(bem(SELECT_BLOCK, 'option'), modifiers);

  const handleClick = () => {
    onSelect(option.value);
  };

  const handleEditClick = (event: MouseEvent) => {
    event.stopPropagation();
    onEdit?.(option.value);
  };

  return (
    <li
      role={ARIA_ROLE_OPTION}
      aria-selected={isSelected}
      className={optionClassName}
      onClick={handleClick}
    >
      <span className={bem(SELECT_BLOCK, 'option-label')}>{option.label}</span>
      {onEdit && (
        <button
          type={BUTTON_TYPE_BUTTON}
          className={bem(SELECT_BLOCK, 'option-edit')}
          onClick={handleEditClick}
          aria-label={`${SELECT_EDIT_OPTION_ARIA_LABEL} ${option.label}`}
        >
          <FiEdit aria-hidden={ARIA_HIDDEN_TRUE} />
        </button>
      )}
    </li>
  );
};
