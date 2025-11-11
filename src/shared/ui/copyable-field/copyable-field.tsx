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
import {
  bem,
  logError,
  ERROR_FAILED_TO_COPY,
  useClassName,
  INITIAL_FALSE,
  INITIAL_NULL,
  KEY_ENTER,
  KEY_SPACE,
  ARIA_ROLE_BUTTON,
  ARIA_ROLE_STATUS,
  ARIA_LIVE_POLITE,
  ARIA_ATOMIC_TRUE,
  ARIA_HIDDEN_TRUE,
  ARIA_TABINDEX_INTERACTIVE,
} from '@shared/lib';
import type { ICopyableFieldProps } from './model';
import {
  COPY_INDICATOR_DURATION,
  COPYABLE_FIELD_BLOCK,
  COPY_TITLE_TEXT,
  COPYABLE_FIELD_CONTEXT,
  COPIED_ARIA_MESSAGE,
  EMPTY_ARIA_MESSAGE,
} from './lib';
import './copyable-field.less';

const INITIAL_IS_COPIED = INITIAL_FALSE;
const INITIAL_TIMEOUT_REF = INITIAL_NULL;

export const CopyableField: FC<ICopyableFieldProps> = ({
  value,
  label,
  title = COPY_TITLE_TEXT,
  maskFn,
  modifier,
}) => {
  const [isCopied, setIsCopied] = useState(INITIAL_IS_COPIED);
  const timeoutRef = useRef<number | null>(INITIAL_TIMEOUT_REF);

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
        context: COPYABLE_FIELD_CONTEXT,
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
      const isActivationKey =
        event.key === KEY_ENTER || event.key === KEY_SPACE;

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
        role={ARIA_ROLE_BUTTON}
        tabIndex={ARIA_TABINDEX_INTERACTIVE}
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
            aria-hidden={ARIA_HIDDEN_TRUE}
          />
        )}
      </div>

      <div
        role={ARIA_ROLE_STATUS}
        aria-live={ARIA_LIVE_POLITE}
        aria-atomic={ARIA_ATOMIC_TRUE}
        className={bem(COPYABLE_FIELD_BLOCK, 'sr-only')}
      >
        {isCopied ? COPIED_ARIA_MESSAGE : EMPTY_ARIA_MESSAGE}
      </div>
    </div>
  );
};
