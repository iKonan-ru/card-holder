import { useCallback, type FC } from 'react';
import { useCardTypesManagementStore } from '@features/card-types-management';
import type { ICardType } from '@entities/card-type';
import { FIELD_NAME_TYPE_ID, TYPE_ID_LABEL } from '../../constants';
import { useDirectorySelectField } from '../../hooks';
import { CardTypeFormModal } from '../card-type-form-modal';
import { DirectorySelectField } from '../directory-select-field';
import {
  CARD_TYPE_ADD_BUTTON_LABEL,
  CARD_TYPE_EDIT_MODAL_TITLE,
  CARD_TYPE_MODAL_TITLE,
  CARD_TYPE_PLACEHOLDER,
} from './constants';

const getCardTypeLabel = (cardType: ICardType): string => cardType.name;
const withCardTypeLabel = (cardType: ICardType, name: string): ICardType => ({
  ...cardType,
  name,
});

interface ICardTypeSelectFieldProps {
  value: string;
  disabled?: boolean;
}

export const CardTypeSelectField: FC<ICardTypeSelectFieldProps> = ({
  value,
  disabled,
}) => {
  const cardTypes = useCardTypesManagementStore((state) => state.items);
  const loadCardTypes = useCardTypesManagementStore((state) => state.load);
  const addCardType = useCardTypesManagementStore((state) => state.add);
  const updateCardType = useCardTypesManagementStore((state) => state.update);
  const deleteCardType = useCardTypesManagementStore((state) => state.remove);

  const renderCreateModal = useCallback(
    (onSubmit: (name: string) => Promise<void>) => (
      <CardTypeFormModal onSubmit={onSubmit} />
    ),
    [],
  );

  const renderEditModal = useCallback(
    (
      cardType: ICardType,
      onSubmit: (name: string) => Promise<void>,
      onDelete: () => Promise<void>,
    ) => (
      <CardTypeFormModal
        cardType={cardType}
        onSubmit={onSubmit}
        onDelete={onDelete}
      />
    ),
    [],
  );

  const { options, handleChange, handleEditOption, handleOpenCreate } =
    useDirectorySelectField({
      value,
      fieldName: FIELD_NAME_TYPE_ID,
      items: cardTypes,
      loadItems: loadCardTypes,
      addItem: addCardType,
      updateItem: updateCardType,
      deleteItem: deleteCardType,
      getLabel: getCardTypeLabel,
      withLabel: withCardTypeLabel,
      createModalTitle: CARD_TYPE_MODAL_TITLE,
      editModalTitle: CARD_TYPE_EDIT_MODAL_TITLE,
      renderCreateModal,
      renderEditModal,
    });

  return (
    <DirectorySelectField
      label={TYPE_ID_LABEL}
      placeholder={CARD_TYPE_PLACEHOLDER}
      addButtonLabel={CARD_TYPE_ADD_BUTTON_LABEL}
      value={value}
      options={options}
      onChange={handleChange}
      onEditOption={handleEditOption}
      onAddClick={handleOpenCreate}
      disabled={disabled}
    />
  );
};
