import { useCallback, type FC } from 'react';
import { useOwnersManagementStore } from '@features/owners-management';
import type { IOwner } from '@entities/card-owner';
import { FIELD_NAME_OWNER_ID, OWNER_ID_LABEL } from '../../constants';
import { useDirectorySelectField } from '../../hooks';
import { DirectorySelectField } from '../directory-select-field';
import { OwnerFormModal } from '../owner-form-modal';
import {
  OWNER_ADD_BUTTON_LABEL,
  OWNER_EDIT_MODAL_TITLE,
  OWNER_MODAL_TITLE,
  OWNER_PLACEHOLDER,
} from './constants';

const getOwnerLabel = (owner: IOwner): string => owner.realName;
const withOwnerLabel = (owner: IOwner, realName: string): IOwner => ({
  ...owner,
  realName,
});

interface IOwnerSelectFieldProps {
  value: string;
  disabled?: boolean;
}

export const OwnerSelectField: FC<IOwnerSelectFieldProps> = ({
  value,
  disabled,
}) => {
  const owners = useOwnersManagementStore((state) => state.items);
  const loadOwners = useOwnersManagementStore((state) => state.load);
  const addOwner = useOwnersManagementStore((state) => state.add);
  const updateOwner = useOwnersManagementStore((state) => state.update);
  const deleteOwner = useOwnersManagementStore((state) => state.remove);

  const renderCreateModal = useCallback(
    (onSubmit: (realName: string) => Promise<void>) => (
      <OwnerFormModal onSubmit={onSubmit} />
    ),
    [],
  );

  const renderEditModal = useCallback(
    (
      owner: IOwner,
      onSubmit: (realName: string) => Promise<void>,
      onDelete: () => Promise<void>,
    ) => (
      <OwnerFormModal
        owner={owner}
        onSubmit={onSubmit}
        onDelete={onDelete}
      />
    ),
    [],
  );

  const { options, handleChange, handleEditOption, handleOpenCreate } =
    useDirectorySelectField({
      value,
      fieldName: FIELD_NAME_OWNER_ID,
      items: owners,
      loadItems: loadOwners,
      addItem: addOwner,
      updateItem: updateOwner,
      deleteItem: deleteOwner,
      getLabel: getOwnerLabel,
      withLabel: withOwnerLabel,
      createModalTitle: OWNER_MODAL_TITLE,
      editModalTitle: OWNER_EDIT_MODAL_TITLE,
      renderCreateModal,
      renderEditModal,
    });

  return (
    <DirectorySelectField
      label={OWNER_ID_LABEL}
      placeholder={OWNER_PLACEHOLDER}
      addButtonLabel={OWNER_ADD_BUTTON_LABEL}
      value={value}
      options={options}
      onChange={handleChange}
      onEditOption={handleEditOption}
      onAddClick={handleOpenCreate}
      disabled={disabled}
    />
  );
};
