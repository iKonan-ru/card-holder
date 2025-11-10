import { useRef, useCallback, useMemo, type MouseEvent } from 'react';

interface IUseOverlayClickReturn {
  handleOverlayMouseDown: () => void;
  handleOverlayMouseUp: () => void;
  handleContentClick: (event: MouseEvent<HTMLDivElement>) => void;
  handleContentMouseDown: (event: MouseEvent<HTMLDivElement>) => void;
}

export const useOverlayClick = (
  onOverlayClick: () => void,
  isTopModal: boolean
): IUseOverlayClickReturn => {
  const isMouseDownOnOverlayRef = useRef(false);

  const handleOverlayMouseDown = useCallback(() => {
    isMouseDownOnOverlayRef.current = true;
  }, []);

  const handleOverlayMouseUp = useCallback(() => {
    const wasMouseDownOnOverlay = isMouseDownOnOverlayRef.current;
    isMouseDownOnOverlayRef.current = false;

    if (wasMouseDownOnOverlay && isTopModal) {
      onOverlayClick();
    }
  }, [isTopModal, onOverlayClick]);

  const handleContentClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
    },
    []
  );

  const handleContentMouseDown = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
      isMouseDownOnOverlayRef.current = false;
    },
    []
  );

  return useMemo(
    () => ({
      handleOverlayMouseDown,
      handleOverlayMouseUp,
      handleContentClick,
      handleContentMouseDown,
    }),
    [
      handleOverlayMouseDown,
      handleOverlayMouseUp,
      handleContentClick,
      handleContentMouseDown,
    ]
  );
};
