import { type FC, useMemo } from 'react';
import { useClassName } from '@shared/lib';
import {
  PWA_BUTTON_BLOCK,
  PWA_BUTTON_TEXT,
  PWA_BUTTON_ARIA_LABEL,
  usePWAInstall,
} from '../lib';
import './pwa-button.less';

const PRIMARY_MODIFIER = ['primary'];

export const PWAButton: FC = () => {
  const { canInstall, isInstalled, handleInstall } = usePWAInstall();

  const modifiers = useMemo(() => PRIMARY_MODIFIER, []);

  const className = useClassName({
    blockName: PWA_BUTTON_BLOCK,
    modifiers,
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
