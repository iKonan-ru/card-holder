import { type FC } from 'react';
import { useCardFormModal } from '@features/card-form';
import {
  getCardTypeName,
  useCardManagementStore,
} from '@features/card-management';
import { SortableCardItem } from '@features/sortable-card-item';
import { BankCard, type IBankCard } from '@entities/bank-card';
import type { ICardType } from '@entities/card-type';

interface ICardItemWrapperProps {
  card: IBankCard;
  isFlipped: boolean;
  isReorderMode: boolean;
  cardTypes: ICardType[];
}

export const CardItemWrapper: FC<ICardItemWrapperProps> = ({
  card,
  isFlipped,
  isReorderMode,
  cardTypes,
}) => {
  const flipCard = useCardManagementStore((state) => state.flipCard);
  const { openEditCardForm } = useCardFormModal();
  const typeName = getCardTypeName(card.typeId, cardTypes);

  return (
    <SortableCardItem
      id={card.pan}
      isReorderMode={isReorderMode}
    >
      <BankCard
        card={card}
        isFlipped={isFlipped}
        onFlip={flipCard}
        onEdit={openEditCardForm}
        isReorderMode={isReorderMode}
        typeName={typeName}
      />
    </SortableCardItem>
  );
};
