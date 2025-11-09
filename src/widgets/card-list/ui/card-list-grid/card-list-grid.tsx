import { type FC } from 'react';
import { useClassName, ParentClassProvider } from '@shared/lib';
import { AddCardButton, SortableCardItem } from '@shared/ui';
import { BankCard } from '@entities/bank-card';
import type { ICardListGridProps } from './model';
import { CARD_LIST_GRID_BLOCK } from './lib';
import './card-list-grid.less';

export const CardListGrid: FC<ICardListGridProps> = ({
  cards,
  flippedPan,
  isReorderMode,
  onFlipCard,
  onEditCard,
  onShowForm,
}) => {
  const className = useClassName({
    blockName: CARD_LIST_GRID_BLOCK,
  });

  return (
    <div
      className={className}
      role="list"
    >
      <ParentClassProvider parentClass={CARD_LIST_GRID_BLOCK}>
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
                isReorderMode={isReorderMode}
              />
            </SortableCardItem>
          );
        })}

        <div role="listitem">
          <AddCardButton onClick={onShowForm} />
        </div>
      </ParentClassProvider>
    </div>
  );
};
