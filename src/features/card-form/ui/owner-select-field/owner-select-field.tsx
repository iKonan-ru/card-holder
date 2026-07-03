import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FC,
  type KeyboardEvent,
  type ReactElement,
} from 'react';
import {
  matchOwners,
  useOwnersManagementStore,
} from '@features/owners-management';
import type { IOwner } from '@entities/card-owner';
import {
  bem,
  KEY_ESC,
  useClassName,
  useFormContext,
  useModal,
} from '@shared/lib';
import { FIELD_NAME_OWNER_ID, OWNER_ID_LABEL } from '../../constants';
import { OwnerQuickCreateModal } from '../owner-quick-create-modal';
import {
  OWNER_ADD_BUTTON_LABEL,
  OWNER_FIELD_BLOCK,
  OWNER_MODAL_TITLE,
  OWNER_PLACEHOLDER,
} from './constants';
import './owner-select-field.less';

interface IOwnerSelectFieldProps {
  value: string;
  disabled?: boolean;
}

export const OwnerSelectField: FC<IOwnerSelectFieldProps> = ({
  value,
  disabled,
}) => {
  const owners = useOwnersManagementStore((state) => state.owners);
  const loadOwners = useOwnersManagementStore((state) => state.loadOwners);
  const addOwner = useOwnersManagementStore((state) => state.addOwner);
  const { onChange } = useFormContext();
  const { open, close } = useModal();

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadOwners();
  }, [loadOwners]);

  const selectedOwner = useMemo(
    () => owners.find((owner) => owner.id === value) ?? null,
    [owners, value],
  );

  useEffect(() => {
    if (isOpen) {
      return;
    }

    setQuery(selectedOwner ? selectedOwner.realName : '');
  }, [isOpen, selectedOwner]);

  const filteredOwners = useMemo(
    () => matchOwners(query, owners),
    [query, owners],
  );

  const handleChange = useCallback(
    (ownerId: string) => {
      onChange?.(FIELD_NAME_OWNER_ID, ownerId);
    },
    [onChange],
  );

  const handleSelect = useCallback(
    (ownerId: string) => {
      handleChange(ownerId);
      setIsOpen(false);
    },
    [handleChange],
  );

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;

    setQuery(inputValue);
    setIsOpen(true);

    if (!inputValue) {
      handleChange('');
    }
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === KEY_ESC && isOpen) {
      event.stopPropagation();
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      const isInside = containerRef.current?.contains(target) ?? false;

      if (!isInside) {
        setIsOpen(false);
      }
    };

    // Capture phase: Modal stops mousedown propagation on bubble, which
    // would otherwise prevent this listener from ever seeing clicks inside it.
    document.addEventListener('mousedown', handlePointerDown, true);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown, true);
    };
  }, [isOpen]);

  const handleCreate = useCallback(
    async (realName: string, aliases: string[]) => {
      const owner = await addOwner(realName, aliases);
      handleChange(owner.id);
      setIsOpen(false);
      close();
    },
    [addOwner, handleChange, close],
  );

  const handleOpenCreate = useCallback(() => {
    open(<OwnerQuickCreateModal onCreate={handleCreate} />, OWNER_MODAL_TITLE);
  }, [open, handleCreate]);

  const renderOption = useCallback(
    (owner: IOwner): ReactElement => {
      const handleClick = () => {
        handleSelect(owner.id);
      };

      return (
        <li
          key={owner.id}
          className={bem(OWNER_FIELD_BLOCK, 'option')}
          onClick={handleClick}
        >
          {owner.realName}
        </li>
      );
    },
    [handleSelect],
  );

  const className = useClassName({ blockName: OWNER_FIELD_BLOCK });

  return (
    <div
      className={className}
      ref={containerRef}
    >
      <span className={bem(OWNER_FIELD_BLOCK, 'label')}>{OWNER_ID_LABEL}</span>
      <input
        type="text"
        className={bem(OWNER_FIELD_BLOCK, 'input')}
        value={query}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onKeyDown={handleInputKeyDown}
        placeholder={OWNER_PLACEHOLDER}
        disabled={disabled}
      />
      {isOpen && (
        <ul className={bem(OWNER_FIELD_BLOCK, 'dropdown')}>
          {filteredOwners.map(renderOption)}
          <li className={bem(OWNER_FIELD_BLOCK, 'footer')}>
            <button
              type="button"
              className={bem(OWNER_FIELD_BLOCK, 'add-button')}
              onClick={handleOpenCreate}
            >
              {OWNER_ADD_BUTTON_LABEL}
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};
