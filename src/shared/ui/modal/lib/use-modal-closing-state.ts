import { useState, useCallback, useEffect, type RefObject } from 'react';

interface IUseModalClosingStateReturn {
  isClosing: boolean;
  handleClose: () => void;
}

const FADE_OUT_MODAL_ANIMATION_NAME = 'fadeOutModal';

export const useModalClosingState = (
  onClose: () => void,
  overlayRef: RefObject<HTMLDivElement | null>
): IUseModalClosingStateReturn => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    setIsClosing((currentIsClosing) => {
      if (currentIsClosing) {
        return currentIsClosing;
      }

      return true;
    });
  }, []);

  useEffect(() => {
    if (!isClosing) {
      return;
    }

    const overlayElement = overlayRef.current;

    if (!overlayElement) {
      return;
    }

    const handleAnimationEnd = (event: AnimationEvent) => {
      const isModalContentAnimation =
        event.animationName === FADE_OUT_MODAL_ANIMATION_NAME;

      if (!isModalContentAnimation) {
        return;
      }

      onClose();
    };

    overlayElement.addEventListener(
      'animationend',
      handleAnimationEnd as EventListener
    );

    return () => {
      overlayElement.removeEventListener(
        'animationend',
        handleAnimationEnd as EventListener
      );
    };
  }, [isClosing, onClose, overlayRef]);

  return {
    isClosing,
    handleClose,
  };
};
