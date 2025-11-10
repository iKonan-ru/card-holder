import {
  useState,
  useRef,
  useMemo,
  useCallback,
  type FC,
  type KeyboardEvent,
  type MouseEvent,
} from 'react';
import { FiCheck } from 'react-icons/fi';
import { bem, logError, ERROR_FAILED_TO_COPY, useClassName } from '@shared/lib';
import type { ICopyableFieldProps } from './model';
import {
  COPY_INDICATOR_DURATION,
  COPYABLE_FIELD_BLOCK,
  COPY_TITLE_TEXT,
} from './lib';
import './copyable-field.less';

export const CopyableField: FC<ICopyableFieldProps> = ({
  value,
  label,
  title = COPY_TITLE_TEXT,
  maskFn,
  modifier,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const handleCopy = useCallback(async () => {
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
  }, [value]);

  const handleClick = useCallback(
    (event: MouseEvent) => {
      event.stopPropagation();
      handleCopy();
    },
    [handleCopy]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const isActivationKey = event.key === 'Enter' || event.key === ' ';

      if (isActivationKey) {
        event.preventDefault();
        handleCopy();
      }
    },
    [handleCopy]
  );

  const modifiers = useMemo(() => (modifier ? [modifier] : []), [modifier]);

  const wrapperClassName = useClassName({
    blockName: COPYABLE_FIELD_BLOCK,
    modifiers,
  });

  const ariaLabel = useMemo(
    () =>
      label
        ? `${title}: ${label}`
        : `${title}: ${maskFn ? maskFn(value, false) : value}`,
    [label, title, value, maskFn]
  );

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
