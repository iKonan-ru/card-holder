import {
  useCallback,
  useMemo,
  useRef,
  type FC,
  type ReactElement,
  type ReactNode,
} from 'react';
import { FiChevronDown } from 'react-icons/fi';
import {
  ARIA_HASPOPUP_LISTBOX,
  ARIA_HIDDEN_TRUE,
  ARIA_ROLE_LISTBOX,
  bem,
  BUTTON_TYPE_BUTTON,
  useClassName,
} from '@shared/lib';
import { Portal } from '../portal';
import {
  SELECT_BLOCK,
  SELECT_CHEVRON_MODIFIER_OPEN,
  SELECT_TRIGGER_ARIA_LABEL,
} from './constants';
import { useSelectDropdown, useSelectKeyboard } from './hooks';
import { SelectOption } from './select-option';
import type { ISelectOption } from './types';
import './select.less';

export type { ISelectOption };

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
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value) ?? null,
    [options, value],
  );

  const {
    isOpen,
    dropdownStyle,
    openDropdown,
    closeDropdown,
    handleTriggerClick,
  } = useSelectDropdown({ disabled, triggerRef, listRef });

  const handleSelect = useCallback(
    (optionValue: string) => {
      onChange(optionValue);
      closeDropdown();
    },
    [onChange, closeDropdown],
  );

  // Escape дополнительно возвращает фокус на триггер - в отличие от закрытия
  // по клику вне списка или по скроллу.
  const handleEscapeClose = useCallback(() => {
    closeDropdown();
    triggerRef.current?.focus();
  }, [closeDropdown]);

  const {
    activeIndex,
    handleTriggerKeyDown,
    handleListKeyDown,
    handleListRef,
  } = useSelectKeyboard({
    isOpen,
    options,
    value,
    listRef,
    onOpen: openDropdown,
    onClose: handleEscapeClose,
    onSelect: handleSelect,
  });

  const modifiers = isOpen ? [SELECT_CHEVRON_MODIFIER_OPEN] : undefined;
  const className = useClassName({ blockName: SELECT_BLOCK, modifiers });
  const chevronClassName = bem(bem(SELECT_BLOCK, 'chevron'), modifiers);

  const renderOption = useCallback(
    (option: ISelectOption, index: number): ReactElement => (
      <SelectOption
        key={option.value}
        option={option}
        isSelected={option.value === value}
        isActive={index === activeIndex}
        onSelect={handleSelect}
        onEdit={onEditOption}
      />
    ),
    [value, activeIndex, handleSelect, onEditOption],
  );

  return (
    <div className={className}>
      <button
        ref={triggerRef}
        type={BUTTON_TYPE_BUTTON}
        className={bem(SELECT_BLOCK, 'trigger')}
        onClick={handleTriggerClick}
        onKeyDown={handleTriggerKeyDown}
        disabled={disabled}
        aria-haspopup={ARIA_HASPOPUP_LISTBOX}
        aria-expanded={isOpen}
        aria-label={ariaLabel}
      >
        <span
          className={bem(
            bem(SELECT_BLOCK, 'value'),
            selectedOption ? ['selected'] : ['empty'],
          )}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <FiChevronDown
          className={chevronClassName}
          aria-hidden={ARIA_HIDDEN_TRUE}
        />
      </button>

      {isOpen && dropdownStyle && (
        <Portal>
          <ul
            ref={handleListRef}
            role={ARIA_ROLE_LISTBOX}
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
