import { type FC, useMemo } from 'react';
import { FiCheck } from 'react-icons/fi';
import {
  bem,
  useClassName,
  ARIA_ROLE_BUTTON,
  ARIA_ROLE_STATUS,
  ARIA_LIVE_POLITE,
  ARIA_ATOMIC_TRUE,
  ARIA_HIDDEN_TRUE,
  ARIA_TABINDEX_INTERACTIVE,
} from '@shared/lib';
import type { ICopyableFieldProps } from './model';
import {
  COPYABLE_FIELD_BLOCK,
  COPY_TITLE_TEXT,
  COPIED_ARIA_MESSAGE,
  EMPTY_ARIA_MESSAGE,
  useCopyableField,
} from './lib';
import './copyable-field.less';

export const CopyableField: FC<ICopyableFieldProps> = ({
  value,
  label,
  title = COPY_TITLE_TEXT,
  maskFn,
  modifier,
}) => {
  const { isCopied, displayValue, ariaLabel, handleClick, handleKeyDown } =
    useCopyableField({
      value,
      label,
      title,
      maskFn,
    });

  const modifiers = useMemo(() => (modifier ? [modifier] : []), [modifier]);

  const wrapperClassName = useClassName({
    blockName: COPYABLE_FIELD_BLOCK,
    modifiers,
  });

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
        {displayValue}
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
