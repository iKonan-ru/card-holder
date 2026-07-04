import { useCallback, useEffect, useMemo, type FC } from 'react';
import { useCardTypesManagementStore } from '@features/card-types-management';
import type { ICardType } from '@entities/card-type';
import { bem, useClassName, useFormContext, useModal } from '@shared/lib';
import { Select, type ISelectOption } from '@shared/ui';
import { FIELD_NAME_TYPE_ID, TYPE_ID_LABEL } from '../../constants';
import { CardTypeFormModal } from '../card-type-form-modal';
import {
  CARD_TYPE_ADD_BUTTON_LABEL,
  CARD_TYPE_EDIT_MODAL_TITLE,
  CARD_TYPE_FIELD_BLOCK,
  CARD_TYPE_MODAL_TITLE,
  CARD_TYPE_PLACEHOLDER,
} from './constants';
import './card-type-select-field.less';

interface ICardTypeSelectFieldProps {
  value: string;
  disabled?: boolean;
}

export const CardTypeSelectField: FC<ICardTypeSelectFieldProps> = ({
  value,
  disabled,
}) => {
  const cardTypes = useCardTypesManagementStore((state) => state.cardTypes);
  const loadCardTypes = useCardTypesManagementStore(
    (state) => state.loadCardTypes,
  );
  const addCardType = useCardTypesManagementStore((state) => state.addCardType);
  const updateCardType = useCardTypesManagementStore(
    (state) => state.updateCardType,
  );
  const deleteCardType = useCardTypesManagementStore(
    (state) => state.deleteCardType,
  );
  const { onChange } = useFormContext();
  const { open, close } = useModal();

  useEffect(() => {
    loadCardTypes();
  }, [loadCardTypes]);

  const options = useMemo<ISelectOption[]>(
    () =>
      cardTypes.map((cardType) => ({
        value: cardType.id,
        label: cardType.name,
      })),
    [cardTypes],
  );

  const handleChange = useCallback(
    (nextValue: string) => {
      onChange?.(FIELD_NAME_TYPE_ID, nextValue);
    },
    [onChange],
  );

  const handleCreate = useCallback(
    async (name: string) => {
      const cardType = await addCardType(name);
      handleChange(cardType.id);
      close();
    },
    [addCardType, handleChange, close],
  );

  const handleOpenCreate = useCallback(() => {
    open(<CardTypeFormModal onSubmit={handleCreate} />, CARD_TYPE_MODAL_TITLE);
  }, [open, handleCreate]);

  const handleUpdate = useCallback(
    async (cardType: ICardType, name: string) => {
      await updateCardType({ ...cardType, name });
      close();
    },
    [updateCardType, close],
  );

  const handleDelete = useCallback(
    async (cardType: ICardType) => {
      await deleteCardType(cardType.id);

      if (value === cardType.id) {
        handleChange('');
      }

      close();
    },
    [deleteCardType, value, handleChange, close],
  );

  const handleEditOption = useCallback(
    (optionValue: string) => {
      const cardType = cardTypes.find((item) => item.id === optionValue);

      if (!cardType) {
        return;
      }

      const handleSubmit = (name: string) => handleUpdate(cardType, name);
      const handleModalDelete = () => handleDelete(cardType);

      open(
        <CardTypeFormModal
          cardType={cardType}
          onSubmit={handleSubmit}
          onDelete={handleModalDelete}
        />,
        CARD_TYPE_EDIT_MODAL_TITLE,
      );
    },
    [cardTypes, open, handleUpdate, handleDelete],
  );

  const footer = useMemo(
    () => (
      <button
        type="button"
        className={bem(CARD_TYPE_FIELD_BLOCK, 'add-button')}
        onClick={handleOpenCreate}
      >
        {CARD_TYPE_ADD_BUTTON_LABEL}
      </button>
    ),
    [handleOpenCreate],
  );

  const className = useClassName({ blockName: CARD_TYPE_FIELD_BLOCK });

  return (
    <div className={className}>
      <span className={bem(CARD_TYPE_FIELD_BLOCK, 'label')}>
        {TYPE_ID_LABEL}
      </span>
      <Select
        value={value || null}
        options={options}
        onChange={handleChange}
        onEditOption={handleEditOption}
        placeholder={CARD_TYPE_PLACEHOLDER}
        ariaLabel={TYPE_ID_LABEL}
        disabled={disabled}
        footer={footer}
      />
    </div>
  );
};
