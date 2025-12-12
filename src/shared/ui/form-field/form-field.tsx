import { useMemo, type FC } from 'react';
import { bem, ParentClassProvider, useClassName } from '@shared/lib';
import type { IBaseInputFieldProps, IInputChangeHandler } from '@shared/types';
import { FORM_FIELD_BLOCK } from './constants';
import './form-field.less';

export interface IFormFieldProps
  extends IBaseInputFieldProps,
    IInputChangeHandler {
  id: string;
  type?: 'text' | 'password';
  autoFocus?: boolean;
}

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
}) => {
  const hasValue = Boolean(value);
  const hasError = Boolean(error);
  const hasRightContent = Boolean(rightContent);

  const modifiers = useMemo(
    () =>
      [
        hasValue && 'has-value',
        hasError && 'has-error',
        hasRightContent && 'has-right-content',
      ].filter(Boolean) as string[],
    [hasValue, hasError, hasRightContent],
  );

  const className = useClassName({
    blockName: FORM_FIELD_BLOCK,
    modifiers,
  });

  const errorId = useMemo(() => `${id}-error`, [id]);
  const ariaDescribedBy = useMemo(
    () => (hasError ? errorId : undefined),
    [hasError, errorId],
  );

  return (
    <div className={className}>
      <ParentClassProvider parentClass={FORM_FIELD_BLOCK}>
        <div className={bem(FORM_FIELD_BLOCK, 'wrapper')}>
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
          </div>
          {rightContent && (
            <div className={bem(FORM_FIELD_BLOCK, 'right-content')}>
              {rightContent}
            </div>
          )}
        </div>
      </ParentClassProvider>
    </div>
  );
};
