import { useCallback, type FC } from 'react';
import { AddCardButton } from '@features/add-card-button';
import type { IBankCard } from '@entities/bank-card';
import { ParentClassProvider, useClassName } from '@shared/lib';
import type { Procedure } from '@shared/types';
import { CARD_LIST_GRID_BLOCK } from '../../constants';
import { CardItemWrapper } from '../card-item-wrapper';
import { CardListEmptyState } from '../card-list-empty-state';
import './card-list-grid.less';

interface ICardListGridProps {
  cards: IBankCard[];
  hasAnyCards?: boolean;
  hideAddButton?: boolean;
  isReorderMode: boolean;
  onShowForm?: Procedure;
}

export const CardListGrid: FC<ICardListGridProps> = ({
  cards,
  hasAnyCards = true,
  hideAddButton = false,
  isReorderMode,
  onShowForm,
}) => {
  const className = useClassName({
    blockName: CARD_LIST_GRID_BLOCK,
  });

  const showFilterEmptyState = hasAnyCards && cards.length === 0;

  const getCard = useCallback(
    (card: IBankCard) => (
      <CardItemWrapper
        key={card.pan}
        card={card}
        isReorderMode={isReorderMode}
      />
    ),
    [isReorderMode],
  );

  return (
    <div
      className={className}
      role="list"
    >
      <ParentClassProvider parentClass={CARD_LIST_GRID_BLOCK}>
        {showFilterEmptyState && <CardListEmptyState />}
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
