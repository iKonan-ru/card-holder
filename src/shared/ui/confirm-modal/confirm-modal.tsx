import { type FC } from 'react';
import { bem, useClassName } from '@shared/lib';
import { useAnimatedModalClose } from '../modal';
import type { IConfirmModalProps } from './model';
import {
  CONFIRM_MODAL_BLOCK,
  DEFAULT_CANCEL_TEXT,
  DEFAULT_CONFIRM_TEXT,
  CONFIRM_MODAL_TITLE_ID,
  CONFIRM_MODAL_MESSAGE_ID,
} from './lib/constants';
import './confirm-modal.less';

export const ConfirmModal: FC<IConfirmModalProps> = ({
  title,
  message,
  confirmText = DEFAULT_CONFIRM_TEXT,
  cancelText = DEFAULT_CANCEL_TEXT,
  onConfirm,
  onCancel,
}) => {
  const className = useClassName({
    blockName: CONFIRM_MODAL_BLOCK,
  });

  const handleConfirm = useAnimatedModalClose(onConfirm);
  const handleCancel = useAnimatedModalClose(onCancel);

  return (
    <div className={className}>
      <h3
        id={CONFIRM_MODAL_TITLE_ID}
        className={bem(CONFIRM_MODAL_BLOCK, 'title')}
      >
        {title}
      </h3>
      <p
        id={CONFIRM_MODAL_MESSAGE_ID}
        className={bem(CONFIRM_MODAL_BLOCK, 'message')}
      >
        {message}
      </p>
      <div className={bem(CONFIRM_MODAL_BLOCK, 'actions')}>
        <button
          type="button"
          onClick={handleConfirm}
          aria-label={`${confirmText}: ${title}`}
          className={bem(bem(CONFIRM_MODAL_BLOCK, 'button'), ['confirm'])}
        >
          {confirmText}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          aria-label={cancelText}
          className={bem(bem(CONFIRM_MODAL_BLOCK, 'button'), ['cancel'])}
        >
          {cancelText}
        </button>
      </div>
    </div>
  );
};
