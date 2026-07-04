import { useEffect, useRef, type FC, type PropsWithChildren } from 'react';
import { FiX } from 'react-icons/fi';
import {
  ARIA_HIDDEN_TRUE,
  ARIA_MODAL_TRUE,
  ARIA_ROLE_DIALOG,
  bem,
  KEY_ESC,
  ParentClassProvider,
  useClassName,
  useFocusTrap,
  useOverlayClick,
} from '@shared/lib';
import type { Procedure } from '@shared/types';
import { Portal } from '../portal';
import {
  BOTTOM_SHEET_BLOCK,
  BOTTOM_SHEET_CLOSE_ARIA_LABEL,
  BOTTOM_SHEET_OVERFLOW_HIDDEN,
} from './constants';
import './bottom-sheet.less';

interface IBottomSheetProps extends PropsWithChildren {
  isOpen: boolean;
  onClose: Procedure;
  title?: string;
}

export const BottomSheet: FC<IBottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useFocusTrap({ contentRef, isTopModal: isOpen });

  const {
    handleOverlayMouseDown,
    handleOverlayMouseUp,
    handleContentClick,
    handleContentMouseDown,
  } = useOverlayClick({ onOverlayClick: onClose, isTopModal: isOpen });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === KEY_ESC) {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = BOTTOM_SHEET_OVERFLOW_HIDDEN;
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const className = useClassName({ blockName: BOTTOM_SHEET_BLOCK });

  if (!isOpen) {
    return null;
  }

  return (
    <Portal>
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
          className={bem(BOTTOM_SHEET_BLOCK, 'content')}
          onClick={handleContentClick}
          onMouseDown={handleContentMouseDown}
        >
          <ParentClassProvider parentClass={BOTTOM_SHEET_BLOCK}>
            <div className={bem(BOTTOM_SHEET_BLOCK, 'header')}>
              {title && (
                <h3 className={bem(BOTTOM_SHEET_BLOCK, 'title')}>{title}</h3>
              )}
              <button
                type="button"
                className={bem(BOTTOM_SHEET_BLOCK, 'close')}
                onClick={onClose}
                aria-label={BOTTOM_SHEET_CLOSE_ARIA_LABEL}
              >
                <FiX aria-hidden={ARIA_HIDDEN_TRUE} />
              </button>
            </div>
            <div className={bem(BOTTOM_SHEET_BLOCK, 'body')}>{children}</div>
          </ParentClassProvider>
        </div>
      </div>
    </Portal>
  );
};
