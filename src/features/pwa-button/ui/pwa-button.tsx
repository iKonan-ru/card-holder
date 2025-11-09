import { type FC } from 'react';
import { usePWAInstall, useClassName } from '@shared/lib';
import {
  PWA_BUTTON_BLOCK,
  PWA_BUTTON_TEXT,
  PWA_BUTTON_ARIA_LABEL,
} from '../lib/constants';
import './pwa-button.less';

export const PWAButton: FC = () => {
  const { canInstall, isInstalled, handleInstall } = usePWAInstall();

  const className = useClassName({
    blockName: PWA_BUTTON_BLOCK,
    modifiers: ['primary'],
  });

  if (!canInstall || isInstalled) {
    return null;
  }

  return (
    <button
      className={className}
      onClick={handleInstall}
      aria-label={PWA_BUTTON_ARIA_LABEL}
      type="button"
    >
      {PWA_BUTTON_TEXT}
    </button>
  );
};
