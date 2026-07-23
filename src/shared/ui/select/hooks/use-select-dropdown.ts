import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type RefObject,
} from 'react';
import type { Procedure } from '@shared/types';

interface ISelectPosition {
  top: number;
  left: number;
  width?: number;
}

interface IUseSelectDropdownParams {
  disabled?: boolean;
  triggerRef: RefObject<HTMLButtonElement | null>;
  listRef: RefObject<HTMLUListElement | null>;
}

export interface IUseSelectDropdownResult {
  isOpen: boolean;
  dropdownStyle: CSSProperties | undefined;
  openDropdown: Procedure;
  closeDropdown: Procedure;
  handleTriggerClick: Procedure;
}

export const useSelectDropdown = ({
  disabled,
  triggerRef,
  listRef,
}: IUseSelectDropdownParams): IUseSelectDropdownResult => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<ISelectPosition | null>(null);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
  }, []);

  const openDropdown = useCallback(() => {
    if (disabled) {
      return;
    }

    const triggerElement = triggerRef.current;

    if (!triggerElement) {
      return;
    }

    const rect = triggerElement.getBoundingClientRect();

    setPosition({ top: rect.bottom, left: rect.left, width: rect.width });
    setIsOpen(true);
  }, [disabled, triggerRef]);

  const handleTriggerClick = useCallback(() => {
    if (isOpen) {
      closeDropdown();

      return;
    }

    openDropdown();
  }, [isOpen, closeDropdown, openDropdown]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      const isInsideTrigger = triggerRef.current?.contains(target) ?? false;
      const isInsideList = listRef.current?.contains(target) ?? false;

      if (!isInsideTrigger && !isInsideList) {
        closeDropdown();
      }
    };

    const handleScroll = (event: Event) => {
      const target = event.target as Node;
      const isInsideList = listRef.current?.contains(target) ?? false;

      if (isInsideList) {
        return;
      }

      closeDropdown();
    };

    const handleResize = () => {
      const triggerElement = triggerRef.current;

      if (!triggerElement) {
        return;
      }

      const rect = triggerElement.getBoundingClientRect();

      setPosition({ top: rect.bottom, left: rect.left, width: rect.width });
    };

    document.addEventListener('mousedown', handlePointerDown, true);
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown, true);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen, closeDropdown, triggerRef, listRef]);

  const dropdownStyle = useMemo<CSSProperties | undefined>(() => {
    if (!position) {
      return undefined;
    }

    return {
      top: position.top,
      left: position.left,
      width: position.width,
    };
  }, [position]);

  return {
    isOpen,
    dropdownStyle,
    openDropdown,
    closeDropdown,
    handleTriggerClick,
  };
};
