import { type FC } from 'react';
import { useCardFormModal } from '@features/card-form';
import { useCardsStore, useCardTypeName } from '@features/card-management';
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
  const typeName = useCardTypeName(card.typeId);
  const { openEditCardForm } = useCardFormModal();
  const isFlipped = flippedPan === card.pan;

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
