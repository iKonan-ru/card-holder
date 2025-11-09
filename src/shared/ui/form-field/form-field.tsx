import type { FC } from 'react';
import { bem, createClassName } from '@shared/lib';
import type { IFormFieldProps } from './model';
import { FORM_FIELD_BLOCK } from './lib/constants';
import './form-field.less';

export const FormField: FC<IFormFieldProps> = ({
  id,
  name,
  label,
  value,
  error,
  type = 'text',
  maxLength,
  disabled,
  required,
  rightContent,
  inputMode,
  autoComplete,
  autoFocus,
  onChange,
  parentClass,
}) => {
  const hasValue = Boolean(value);
  const hasError = Boolean(error);
  const hasRightContent = Boolean(rightContent);

  const modifiers: string[] = [];

  if (hasValue) {
    modifiers.push('has-value');
  }

  if (hasError) {
    modifiers.push('has-error');
  }

  if (hasRightContent) {
    modifiers.push('has-right-content');
  }

  const className = createClassName({
    blockName: FORM_FIELD_BLOCK,
    modifiers,
    parentClass,
  });

  const errorId = `${id}-error`;
  const ariaDescribedBy = hasError ? errorId : undefined;

  return (
    <div className={className}>
      <div className={bem(FORM_FIELD_BLOCK, 'container')}>
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          placeholder={label}
          disabled={disabled}
          className={bem(FORM_FIELD_BLOCK, 'input')}
          inputMode={inputMode}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          aria-invalid={hasError}
          aria-required={required}
          aria-describedby={ariaDescribedBy}
        />
        <label
          htmlFor={id}
          className={bem(FORM_FIELD_BLOCK, 'label')}
          id={hasError ? errorId : undefined}
        >
          {error || label}
          {required && !error && ' *'}
        </label>
        {rightContent && (
          <div className={bem(FORM_FIELD_BLOCK, 'right-content')}>
            {rightContent}
          </div>
        )}
      </div>
    </div>
  );
};
