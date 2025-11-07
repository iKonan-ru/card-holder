import { type FC } from 'react';
import { bem } from '@shared/lib';
import { AddCardButton, SortableCardItem } from '@shared/ui';
import { BankCard } from '@entities/bank-card';
import type { ICardListGridProps } from './model';

export const CardListGrid: FC<ICardListGridProps> = ({
  cards,
  flippedPan,
  isReorderMode,
  onFlipCard,
  onEditCard,
  onShowForm,
  parentClass,
}) => {
  return (
    <div
      className={bem(parentClass, 'grid')}
      role="list"
    >
      {cards.map((card) => {
        const isFlipped = flippedPan === card.pan;

        return (
          <SortableCardItem
            key={card.pan}
            id={card.pan}
            isReorderMode={isReorderMode}
          >
            <BankCard
              card={card}
              isFlipped={isFlipped}
              onFlip={onFlipCard}
              onEdit={onEditCard}
              parentClass={parentClass}
              isReorderMode={isReorderMode}
            />
          </SortableCardItem>
        );
      })}

      <div role="listitem">
        <AddCardButton
          onClick={onShowForm}
          parentClass={parentClass}
        />
      </div>
    </div>
  );
};
