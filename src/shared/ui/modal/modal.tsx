import { useEffect, useRef, type FC, type PropsWithChildren } from 'react';
import { FiX } from 'react-icons/fi';
import {
  ARIA_MODAL_TRUE,
  ARIA_ROLE_DIALOG,
  bem,
  ModalCloseContext,
  ParentClassProvider,
  useClassName,
  useFocusTrap,
  useModalClosingState,
  useOverlayClick,
} from '@shared/lib';
import type { Procedure } from '@shared/types';
import { MODAL_BLOCK, MODAL_MODIFIERS_CLOSING } from './constants';
import './modal.less';

interface IModalProps extends PropsWithChildren {
  onClose: Procedure;
  onRegisterClose?: (closeWithAnimation: Procedure) => void;
  isTopModal: boolean;
  preventClose?: boolean;
  title?: string;
}

export const Modal: FC<IModalProps> = ({
  children,
  onClose,
  onRegisterClose,
  isTopModal,
  preventClose = false,
  title,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { isClosing, handleClose } = useModalClosingState({
    onClose,
    overlayRef,
  });

  useEffect(() => {
    if (onRegisterClose) {
      onRegisterClose(handleClose);
    }
  }, [onRegisterClose, handleClose]);

  useFocusTrap({ contentRef, isTopModal });

  const {
    handleOverlayMouseDown,
    handleOverlayMouseUp,
    handleContentClick,
    handleContentMouseDown,
  } = useOverlayClick({
    onOverlayClick: handleClose,
    isTopModal,
    preventClose,
  });

  const modifiers = isClosing ? MODAL_MODIFIERS_CLOSING : undefined;

  const className = useClassName({
    blockName: MODAL_BLOCK,
    modifiers,
  });

  const contentClassName = bem(bem(MODAL_BLOCK, 'content'), modifiers);
  const headerClassName = bem(MODAL_BLOCK, 'header');
  const titleClassName = bem(MODAL_BLOCK, 'title');
  const closeClassName = bem(MODAL_BLOCK, 'close');

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
        className={contentClassName}
        onClick={handleContentClick}
        onMouseDown={handleContentMouseDown}
      >
        <ModalCloseContext.Provider value={handleClose}>
          <ParentClassProvider parentClass={MODAL_BLOCK}>
            <div className={headerClassName}>
              {title && <h3 className={titleClassName}>{title}</h3>}
              <button
                className={closeClassName}
                type="button"
                onClick={handleClose}
                disabled={preventClose}
                aria-label="Закрыть"
              >
                <FiX />
              </button>
            </div>
            {children}
          </ParentClassProvider>
        </ModalCloseContext.Provider>
      </div>
    </div>
  );
};
