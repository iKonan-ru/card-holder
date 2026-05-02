import { useCallback, useEffect, useState, type RefObject } from 'react';
import type { Procedure } from '@shared/types';
import { FADE_OUT_MODAL_ANIMATION_NAME } from '../constants';

interface IUseModalClosingStateParams {
  onClose: Procedure;
  overlayRef: RefObject<HTMLDivElement | null>;
}

interface IUseModalClosingStateResult {
  isClosing: boolean;
  handleClose: Procedure;
}

export const useModalClosingState = ({
  onClose,
  overlayRef,
}: IUseModalClosingStateParams): IUseModalClosingStateResult => {
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
      handleAnimationEnd as EventListener,
    );

    return () => {
      overlayElement.removeEventListener(
        'animationend',
        handleAnimationEnd as EventListener,
      );
    };
  }, [isClosing, onClose, overlayRef]);

  return {
    isClosing,
    handleClose,
  };
};
