import type { FC } from 'react';
import {
  bem,
  ParentClassProvider,
  useAnimatedModalClose,
  useClassName,
} from '@shared/lib';
import type { Procedure } from '@shared/types';
import { Button } from '@shared/ui';
import {
  SUCCESS_MODAL_BLOCK,
  SUCCESS_MODAL_BUTTON_TEXT,
} from '../../constants';
import './success-modal.less';

interface ISuccessModalProps {
  message: string;
  onClose?: Procedure;
}

export const SuccessModal: FC<ISuccessModalProps> = ({ message, onClose }) => {
  const className = useClassName({
    blockName: SUCCESS_MODAL_BLOCK,
  });

  const handleClose = useAnimatedModalClose(onClose);

  return (
    <div className={className}>
      <ParentClassProvider parentClass={SUCCESS_MODAL_BLOCK}>
        <p className={bem(SUCCESS_MODAL_BLOCK, 'message')}>{message}</p>
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
