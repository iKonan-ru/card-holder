import { useEffect, useRef, type RefObject } from 'react';
import { useCardSettingsStore } from '@features/card-settings';
import { CARD_COLUMN_WIDTH_CSS_VAR } from '../constants';

// Хук измеряет реальную отрисованную ширину одной колонки сетки карт
// (grid-template-columns может резолвиться в разную ширину в зависимости
// от вьюпорта) и публикует её в глобальную CSS-переменную, чтобы панель
// настроек могла точно повторить ширину колонки без скачка карт при
// открытии/закрытии
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

      // Пока панель открыта, её собственная ширина (var(--card-column-width))
      // сама влияет на padding контента и, следовательно, на ширину этой же
      // сетки - измерение и запись в этот момент создают бесконечную
      // обратную связь (значение никогда не сходится побитово из-за
      // субпиксельных округлений грида). Поэтому измеряем только когда
      // панель закрыта - её ширина не зависит от собственного открытия.
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
