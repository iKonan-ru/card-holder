import { useMemo, type FC } from 'react';
import { MdInstallMobile } from 'react-icons/md';
import { bem, useClassName } from '@shared/lib';
import {
  PWA_BUTTON_ARIA_LABEL,
  PWA_BUTTON_BLOCK,
  PWA_BUTTON_TEXT,
} from '../constants';
import { usePWAInstall } from '../hooks';
import './pwa-button.less';

export const PWAButton: FC = () => {
  const { canInstall, isInstalled, handleInstall } = usePWAInstall();

  const modifiers = useMemo(() => ['primary'], []);

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
      <span className={bem(PWA_BUTTON_BLOCK, 'text')}>{PWA_BUTTON_TEXT}</span>
      <MdInstallMobile
        className={bem(PWA_BUTTON_BLOCK, 'icon')}
        aria-hidden="true"
      />
    </button>
  );
};
