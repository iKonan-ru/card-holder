import { type FC } from 'react';
import type { ICardType } from '@entities/card-type';
import { EntityFormModal } from '../entity-form-modal';
import { CARD_TYPE_FORM_TEXTS } from './constants';

interface ICardTypeFormModalProps {
  cardType?: ICardType;
  onSubmit: (name: string) => Promise<void>;
  onDelete?: () => Promise<void>;
}

export const CardTypeFormModal: FC<ICardTypeFormModalProps> = ({
  cardType,
  onSubmit,
  onDelete,
}) => (
  <EntityFormModal
    initialValue={cardType?.name ?? ''}
    isEditMode={Boolean(cardType)}
    texts={CARD_TYPE_FORM_TEXTS}
    onSubmit={onSubmit}
    onDelete={onDelete}
  />
);
