import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FC,
  type KeyboardEvent,
  type ReactElement,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from 'react';
import { FiChevronDown, FiEdit } from 'react-icons/fi';
import {
  ARIA_HIDDEN_TRUE,
  bem,
  BUTTON_TYPE_BUTTON,
  KEY_ARROW_DOWN,
  KEY_ARROW_UP,
  KEY_ENTER,
  KEY_ESC,
  useClassName,
} from '@shared/lib';
import { Portal } from '../portal';
import {
  SELECT_BLOCK,
  SELECT_EDIT_OPTION_ARIA_LABEL,
  SELECT_NO_ACTIVE_INDEX,
  SELECT_SCROLL_BLOCK_START,
  SELECT_TRIGGER_ARIA_LABEL,
} from './constants';
import './select.less';

export interface ISelectOption {
  value: string;
  label: string;
}

interface ISelectProps {
  value: string | null;
  options: ISelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  footer?: ReactNode;
  disabled?: boolean;
  ariaLabel?: string;
  onEditOption?: (value: string) => void;
}

interface ISelectPosition {
  top: number;
  left: number;
  width: number;
}

export const Select: FC<ISelectProps> = ({
  value,
  options,
  onChange,
  placeholder,
  footer,
  disabled,
  ariaLabel = SELECT_TRIGGER_ARIA_LABEL,
  onEditOption,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(SELECT_NO_ACTIVE_INDEX);
  const [position, setPosition] = useState<ISelectPosition | null>(null);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value) ?? null,
    [options, value],
  );

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setActiveIndex(SELECT_NO_ACTIVE_INDEX);
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

    const selectedIndex = options.findIndex((option) => option.value === value);

    setActiveIndex(selectedIndex >= 0 ? selectedIndex : SELECT_NO_ACTIVE_INDEX);
    setIsOpen(true);
  }, [disabled, options, value]);

  const handleTriggerClick = useCallback(() => {
    if (isOpen) {
      closeDropdown();

      return;
    }

    openDropdown();
  }, [isOpen, closeDropdown, openDropdown]);

  const handleSelect = useCallback(
    (optionValue: string) => {
      onChange(optionValue);
      closeDropdown();
    },
    [onChange, closeDropdown],
  );

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

    // Capture phase: Modal stops mousedown propagation on bubble, which
    // would otherwise prevent this listener from ever seeing clicks inside it.
    document.addEventListener('mousedown', handlePointerDown, true);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown, true);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen, closeDropdown]);

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
    [options, value],
  );

  const handleTriggerKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      const isOpenKey =
        event.key === KEY_ARROW_DOWN ||
        event.key === KEY_ARROW_UP ||
        event.key === KEY_ENTER;

      if (!isOpen && isOpenKey) {
        event.preventDefault();
        openDropdown();
      }
    },
    [isOpen, openDropdown],
  );

  const handleListKeyDown = useCallback(
    (event: KeyboardEvent<HTMLUListElement>) => {
      if (event.key === KEY_ESC) {
        event.preventDefault();
        event.stopPropagation();
        closeDropdown();
        triggerRef.current?.focus();

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
          handleSelect(activeOption.value);
        }
      }
    },
    [options, activeIndex, closeDropdown, handleSelect],
  );

  const className = useClassName({ blockName: SELECT_BLOCK });

  const dropdownStyle = useMemo<CSSProperties | undefined>(() => {
    if (!position) {
      return undefined;
    }

    return { top: position.top, left: position.left, width: position.width };
  }, [position]);

  const renderOption = useCallback(
    (option: ISelectOption, index: number): ReactElement => {
      const isSelected = option.value === value;
      const isActive = index === activeIndex;
      const modifiers = [isSelected && 'selected', isActive && 'active'].filter(
        Boolean,
      ) as string[];
      const optionClassName = bem(bem(SELECT_BLOCK, 'option'), modifiers);

      const handleClick = () => {
        handleSelect(option.value);
      };

      const handleEditClick = (event: ReactMouseEvent) => {
        event.stopPropagation();
        onEditOption?.(option.value);
      };

      return (
        <li
          key={option.value}
          role="option"
          aria-selected={isSelected}
          className={optionClassName}
          onClick={handleClick}
        >
          <span className={bem(SELECT_BLOCK, 'option-label')}>
            {option.label}
          </span>
          {onEditOption && (
            <button
              type={BUTTON_TYPE_BUTTON}
              className={bem(SELECT_BLOCK, 'option-edit')}
              onClick={handleEditClick}
              aria-label={`${SELECT_EDIT_OPTION_ARIA_LABEL} ${option.label}`}
            >
              <FiEdit aria-hidden={ARIA_HIDDEN_TRUE} />
            </button>
          )}
        </li>
      );
    },
    [value, activeIndex, handleSelect, onEditOption],
  );

  return (
    <div className={className}>
      <button
        ref={triggerRef}
        type="button"
        className={bem(SELECT_BLOCK, 'trigger')}
        onClick={handleTriggerClick}
        onKeyDown={handleTriggerKeyDown}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
      >
        <span className={bem(SELECT_BLOCK, 'value')}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <FiChevronDown
          className={bem(
            bem(SELECT_BLOCK, 'chevron'),
            isOpen ? ['open'] : undefined,
          )}
          aria-hidden="true"
        />
      </button>

      {isOpen && position && (
        <Portal>
          <ul
            ref={handleListRef}
            role="listbox"
            tabIndex={-1}
            className={bem(SELECT_BLOCK, 'dropdown')}
            style={dropdownStyle}
            onKeyDown={handleListKeyDown}
          >
            {options.map(renderOption)}
            {footer && (
              <li className={bem(SELECT_BLOCK, 'footer')}>{footer}</li>
            )}
          </ul>
        </Portal>
      )}
    </div>
  );
};
