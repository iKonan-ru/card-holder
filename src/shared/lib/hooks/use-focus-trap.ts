import { useEffect, type RefObject } from 'react';

interface IUseFocusTrapParams {
  contentRef: RefObject<HTMLDivElement | null>;
  isTopModal: boolean;
}

const FOCUSABLE_ELEMENTS_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

const FORM_FIELD_ELEMENTS_SELECTOR =
  'input:not([type="hidden"]), select, textarea';

export const useFocusTrap = ({
  contentRef,
  isTopModal,
}: IUseFocusTrapParams): void => {
  useEffect(() => {
    if (!isTopModal || !contentRef.current) {
      return;
    }

    const focusableElements = contentRef.current.querySelectorAll<HTMLElement>(
      FOCUSABLE_ELEMENTS_SELECTOR,
    );

    if (focusableElements.length === 0) {
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const formFieldElements = contentRef.current.querySelectorAll<HTMLElement>(
      FORM_FIELD_ELEMENTS_SELECTOR,
    );
    const initialFocusElement = formFieldElements[0] ?? firstElement;

    initialFocusElement.focus();

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
  }, [isTopModal, contentRef]);
};
