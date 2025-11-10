import { useRef, useEffect, type FC } from 'react';
import { bem, useClassName, ParentClassProvider } from '@shared/lib';
import type { IModalProps } from './model';
import { MODAL_BLOCK } from './lib/constants';
import { ModalCloseContext } from './lib/modal-close-context';
import { useModalClosingState } from './lib/use-modal-closing-state';
import { useFocusTrap } from './lib/use-focus-trap';
import { useOverlayClick } from './lib/use-overlay-click';
import './modal.less';

export const Modal: FC<IModalProps> = ({
  children,
  onClose,
  onRegisterClose,
  isTopModal,
  ariaLabelledBy,
  ariaDescribedBy,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { isClosing, handleClose } = useModalClosingState(onClose, overlayRef);

  useEffect(() => {
    if (onRegisterClose) {
      onRegisterClose(handleClose);
    }
  }, [onRegisterClose, handleClose]);

  useFocusTrap(contentRef, isTopModal);

  const {
    handleOverlayMouseDown,
    handleOverlayMouseUp,
    handleContentClick,
    handleContentMouseDown,
  } = useOverlayClick(handleClose, isTopModal);

  const modifiers = isClosing ? ['closing'] : undefined;

  const className = useClassName({
    blockName: MODAL_BLOCK,
    modifiers,
  });

  const contentClassName = bem(bem(MODAL_BLOCK, 'content'), modifiers);

  return (
    <div
      ref={overlayRef}
      className={className}
      onMouseDown={handleOverlayMouseDown}
      onMouseUp={handleOverlayMouseUp}
    >
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        className={contentClassName}
        onClick={handleContentClick}
        onMouseDown={handleContentMouseDown}
      >
        <ModalCloseContext.Provider value={handleClose}>
          <ParentClassProvider parentClass={MODAL_BLOCK}>
            {children}
          </ParentClassProvider>
        </ModalCloseContext.Provider>
      </div>
    </div>
  );
};
