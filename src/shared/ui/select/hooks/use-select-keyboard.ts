import {
  useCallback,
  useEffect,
  useState,
  type KeyboardEvent,
  type RefObject,
} from 'react';
import { KEY_ARROW_DOWN, KEY_ARROW_UP, KEY_ENTER, KEY_ESC } from '@shared/lib';
import type { Procedure } from '@shared/types';
import {
  SELECT_NO_ACTIVE_INDEX,
  SELECT_SCROLL_BLOCK_START,
} from '../constants';
import type { ISelectOption } from '../types';

interface IUseSelectKeyboardParams {
  isOpen: boolean;
  options: ISelectOption[];
  value: string | null;
  listRef: RefObject<HTMLUListElement | null>;
  onOpen: Procedure;
  onClose: Procedure;
  onSelect: (value: string) => void;
}

export interface IUseSelectKeyboardResult {
  activeIndex: number;
  handleTriggerKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
  handleListKeyDown: (event: KeyboardEvent<HTMLUListElement>) => void;
  handleListRef: (node: HTMLUListElement | null) => void;
}

// Навигация по списку с клавиатуры: открытие стрелками/Enter на триггере,
// перемещение активного пункта и выбор/закрытие внутри списка, фокус и
// прокрутка к выбранному пункту при открытии.
export const useSelectKeyboard = ({
  isOpen,
  options,
  value,
  listRef,
  onOpen,
  onClose,
  onSelect,
}: IUseSelectKeyboardParams): IUseSelectKeyboardResult => {
  const [activeIndex, setActiveIndex] = useState(SELECT_NO_ACTIVE_INDEX);

  useEffect(() => {
    if (!isOpen) {
      setActiveIndex(SELECT_NO_ACTIVE_INDEX);

      return;
    }

    const selectedIndex = options.findIndex((option) => option.value === value);

    setActiveIndex(selectedIndex >= 0 ? selectedIndex : SELECT_NO_ACTIVE_INDEX);
  }, [isOpen, options, value]);

  const handleTriggerKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      const isOpenKey =
        event.key === KEY_ARROW_DOWN ||
        event.key === KEY_ARROW_UP ||
        event.key === KEY_ENTER;

      if (!isOpen && isOpenKey) {
        event.preventDefault();
        onOpen();
      }
    },
    [isOpen, onOpen],
  );

  const handleListKeyDown = useCallback(
    (event: KeyboardEvent<HTMLUListElement>) => {
      if (event.key === KEY_ESC) {
        event.preventDefault();
        event.stopPropagation();
        onClose();

        return;
      }

      if (event.key === KEY_ARROW_DOWN) {
        event.preventDefault();
        setActiveIndex((current) => Math.min(current + 1, options.length - 1));

        return;
      }

      if (event.key === KEY_ARROW_UP) {
        event.preventDefault();
        setActiveIndex((current) => Math.max(current - 1, 0));

        return;
      }

      if (event.key === KEY_ENTER) {
        event.preventDefault();
        const activeOption = options[activeIndex];

        if (activeOption) {
          onSelect(activeOption.value);
        }
      }
    },
    [options, activeIndex, onClose, onSelect],
  );

  const handleListRef = useCallback(
    (node: HTMLUListElement | null) => {
      listRef.current = node;

      if (!node) {
        return;
      }

      node.focus();

      const selectedIndex = options.findIndex(
        (option) => option.value === value,
      );

      if (selectedIndex < 0) {
        return;
      }

      const selectedElement = node.children[selectedIndex] as
        | HTMLElement
        | undefined;

      selectedElement?.scrollIntoView({ block: SELECT_SCROLL_BLOCK_START });
    },
    [listRef, options, value],
  );

  return {
    activeIndex,
    handleTriggerKeyDown,
    handleListKeyDown,
    handleListRef,
  };
};
