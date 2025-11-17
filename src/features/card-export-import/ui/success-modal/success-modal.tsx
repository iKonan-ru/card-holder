import type { FC } from 'react';
import { bem, ParentClassProvider, useClassName } from '@shared/lib';
import { useAnimatedModalClose, Button } from '@shared/ui';
import type { ISuccessModalProps } from './model';
import {
  SUCCESS_MODAL_BLOCK,
  SUCCESS_MODAL_MESSAGE_ID,
  SUCCESS_MODAL_BUTTON_TEXT,
} from './lib';
import './success-modal.less';

export const SuccessModal: FC<ISuccessModalProps> = ({ message, onClose }) => {
  const className = useClassName({
    blockName: SUCCESS_MODAL_BLOCK,
  });

  const handleClose = useAnimatedModalClose(onClose);

  return (
    <div className={className}>
      <ParentClassProvider parentClass={SUCCESS_MODAL_BLOCK}>
        <p
          id={SUCCESS_MODAL_MESSAGE_ID}
          className={bem(SUCCESS_MODAL_BLOCK, 'message')}
        >
          {message}
        </p>
        <div className={bem(SUCCESS_MODAL_BLOCK, 'actions')}>
          <Button
            type="button"
            onClick={handleClose}
            aria-label={SUCCESS_MODAL_BUTTON_TEXT}
            variant="primary"
          >
            {SUCCESS_MODAL_BUTTON_TEXT}
          </Button>
        </div>
      </ParentClassProvider>
    </div>
  );
};
