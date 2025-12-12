import { useCallback, useState, type FC } from 'react';
import {
  bem,
  ParentClassProvider,
  useAnimatedModalClose,
  useClassName,
} from '@shared/lib';
import type { Procedure } from '@shared/types';
import { Button } from '@shared/ui';
import {
  PWA_UPDATE_BLOCK,
  PWA_UPDATE_BUTTON_TEXT,
  PWA_UPDATE_DISMISS_BUTTON_TEXT,
  PWA_UPDATE_MESSAGE,
} from '../constants';
import './pwa-update.less';

interface IPWAUpdateProps {
  onUpdate: () => Promise<void>;
  onDismiss?: Procedure;
}

export const PWAUpdate: FC<IPWAUpdateProps> = ({ onUpdate, onDismiss }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const className = useClassName({
    blockName: PWA_UPDATE_BLOCK,
  });

  const handleUpdate = useAnimatedModalClose(
    useCallback(async () => {
      setIsUpdating(true);

      try {
        await onUpdate();
      } finally {
        setIsUpdating(false);
      }
    }, [onUpdate]),
  );

  const handleDismiss = useAnimatedModalClose(
    useCallback(() => {
      if (onDismiss) {
        onDismiss();
      }
    }, [onDismiss]),
  );

  return (
    <div className={className}>
      <ParentClassProvider parentClass={PWA_UPDATE_BLOCK}>
        <p className={bem(PWA_UPDATE_BLOCK, 'message')}>{PWA_UPDATE_MESSAGE}</p>
        <div className={bem(PWA_UPDATE_BLOCK, 'actions')}>
          {onDismiss && (
            <Button
              type="button"
              variant="secondary"
              onClick={handleDismiss}
              aria-label={PWA_UPDATE_DISMISS_BUTTON_TEXT}
            >
              {PWA_UPDATE_DISMISS_BUTTON_TEXT}
            </Button>
          )}
          <Button
            type="button"
            variant="primary"
            onClick={handleUpdate}
            isLoading={isUpdating}
            aria-label={PWA_UPDATE_BUTTON_TEXT}
          >
            {PWA_UPDATE_BUTTON_TEXT}
          </Button>
        </div>
      </ParentClassProvider>
    </div>
  );
};
