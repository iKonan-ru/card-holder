import { useEffect, useRef, type RefObject } from 'react';
import { useCardSettingsStore } from '@features/card-settings';
import { CARD_COLUMN_WIDTH_CSS_VAR } from '../constants';

export const useCardGridColumnWidth = (): RefObject<HTMLDivElement | null> => {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const gridElement = gridRef.current;

    if (!gridElement) {
      return;
    }

    let animationFrameId: number | null = null;

    const applyColumnWidth = () => {
      animationFrameId = null;

      const isPanelOpen = useCardSettingsStore.getState().isOpen;

      if (isPanelOpen) {
        return;
      }

      const [firstColumnWidth] =
        getComputedStyle(gridElement).gridTemplateColumns.split(' ');

      if (!firstColumnWidth) {
        return;
      }

      const currentValue = document.documentElement.style.getPropertyValue(
        CARD_COLUMN_WIDTH_CSS_VAR,
      );

      if (currentValue === firstColumnWidth) {
        return;
      }

      document.documentElement.style.setProperty(
        CARD_COLUMN_WIDTH_CSS_VAR,
        firstColumnWidth,
      );
    };

    const scheduleColumnWidthUpdate = () => {
      if (animationFrameId !== null) {
        return;
      }

      animationFrameId = requestAnimationFrame(applyColumnWidth);
    };

    scheduleColumnWidthUpdate();

    const resizeObserver = new ResizeObserver(scheduleColumnWidthUpdate);
    resizeObserver.observe(gridElement);

    return () => {
      resizeObserver.disconnect();

      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return gridRef;
};
