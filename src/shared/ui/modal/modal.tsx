import { useRef, useEffect, type FC } from 'react';
import {
  bem,
  useClassName,
  ParentClassProvider,
  INITIAL_NULL,
  ARIA_ROLE_DIALOG,
  ARIA_MODAL_TRUE,
} from '@shared/lib';
import type { IModalProps } from './model';
import { MODAL_BLOCK, MODAL_MODIFIERS_CLOSING } from './lib/constants';
import { ModalCloseContext } from './lib/modal-close-context';
import { useModalClosingState } from './lib/use-modal-closing-state';
import { useFocusTrap } from './lib/use-focus-trap';
import { useOverlayClick } from './lib/use-overlay-click';
import './modal.less';

const INITIAL_OVERLAY_REF = INITIAL_NULL;
const INITIAL_CONTENT_REF = INITIAL_NULL;

export const Modal: FC<IModalProps> = ({
  children,
  onClose,
  onRegisterClose,
  isTopModal,
  ariaLabelledBy,
  ariaDescribedBy,
}) => {
  const overlayRef = useRef<HTMLDivElement>(INITIAL_OVERLAY_REF);
  const contentRef = useRef<HTMLDivElement>(INITIAL_CONTENT_REF);
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

  const modifiers = isClosing ? MODAL_MODIFIERS_CLOSING : undefined;

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
        role={ARIA_ROLE_DIALOG}
        aria-modal={ARIA_MODAL_TRUE}
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
