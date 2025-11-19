import type { FC } from 'react';
import { bem, ParentClassProvider, useClassName } from '@shared/lib';
import { useAnimatedModalClose } from '@shared/lib';
import { Button } from '@shared/ui';
import {
  ERROR_CONTENT_BLOCK,
  ERROR_CONTENT_CLOSE_TEXT,
  ERROR_CONTENT_MESSAGE_ID,
} from '../../lib';
import './error-content.less';

interface IErrorContentProps {
  message: string;
  onClose?: () => void;
}

export const ErrorContent: FC<IErrorContentProps> = ({ message, onClose }) => {
  const handleClose = useAnimatedModalClose(onClose);

  const className = useClassName({
    blockName: ERROR_CONTENT_BLOCK,
  });

  return (
    <div className={className}>
      <ParentClassProvider parentClass={ERROR_CONTENT_BLOCK}>
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
      </ParentClassProvider>
    </div>
  );
};
