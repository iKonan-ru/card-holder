import { type FC } from 'react';
import {
  bem,
  useClassName,
  useAnimatedModalClose,
  ParentClassProvider,
} from '@shared/lib';
import { Button } from '../button';
import {
  CONFIRM_MODAL_BLOCK,
  DEFAULT_CANCEL_TEXT,
  DEFAULT_CONFIRM_TEXT,
} from './lib';
import './confirm-modal.less';

interface IConfirmModalProps {
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export const ConfirmModal: FC<IConfirmModalProps> = ({
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
      <ParentClassProvider parentClass={CONFIRM_MODAL_BLOCK}>
        <p className={bem(CONFIRM_MODAL_BLOCK, 'message')}>{message}</p>
        <div className={bem(CONFIRM_MODAL_BLOCK, 'actions')}>
          <Button
            type="button"
            onClick={handleConfirm}
            aria-label={confirmText}
            variant="danger"
          >
            {confirmText}
          </Button>
          <Button
            type="button"
            onClick={handleCancel}
            aria-label={cancelText}
            variant="secondary"
          >
            {cancelText}
          </Button>
        </div>
      </ParentClassProvider>
    </div>
  );
};
