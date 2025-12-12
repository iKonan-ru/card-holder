import { useCallback, useMemo, useRef, type MouseEvent } from 'react';
import type { Procedure } from '@shared/types';

interface IUseOverlayClickParams {
  onOverlayClick: Procedure;
  isTopModal: boolean;
  preventClose?: boolean;
}

interface IUseOverlayClickResult {
  handleOverlayMouseDown: Procedure;
  handleOverlayMouseUp: Procedure;
  handleContentClick: (event: MouseEvent<HTMLDivElement>) => void;
  handleContentMouseDown: (event: MouseEvent<HTMLDivElement>) => void;
}

export const useOverlayClick = ({
  onOverlayClick,
  isTopModal,
  preventClose = false,
}: IUseOverlayClickParams): IUseOverlayClickResult => {
  const isMouseDownOnOverlayRef = useRef(false);

  const handleOverlayMouseDown = useCallback(() => {
    isMouseDownOnOverlayRef.current = true;
  }, []);

  const handleOverlayMouseUp = useCallback(() => {
    const wasMouseDownOnOverlay = isMouseDownOnOverlayRef.current;
    isMouseDownOnOverlayRef.current = false;

    const shouldClose = wasMouseDownOnOverlay && isTopModal && !preventClose;

    if (shouldClose) {
      onOverlayClick();
    }
  }, [isTopModal, preventClose, onOverlayClick]);

  const handleContentClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
    },
    [],
  );

  const handleContentMouseDown = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
      isMouseDownOnOverlayRef.current = false;
    },
    [],
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
    ],
  );
};
