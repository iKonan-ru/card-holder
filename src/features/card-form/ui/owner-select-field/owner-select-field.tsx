import { useCallback, useEffect, useMemo, type FC } from 'react';
import { useOwnersManagementStore } from '@features/owners-management';
import type { IOwner } from '@entities/card-owner';
import { bem, useClassName, useFormContext, useModal } from '@shared/lib';
import { Select, type ISelectOption } from '@shared/ui';
import { FIELD_NAME_OWNER_ID, OWNER_ID_LABEL } from '../../constants';
import { OwnerFormModal } from '../owner-form-modal';
import {
  OWNER_ADD_BUTTON_LABEL,
  OWNER_EDIT_MODAL_TITLE,
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
  const updateOwner = useOwnersManagementStore((state) => state.updateOwner);
  const deleteOwner = useOwnersManagementStore((state) => state.deleteOwner);
  const { onChange } = useFormContext();
  const { open, close } = useModal();

  useEffect(() => {
    loadOwners();
  }, [loadOwners]);

  const options = useMemo<ISelectOption[]>(
    () => owners.map((owner) => ({ value: owner.id, label: owner.realName })),
    [owners],
  );

  const handleChange = useCallback(
    (nextValue: string) => {
      onChange?.(FIELD_NAME_OWNER_ID, nextValue);
    },
    [onChange],
  );

  const handleCreate = useCallback(
    async (realName: string) => {
      const owner = await addOwner(realName);
      handleChange(owner.id);
      close();
    },
    [addOwner, handleChange, close],
  );

  const handleOpenCreate = useCallback(() => {
    open(<OwnerFormModal onSubmit={handleCreate} />, OWNER_MODAL_TITLE);
  }, [open, handleCreate]);

  const handleUpdate = useCallback(
    async (owner: IOwner, realName: string) => {
      await updateOwner({ ...owner, realName });
      close();
    },
    [updateOwner, close],
  );

  const handleDelete = useCallback(
    async (owner: IOwner) => {
      await deleteOwner(owner.id);

      if (value === owner.id) {
        handleChange('');
      }

      close();
    },
    [deleteOwner, value, handleChange, close],
  );

  const handleEditOption = useCallback(
    (optionValue: string) => {
      const owner = owners.find((item) => item.id === optionValue);

      if (!owner) {
        return;
      }

      const handleSubmit = (realName: string) => handleUpdate(owner, realName);
      const handleModalDelete = () => handleDelete(owner);

      open(
        <OwnerFormModal
          owner={owner}
          onSubmit={handleSubmit}
          onDelete={handleModalDelete}
        />,
        OWNER_EDIT_MODAL_TITLE,
      );
    },
    [owners, open, handleUpdate, handleDelete],
  );

  const footer = useMemo(
    () => (
      <button
        type="button"
        className={bem(OWNER_FIELD_BLOCK, 'add-button')}
        onClick={handleOpenCreate}
      >
        {OWNER_ADD_BUTTON_LABEL}
      </button>
    ),
    [handleOpenCreate],
  );

  const className = useClassName({ blockName: OWNER_FIELD_BLOCK });

  return (
    <div className={className}>
      <span className={bem(OWNER_FIELD_BLOCK, 'label')}>{OWNER_ID_LABEL}</span>
      <Select
        value={value || null}
        options={options}
        onChange={handleChange}
        onEditOption={handleEditOption}
        placeholder={OWNER_PLACEHOLDER}
        ariaLabel={OWNER_ID_LABEL}
        disabled={disabled}
        footer={footer}
      />
    </div>
  );
};
