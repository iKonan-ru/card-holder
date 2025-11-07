import { useState, useRef, type FC } from 'react';
import { FiCheck } from 'react-icons/fi';
import { bem, logError, ERROR_FAILED_TO_COPY } from '@shared/lib';
import type { ICopyableFieldProps } from './model';
import {
  COPY_INDICATOR_DURATION,
  COPYABLE_FIELD_BLOCK,
  COPY_TITLE_TEXT,
} from './lib';
import './copyable-field.less';

export const CopyableField: FC<ICopyableFieldProps> = ({
  value,
  parentClass,
  label,
  title = COPY_TITLE_TEXT,
  maskFn,
  modifier,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setIsCopied(true);

      timeoutRef.current = window.setTimeout(() => {
        setIsCopied(false);
      }, COPY_INDICATOR_DURATION);
    } catch (error) {
      logError({
        message: ERROR_FAILED_TO_COPY,
        error,
        context: 'CopyableField',
      });
    }
  };

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    handleCopy();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const isActivationKey = event.key === 'Enter' || event.key === ' ';

    if (isActivationKey) {
      event.preventDefault();
      handleCopy();
    }
  };

  const modifiers = modifier ? [modifier] : [];
  const blockClass = bem(COPYABLE_FIELD_BLOCK, modifiers);
  const elementClass = parentClass ? bem(parentClass, 'copyable-field') : '';
  const wrapperClassName = [blockClass, elementClass].filter(Boolean).join(' ');

  const ariaLabel = label
    ? `${title}: ${label}`
    : `${title}: ${maskFn ? maskFn(value, false) : value}`;

  return (
    <div className={wrapperClassName}>
      {label && (
        <div className={bem(COPYABLE_FIELD_BLOCK, 'label')}>{label}</div>
      )}

      <div
        role="button"
        tabIndex={0}
        className={bem(COPYABLE_FIELD_BLOCK, 'value')}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        title={title}
        aria-label={ariaLabel}
      >
        {maskFn ? maskFn(value, isCopied) : value}
        {isCopied && (
          <FiCheck
            className={bem(COPYABLE_FIELD_BLOCK, 'indicator')}
            aria-hidden="true"
          />
        )}
      </div>

      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={bem(COPYABLE_FIELD_BLOCK, 'sr-only')}
      >
        {isCopied ? 'Скопировано в буфер обмена' : ''}
      </div>
    </div>
  );
};
