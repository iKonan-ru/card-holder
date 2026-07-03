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
  type ReactNode,
} from 'react';
import { FiChevronDown } from 'react-icons/fi';
import {
  bem,
  KEY_ARROW_DOWN,
  KEY_ARROW_UP,
  KEY_ENTER,
  KEY_ESC,
  useClassName,
} from '@shared/lib';
import { Portal } from '../portal';
import {
  SELECT_BLOCK,
  SELECT_NO_ACTIVE_INDEX,
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

    const handleScroll = () => {
      closeDropdown();
    };

    document.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen, closeDropdown]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    listRef.current?.focus();
  }, [isOpen]);

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

      return (
        <li
          key={option.value}
          role="option"
          aria-selected={isSelected}
          className={optionClassName}
          onClick={handleClick}
        >
          {option.label}
        </li>
      );
    },
    [value, activeIndex, handleSelect],
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
        aria-label={SELECT_TRIGGER_ARIA_LABEL}
      >
        <span className={bem(SELECT_BLOCK, 'value')}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <FiChevronDown
          className={bem(SELECT_BLOCK, 'chevron')}
          aria-hidden="true"
        />
      </button>

      {isOpen && position && (
        <Portal>
          <ul
            ref={listRef}
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
