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
}

export const CopyButton: FC<ICopyButtonProps> = ({ value, disabled }) => {
  const { isCopied, handleClick } = useCopyableField({ value });

  const className = useClassName({
    blockName: COPY_BUTTON_BLOCK,
  });

  const isDisabled = !value || disabled === true;
  const icon = isCopied ? (
    <FiCheck aria-hidden={ARIA_HIDDEN_TRUE} />
  ) : (
    <FiCopy aria-hidden={ARIA_HIDDEN_TRUE} />
  );

  return (
    <button
      type={BUTTON_TYPE_BUTTON}
      className={className}
      onClick={handleClick}
      disabled={isDisabled}
      title={COPY_BUTTON_TITLE}
      aria-label={COPY_BUTTON_ARIA_LABEL}
    >
      {icon}
    </button>
  );
};
