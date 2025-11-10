import { useRef, type MouseEvent } from 'react';

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

  const handleOverlayMouseDown = () => {
    isMouseDownOnOverlayRef.current = true;
  };

  const handleOverlayMouseUp = () => {
    const wasMouseDownOnOverlay = isMouseDownOnOverlayRef.current;
    isMouseDownOnOverlayRef.current = false;

    if (wasMouseDownOnOverlay && isTopModal) {
      onOverlayClick();
    }
  };

  const handleContentClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  const handleContentMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    isMouseDownOnOverlayRef.current = false;
  };

  return {
    handleOverlayMouseDown,
    handleOverlayMouseUp,
    handleContentClick,
    handleContentMouseDown,
  };
};
