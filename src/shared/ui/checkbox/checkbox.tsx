import { type ChangeEvent, type FC } from 'react';
import { ARIA_HIDDEN_TRUE, bem, useClassName } from '@shared/lib';
import { CHECKBOX_BLOCK } from './constants';
import './checkbox.less';

interface ICheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
}

export const Checkbox: FC<ICheckboxProps> = ({
  checked,
  onChange,
  label,
  disabled,
}) => {
  const className = useClassName({ blockName: CHECKBOX_BLOCK });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  return (
    <label className={className}>
      <input
        type="checkbox"
        className={bem(CHECKBOX_BLOCK, 'input')}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
      />
      <span
        className={bem(CHECKBOX_BLOCK, 'box')}
        aria-hidden={ARIA_HIDDEN_TRUE}
      />
      <span className={bem(CHECKBOX_BLOCK, 'label')}>{label}</span>
    </label>
  );
};
