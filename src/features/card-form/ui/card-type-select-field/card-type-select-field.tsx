import { useCallback, useEffect, useMemo, type FC } from 'react';
import { useCardTypesManagementStore } from '@features/card-types-management';
import { bem, useClassName, useFormContext, useModal } from '@shared/lib';
import { Select, type ISelectOption } from '@shared/ui';
import { FIELD_NAME_TYPE_ID, TYPE_ID_LABEL } from '../../constants';
import { CardTypeQuickCreateModal } from '../card-type-quick-create-modal';
import {
  CARD_TYPE_ADD_BUTTON_LABEL,
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
    open(
      <CardTypeQuickCreateModal onCreate={handleCreate} />,
      CARD_TYPE_MODAL_TITLE,
    );
  }, [open, handleCreate]);

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
        placeholder={CARD_TYPE_PLACEHOLDER}
        disabled={disabled}
        footer={footer}
      />
    </div>
  );
};
