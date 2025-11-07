import { type FC } from 'react';
import type { PropsWithParentClass } from '@shared/types';
import { usePWAInstall, createClassName } from '@shared/lib';
import {
  PWA_BUTTON_BLOCK,
  PWA_BUTTON_TEXT,
  PWA_BUTTON_ARIA_LABEL,
} from '../lib/constants';
import './pwa-button.less';

export const PWAButton: FC<PropsWithParentClass> = ({ parentClass }) => {
  const { canInstall, isInstalled, handleInstall } = usePWAInstall();

  if (!canInstall || isInstalled) {
    return null;
  }

  const className = createClassName({
    blockName: PWA_BUTTON_BLOCK,
    modifiers: ['primary'],
    parentClass,
  });

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
