import { useMemo, type FC } from 'react';
import { bem, useClassName } from '@shared/lib';
import type { Procedure } from '@shared/types';
import { Select, type ISelectOption } from '@shared/ui';
import { DIRECTORY_SELECT_FIELD_BLOCK } from './constants';
import './directory-select-field.less';

interface IDirectorySelectFieldProps {
  label: string;
  placeholder: string;
  addButtonLabel: string;
  value: string;
  options: ISelectOption[];
  onChange: (value: string) => void;
  onEditOption: (value: string) => void;
  onAddClick: Procedure;
  disabled?: boolean;
}

export const DirectorySelectField: FC<IDirectorySelectFieldProps> = ({
  label,
  placeholder,
  addButtonLabel,
  value,
  options,
  onChange,
  onEditOption,
  onAddClick,
  disabled,
}) => {
  const className = useClassName({ blockName: DIRECTORY_SELECT_FIELD_BLOCK });

  const footer = useMemo(
    () => (
      <button
        type="button"
        className={bem(DIRECTORY_SELECT_FIELD_BLOCK, 'add-button')}
        onClick={onAddClick}
      >
        {addButtonLabel}
      </button>
    ),
    [addButtonLabel, onAddClick],
  );

  return (
    <div className={className}>
      <span className={bem(DIRECTORY_SELECT_FIELD_BLOCK, 'label')}>
        {label}
      </span>
      <Select
        value={value || null}
        options={options}
        onChange={onChange}
        onEditOption={onEditOption}
        placeholder={placeholder}
        ariaLabel={label}
        disabled={disabled}
        footer={footer}
      />
    </div>
  );
};
