import { useCallback, type FC } from 'react';
import { AddCardButton } from '@features/add-card-button';
import type { IBankCard } from '@entities/bank-card';
import { ParentClassProvider, useClassName } from '@shared/lib';
import type { Procedure } from '@shared/types';
import { CARD_LIST_GRID_BLOCK } from '../../constants';
import { CardItemWrapper } from '../card-item-wrapper';
import './card-list-grid.less';

interface ICardListGridProps {
  cards: IBankCard[];
  flippedPan: string | null;
  isReorderMode: boolean;
  onShowForm: Procedure;
}

export const CardListGrid: FC<ICardListGridProps> = ({
  cards,
  flippedPan,
  isReorderMode,
  onShowForm,
}) => {
  const className = useClassName({
    blockName: CARD_LIST_GRID_BLOCK,
  });

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
        {cards.map(getCard)}
        <div role="listitem">
          <AddCardButton onClick={onShowForm} />
        </div>
      </ParentClassProvider>
    </div>
  );
};
