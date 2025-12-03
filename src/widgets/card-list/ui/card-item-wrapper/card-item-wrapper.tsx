import { type FC } from 'react';
import { useCardFormModal } from '@features/card-form';
import { useCardManagementStore } from '@features/card-management';
import { SortableCardItem } from '@features/sortable-card-item';
import { BankCard, type IBankCard } from '@entities/bank-card';

interface ICardItemWrapperProps {
  card: IBankCard;
  isFlipped: boolean;
  isReorderMode: boolean;
}

export const CardItemWrapper: FC<ICardItemWrapperProps> = ({
  card,
  isFlipped,
  isReorderMode,
}) => {
  const flipCard = useCardManagementStore((state) => state.flipCard);
  const { openEditCardForm } = useCardFormModal();

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
      />
    </SortableCardItem>
  );
};
