import type { FC } from 'react';
import { bem } from '@shared/lib';
import {
  ERROR_MODAL_BLOCK,
  ERROR_MODAL_TITLE,
  ERROR_MODAL_CLOSE_TEXT,
  ERROR_MODAL_TITLE_ID,
  ERROR_MODAL_MESSAGE_ID,
} from '../../lib/constants';
import './error-modal.less';

interface IErrorContentProps {
  message: string;
  onClose: () => void;
}

export const ErrorContent: FC<IErrorContentProps> = ({ message, onClose }) => {
  return (
    <div className={ERROR_MODAL_BLOCK}>
      <h3
        id={ERROR_MODAL_TITLE_ID}
        className={bem(ERROR_MODAL_BLOCK, 'title')}
      >
        {ERROR_MODAL_TITLE}
      </h3>
      <p
        id={ERROR_MODAL_MESSAGE_ID}
        className={bem(ERROR_MODAL_BLOCK, 'message')}
      >
        {message}
      </p>
      <div className={bem(ERROR_MODAL_BLOCK, 'actions')}>
        <button
          type="button"
          onClick={onClose}
          aria-label={ERROR_MODAL_CLOSE_TEXT}
          className={bem(ERROR_MODAL_BLOCK, 'button')}
        >
          {ERROR_MODAL_CLOSE_TEXT}
        </button>
      </div>
    </div>
  );
};
