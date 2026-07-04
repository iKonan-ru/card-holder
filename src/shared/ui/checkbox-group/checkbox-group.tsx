import { useCallback, type FC, type ReactElement } from 'react';
import { bem, useClassName } from '@shared/lib';
import { Checkbox } from '../checkbox';
import { CHECKBOX_GROUP_BLOCK } from './constants';
import './checkbox-group.less';

export interface ICheckboxGroupOption {
  value: string;
  label: string;
}

interface ICheckboxGroupProps {
  title?: string;
  options: ICheckboxGroupOption[];
  value: string[];
  onChange: (next: string[]) => void;
}

export const CheckboxGroup: FC<ICheckboxGroupProps> = ({
  title,
  options,
  value,
  onChange,
}) => {
  const className = useClassName({ blockName: CHECKBOX_GROUP_BLOCK });

  const renderOption = useCallback(
    (option: ICheckboxGroupOption): ReactElement => {
      const isChecked = value.includes(option.value);

      const handleChange = (checked: boolean) => {
        const next = checked
          ? [...value, option.value]
          : value.filter((item) => item !== option.value);

        onChange(next);
      };

      return (
        <Checkbox
          key={option.value}
          label={option.label}
          checked={isChecked}
          onChange={handleChange}
        />
      );
    },
    [value, onChange],
  );

  return (
    <div
      className={className}
      role="group"
      aria-label={title}
    >
      {title && (
        <span className={bem(CHECKBOX_GROUP_BLOCK, 'title')}>{title}</span>
      )}
      <div className={bem(CHECKBOX_GROUP_BLOCK, 'list')}>
        {options.map(renderOption)}
      </div>
    </div>
  );
};
