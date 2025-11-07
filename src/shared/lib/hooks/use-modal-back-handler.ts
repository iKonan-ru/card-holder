import { useEffect, useRef, useCallback, useId } from 'react';
import { useModalStack } from './use-modal-stack';
import { MODAL_STATE_KEY } from '../modal';

interface UseModalBackHandlerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const useModalBackHandler = ({
  isOpen,
  onClose,
}: UseModalBackHandlerProps): void => {
  const modalId = useId();
  const isHistoryPushedRef = useRef(false);
  const closedByPopStateRef = useRef(false);
  const onCloseRef = useRef(onClose);
  const { push, remove } = useModalStack();

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  const handlePopState = useCallback((): void => {
    const currentIsTop = useModalStack.getState().isTop(modalId);

    if (isHistoryPushedRef.current && currentIsTop) {
      closedByPopStateRef.current = true;
      isHistoryPushedRef.current = false;
      useModalStack.getState().remove(modalId);
      onCloseRef.current();
    }
  }, [modalId]);

  useEffect(() => {
    if (!isOpen) {
      if (!closedByPopStateRef.current) {
        remove(modalId);
      }

      if (isHistoryPushedRef.current && !closedByPopStateRef.current) {
        isHistoryPushedRef.current = false;
        window.history.back();
      } else {
        isHistoryPushedRef.current = false;
      }

      return;
    }

    closedByPopStateRef.current = false;

    if (!isHistoryPushedRef.current) {
      window.history.pushState({ [MODAL_STATE_KEY]: true }, '');
      isHistoryPushedRef.current = true;
      push(modalId, onCloseRef.current);
    }

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isOpen, handlePopState, modalId, push, remove]);
};
