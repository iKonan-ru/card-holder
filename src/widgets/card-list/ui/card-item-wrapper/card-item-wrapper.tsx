import { type FC } from 'react';
import { useCardFormModal } from '@features/card-form';
import { getCardTypeName, useCardsStore } from '@features/card-management';
import { useCardTypesManagementStore } from '@features/card-types-management';
import { SortableCardItem } from '@features/sortable-card-item';
import { BankCard, type IBankCard } from '@entities/bank-card';

interface ICardItemWrapperProps {
  card: IBankCard;
  isReorderMode: boolean;
}

export const CardItemWrapper: FC<ICardItemWrapperProps> = ({
  card,
  isReorderMode,
}) => {
  const flipCard = useCardsStore((state) => state.flipCard);
  const flippedPan = useCardsStore((state) => state.flippedPan);
  const cardTypes = useCardTypesManagementStore((state) => state.cardTypes);
  const { openEditCardForm } = useCardFormModal();
  const isFlipped = flippedPan === card.pan;
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
