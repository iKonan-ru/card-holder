import { useMemo, type FC } from 'react';
import { FiCheck } from 'react-icons/fi';
import {
  ARIA_HIDDEN_TRUE,
  ARIA_ROLE_BUTTON,
  ARIA_TABINDEX_INTERACTIVE,
  bem,
  useClassName,
  useCopyableField,
} from '@shared/lib';
import { COPY_TITLE_TEXT, COPYABLE_FIELD_BLOCK } from './lib';
import './copyable-field.less';

interface ICopyableFieldProps {
  value: string;
  title?: string;
  label?: string;
  modifier?: string;
  maskFn?: (value: string, showValue?: boolean) => string;
}

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

      <div className={bem(COPYABLE_FIELD_BLOCK, 'copy-wrapper')}>
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
        </div>

        {isCopied && (
          <FiCheck
            className={bem(COPYABLE_FIELD_BLOCK, 'indicator')}
            aria-hidden={ARIA_HIDDEN_TRUE}
          />
        )}
      </div>
    </div>
  );
};
