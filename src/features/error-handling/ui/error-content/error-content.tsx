import type { FC } from 'react';
import { bem } from '@shared/lib';
import { useAnimatedModalClose, Button } from '@shared/ui';
import {
  ERROR_CONTENT_BLOCK,
  ERROR_CONTENT_TITLE,
  ERROR_CONTENT_CLOSE_TEXT,
  ERROR_CONTENT_TITLE_ID,
  ERROR_CONTENT_MESSAGE_ID,
} from '../../lib/constants';
import './error-content.less';

interface IErrorContentProps {
  message: string;
  onClose?: () => void;
}

export const ErrorContent: FC<IErrorContentProps> = ({ message, onClose }) => {
  const handleClose = useAnimatedModalClose(onClose);

  return (
    <div className={ERROR_CONTENT_BLOCK}>
      <h3
        id={ERROR_CONTENT_TITLE_ID}
        className={bem(ERROR_CONTENT_BLOCK, 'title')}
      >
        {ERROR_CONTENT_TITLE}
      </h3>
      <p
        id={ERROR_CONTENT_MESSAGE_ID}
        className={bem(ERROR_CONTENT_BLOCK, 'message')}
      >
        {message}
      </p>
      <div className={bem(ERROR_CONTENT_BLOCK, 'actions')}>
        <Button
          type="button"
          onClick={handleClose}
          aria-label={ERROR_CONTENT_CLOSE_TEXT}
          variant="secondary"
        >
          {ERROR_CONTENT_CLOSE_TEXT}
        </Button>
      </div>
    </div>
  );
};
