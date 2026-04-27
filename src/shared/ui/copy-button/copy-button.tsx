import { type FC } from 'react';
import { FiCheck, FiCopy } from 'react-icons/fi';
import {
  ARIA_HIDDEN_TRUE,
  BUTTON_TYPE_BUTTON,
  useClassName,
  useCopyableField,
} from '@shared/lib';
import {
  COPY_BUTTON_ARIA_LABEL,
  COPY_BUTTON_BLOCK,
  COPY_BUTTON_TITLE,
} from './constants';
import './copy-button.less';

interface ICopyButtonProps {
  value: string;
  disabled?: boolean;
  title?: string;
  ariaLabel?: string;
}

export const CopyButton: FC<ICopyButtonProps> = ({
  value,
  disabled,
  title = COPY_BUTTON_TITLE,
  ariaLabel = COPY_BUTTON_ARIA_LABEL,
}) => {
  const { isCopied, handleClick } = useCopyableField({ value });

  const className = useClassName({
    blockName: COPY_BUTTON_BLOCK,
  });

  const isDisabled = !value || disabled === true;

  return (
    <button
      type={BUTTON_TYPE_BUTTON}
      className={className}
      onClick={handleClick}
      disabled={isDisabled}
      title={title}
      aria-label={ariaLabel}
    >
      {isCopied ? (
        <FiCheck aria-hidden={ARIA_HIDDEN_TRUE} />
      ) : (
        <FiCopy aria-hidden={ARIA_HIDDEN_TRUE} />
      )}
    </button>
  );
};
