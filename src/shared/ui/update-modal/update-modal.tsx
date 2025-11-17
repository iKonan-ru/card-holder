import { type FC, useState, useCallback } from 'react';
import { bem, useClassName } from '@shared/lib';
import { useAnimatedModalClose, Button } from '../';
import type { IUpdateModalProps } from './model';
import {
  UPDATE_MODAL_BLOCK,
  UPDATE_MODAL_TITLE_ID,
  UPDATE_MODAL_MESSAGE_ID,
  UPDATE_MODAL_TITLE,
  UPDATE_MODAL_MESSAGE,
  UPDATE_BUTTON_TEXT,
  DISMISS_BUTTON_TEXT,
} from './lib';
import './update-modal.less';

export const UpdateModal: FC<IUpdateModalProps> = ({ onUpdate, onDismiss }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const className = useClassName({
    blockName: UPDATE_MODAL_BLOCK,
  });

  const handleUpdate = useAnimatedModalClose(
    useCallback(async () => {
      setIsUpdating(true);

      try {
        await onUpdate();
      } finally {
        setIsUpdating(false);
      }
    }, [onUpdate])
  );

  const handleDismiss = useAnimatedModalClose(
    useCallback(() => {
      if (onDismiss) {
        onDismiss();
      }
    }, [onDismiss])
  );

  return (
    <div className={className}>
      <div className={bem(UPDATE_MODAL_BLOCK, 'header')}>
        <h3
          id={UPDATE_MODAL_TITLE_ID}
          className={bem(UPDATE_MODAL_BLOCK, 'title')}
        >
          {UPDATE_MODAL_TITLE}
        </h3>
      </div>
      <p
        id={UPDATE_MODAL_MESSAGE_ID}
        className={bem(UPDATE_MODAL_BLOCK, 'message')}
      >
        {UPDATE_MODAL_MESSAGE}
      </p>
      <div className={bem(UPDATE_MODAL_BLOCK, 'actions')}>
        {onDismiss && (
          <Button
            type="button"
            variant="secondary"
            onClick={handleDismiss}
            aria-label={DISMISS_BUTTON_TEXT}
          >
            {DISMISS_BUTTON_TEXT}
          </Button>
        )}
        <Button
          type="button"
          variant="primary"
          onClick={handleUpdate}
          isLoading={isUpdating}
          aria-label={UPDATE_BUTTON_TEXT}
        >
          {UPDATE_BUTTON_TEXT}
        </Button>
      </div>
    </div>
  );
};
