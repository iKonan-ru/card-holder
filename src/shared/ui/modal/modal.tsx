import { useRef, useEffect, type FC } from 'react';
import {
  bem,
  useClassName,
  ParentClassProvider,
  INITIAL_NULL,
  ARIA_ROLE_DIALOG,
  ARIA_MODAL_TRUE,
  useModalClosingState,
  useFocusTrap,
  useOverlayClick,
  ModalCloseContext,
} from '@shared/lib';
import type { IModalProps } from './model';
import { MODAL_BLOCK, MODAL_MODIFIERS_CLOSING } from './lib';
import './modal.less';

const INITIAL_OVERLAY_REF = INITIAL_NULL;
const INITIAL_CONTENT_REF = INITIAL_NULL;

export const Modal: FC<IModalProps> = ({
  children,
  onClose,
  onRegisterClose,
  isTopModal,
  preventClose = false,
  title,
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
  } = useOverlayClick(handleClose, isTopModal, preventClose);

  const modifiers = isClosing ? MODAL_MODIFIERS_CLOSING : undefined;

  const className = useClassName({
    blockName: MODAL_BLOCK,
    modifiers,
  });

  const contentClassName = bem(bem(MODAL_BLOCK, 'content'), modifiers);
  const titleClassName = bem(MODAL_BLOCK, 'title');

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
            {title && (
              <h3
                id={ariaLabelledBy}
                className={titleClassName}
              >
                {title}
              </h3>
            )}
            {children}
          </ParentClassProvider>
        </ModalCloseContext.Provider>
      </div>
    </div>
  );
};
