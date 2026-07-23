import { useMemo, type ChangeEvent, type FC } from 'react';
import {
  bem,
  buildModifiers,
  ParentClassProvider,
  useClassName,
} from '@shared/lib';
import type { IBaseInputFieldProps } from '@shared/types';
import { FORM_FIELD_BLOCK } from './constants';
import './form-field.less';

export interface IFormFieldProps extends IBaseInputFieldProps {
  id: string;
  type?: 'text' | 'password';
  autoFocus?: boolean;
  multiline?: boolean;
  onChange?: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
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
  leftContent,
  rightContent,
  inputMode,
  autoComplete,
  autoFocus,
  multiline,
  onChange,
}) => {
  const hasValue = Boolean(value);
  const hasError = Boolean(error);
  const hasLeftContent = Boolean(leftContent);
  const hasRightContent = Boolean(rightContent);

  const modifiers = useMemo<string[]>(
    () =>
      buildModifiers(
        hasValue && 'has-value',
        hasError && 'has-error',
        hasLeftContent && 'has-left-content',
        hasRightContent && 'has-right-content',
      ),
    [hasValue, hasError, hasLeftContent, hasRightContent],
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
  const showRequiredMark = required && !hasError;

  return (
    <div className={className}>
      <ParentClassProvider parentClass={FORM_FIELD_BLOCK}>
        <div className={bem(FORM_FIELD_BLOCK, 'wrapper')}>
          {leftContent && (
            <div className={bem(FORM_FIELD_BLOCK, 'left-content')}>
              {leftContent}
            </div>
          )}

          <div className={bem(FORM_FIELD_BLOCK, 'container')}>
            {multiline ? (
              <textarea
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                maxLength={maxLength}
                placeholder={label}
                disabled={disabled}
                className={bem(bem(FORM_FIELD_BLOCK, 'input'), ['textarea'])}
                autoComplete={autoComplete}
                autoFocus={autoFocus}
                aria-invalid={hasError}
                aria-required={required}
                aria-describedby={ariaDescribedBy}
              />
            ) : (
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
            )}
            <label
              htmlFor={id}
              className={bem(FORM_FIELD_BLOCK, 'label')}
              id={hasError ? errorId : undefined}
              aria-live={hasError ? 'polite' : undefined}
            >
              {error || label}
              {showRequiredMark && ' *'}
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
