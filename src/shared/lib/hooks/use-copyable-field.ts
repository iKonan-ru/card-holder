import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from 'react';
import {
  COPY_INDICATOR_DURATION,
  COPY_TITLE_TEXT,
  COPYABLE_FIELD_CONTEXT,
} from '@shared/ui';
import { ERROR_FAILED_TO_COPY, KEY_ENTER, KEY_SPACE } from '../constants';
import { copyToClipboard, logError } from '../utils';

interface IUseCopyableFieldParams {
  value: string;
  label?: string;
  title?: string;
  maskFn?: (value: string, revealed: boolean) => string;
}

interface IUseCopyableFieldResult {
  isCopied: boolean;
  displayValue: string;
  ariaLabel: string;
  handleClick: (event: MouseEvent) => void;
  handleKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
}

const INITIAL_IS_COPIED = false;
const INITIAL_TIMEOUT_REF = null;

export const useCopyableField = ({
  value,
  label,
  title = COPY_TITLE_TEXT,
  maskFn,
}: IUseCopyableFieldParams): IUseCopyableFieldResult => {
  const [isCopied, setIsCopied] = useState(INITIAL_IS_COPIED);
  const timeoutRef = useRef<number | null>(INITIAL_TIMEOUT_REF);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

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
    [handleCopy],
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
    [handleCopy],
  );

  const ariaLabel = useMemo(
    () =>
      label
        ? `${title}: ${label}`
        : `${title}: ${maskFn ? maskFn(value, false) : value}`,
    [label, title, value, maskFn],
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
