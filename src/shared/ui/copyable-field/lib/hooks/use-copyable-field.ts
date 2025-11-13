import { useState, useRef, useCallback, useMemo } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';
import {
  logError,
  copyToClipboard,
  ERROR_FAILED_TO_COPY,
  INITIAL_FALSE,
  INITIAL_NULL,
  KEY_ENTER,
  KEY_SPACE,
} from '@shared/lib';
import {
  COPY_INDICATOR_DURATION,
  COPYABLE_FIELD_CONTEXT,
  COPY_TITLE_TEXT,
} from '../constants';

interface IUseCopyableFieldParams {
  value: string;
  label?: string;
  title?: string;
  maskFn?: (value: string, revealed: boolean) => string;
}

const INITIAL_IS_COPIED = INITIAL_FALSE;
const INITIAL_TIMEOUT_REF = INITIAL_NULL;

export const useCopyableField = ({
  value,
  label,
  title = COPY_TITLE_TEXT,
  maskFn,
}: IUseCopyableFieldParams) => {
  const [isCopied, setIsCopied] = useState(INITIAL_IS_COPIED);
  const timeoutRef = useRef<number | null>(INITIAL_TIMEOUT_REF);

  const handleCopy = useCallback(async () => {
    try {
      await copyToClipboard(value);

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

  const ariaLabel = useMemo(
    () =>
      label
        ? `${title}: ${label}`
        : `${title}: ${maskFn ? maskFn(value, false) : value}`,
    [label, title, value, maskFn]
  );

  const displayValue = maskFn ? maskFn(value, isCopied) : value;

  return {
    isCopied,
    displayValue,
    ariaLabel,
    handleClick,
    handleKeyDown,
  };
};
