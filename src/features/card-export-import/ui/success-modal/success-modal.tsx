import type { FC } from 'react';
import { bem, useClassName } from '@shared/lib';
import { useAnimatedModalClose } from '@shared/ui';
import type { ISuccessModalProps } from './model';
import {
  SUCCESS_MODAL_BLOCK,
  SUCCESS_MODAL_TITLE_ID,
  SUCCESS_MODAL_MESSAGE_ID,
  SUCCESS_MODAL_BUTTON_TEXT,
} from './lib/constants';
import './success-modal.less';

export const SuccessModal: FC<ISuccessModalProps> = ({
  title,
  message,
  onClose,
}) => {
  const className = useClassName({
    blockName: SUCCESS_MODAL_BLOCK,
  });

  const handleClose = useAnimatedModalClose(onClose);

  return (
    <div className={className}>
      <h3
        id={SUCCESS_MODAL_TITLE_ID}
        className={bem(SUCCESS_MODAL_BLOCK, 'title')}
      >
        {title}
      </h3>
      <p
        id={SUCCESS_MODAL_MESSAGE_ID}
        className={bem(SUCCESS_MODAL_BLOCK, 'message')}
      >
        {message}
      </p>
      <div className={bem(SUCCESS_MODAL_BLOCK, 'actions')}>
        <button
          type="button"
          onClick={handleClose}
          aria-label={SUCCESS_MODAL_BUTTON_TEXT}
          className={bem(bem(SUCCESS_MODAL_BLOCK, 'button'), ['primary'])}
        >
          {SUCCESS_MODAL_BUTTON_TEXT}
        </button>
      </div>
    </div>
  );
};
