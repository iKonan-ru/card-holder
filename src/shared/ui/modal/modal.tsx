import { useEffect, useRef, type FC, type MouseEvent } from 'react';
import { bem, useClassName, ParentClassProvider } from '@shared/lib';
import type { IModalProps } from './model';
import { MODAL_BLOCK } from './lib/constants';
import './modal.less';

export const Modal: FC<IModalProps> = ({
  children,
  onClose,
  isTopModal,
  ariaLabelledBy,
  ariaDescribedBy,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isTopModal || !contentRef.current) {
      return;
    }

    const focusableElements = contentRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) {
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    firstElement.focus();

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') {
        return;
      }

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);

    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isTopModal]);

  const handleContentClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  const handleOverlayClick = () => {
    if (isTopModal) {
      onClose();
    }
  };

  const className = useClassName({
    blockName: MODAL_BLOCK,
  });

  return (
    <div
      className={className}
      onClick={handleOverlayClick}
    >
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        className={bem(MODAL_BLOCK, 'content')}
        onClick={handleContentClick}
      >
        <ParentClassProvider parentClass={MODAL_BLOCK}>
          {children}
        </ParentClassProvider>
      </div>
    </div>
  );
};
