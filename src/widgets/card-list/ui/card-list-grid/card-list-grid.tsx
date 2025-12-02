import { type FC } from 'react';
import { AddCardButton } from '@features/add-card-button';
import { SortableCardItem } from '@features/sortable-card-item';
import { BankCard, type IBankCard } from '@entities/bank-card';
import { ParentClassProvider, useClassName } from '@shared/lib';
import type { Procedure } from '@shared/types';
import { CARD_LIST_GRID_BLOCK } from '../../lib';
import './card-list-grid.less';

interface ICardListGridProps {
  cards: IBankCard[];
  flippedPan: string | null;
  isReorderMode: boolean;
  onFlipCard: (pan: string) => void;
  onEditCard: (card: IBankCard) => void;
  onShowForm: Procedure;
}

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
