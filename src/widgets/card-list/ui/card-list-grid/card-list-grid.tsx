import { useCallback, type FC } from 'react';
import { AddCardButton } from '@features/add-card-button';
import type { IBankCard } from '@entities/bank-card';
import { bem, ParentClassProvider, useClassName } from '@shared/lib';
import type { Procedure } from '@shared/types';
import {
  CARD_LIST_FILTER_EMPTY_MESSAGE,
  CARD_LIST_GRID_BLOCK,
} from '../../constants';
import { CardItemWrapper } from '../card-item-wrapper';
import './card-list-grid.less';

interface ICardListGridProps {
  cards: IBankCard[];
  hasAnyCards?: boolean;
  hideAddButton?: boolean;
  flippedPan: string | null;
  isReorderMode: boolean;
  onShowForm?: Procedure;
}

export const CardListGrid: FC<ICardListGridProps> = ({
  cards,
  hasAnyCards = true,
  hideAddButton = false,
  flippedPan,
  isReorderMode,
  onShowForm,
}) => {
  const className = useClassName({
    blockName: CARD_LIST_GRID_BLOCK,
  });

  const showFilterEmptyState = hasAnyCards && cards.length === 0;

  const getCard = useCallback(
    (card: IBankCard) => {
      const isFlipped = flippedPan === card.pan;

      return (
        <CardItemWrapper
          key={card.pan}
          card={card}
          isFlipped={isFlipped}
          isReorderMode={isReorderMode}
        />
      );
    },
    [flippedPan, isReorderMode],
  );

  return (
    <div
      className={className}
      role="list"
    >
      <ParentClassProvider parentClass={CARD_LIST_GRID_BLOCK}>
        {showFilterEmptyState && (
          <div className={bem(CARD_LIST_GRID_BLOCK, 'empty-state')}>
            {CARD_LIST_FILTER_EMPTY_MESSAGE}
          </div>
        )}
        {cards.map(getCard)}
        {!hideAddButton && onShowForm && (
          <div role="listitem">
            <AddCardButton onClick={onShowForm} />
          </div>
        )}
      </ParentClassProvider>
    </div>
  );
};
