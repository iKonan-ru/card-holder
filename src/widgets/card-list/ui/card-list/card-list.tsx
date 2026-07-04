import { useMemo, type FC } from 'react';
import { closestCenter, DndContext, DragOverlay } from '@dnd-kit/core';
import { rectSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import type { IBankCard } from '@entities/bank-card';
import { ParentClassProvider, useClassName } from '@shared/lib';
import { DROP_ANIMATION } from '../../configs';
import {
  CARD_LIST_ARIA_LABEL,
  CARD_LIST_BLOCK,
  CARD_LIST_MODIFIERS_DRAGGING,
  CARD_LIST_MODIFIERS_EMPTY,
} from '../../constants';
import { useCardList, useCardListDrag, useDndSensors } from '../../hooks';
import { CardListDragOverlay, CardListGroups } from '../../ui';
import { CardListGrid } from '../card-list-grid';
import './card-list.less';

export const CardList: FC = () => {
  const {
    cards: storeCards,
    hasAnyCards,
    isGrouped,
    groups,
    collapsedGroups,
    flippedPan,
    isReorderMode,
    cardTypes,
    handleShowForm,
    handleDragEnd: handleDragEndStore,
    handleToggleGroupCollapsed,
  } = useCardList();

  const sensors = useDndSensors();

  const { cards, activeCard, handleDragStart, handleDragOver, handleDragEnd } =
    useCardListDrag({
      storeCards,
      onDragEnd: handleDragEndStore,
    });

  const sortableCards: IBankCard[] = isGrouped
    ? groups.flatMap((group) => group.cards)
    : cards;
  const cardIds = useMemo(
    () => sortableCards.map(({ pan }) => pan),
    [sortableCards],
  );
  const isDragging = activeCard !== null;

  const modifiers = useMemo(
    () =>
      isDragging ? CARD_LIST_MODIFIERS_DRAGGING : CARD_LIST_MODIFIERS_EMPTY,
    [isDragging],
  );

  const className = useClassName({
    blockName: CARD_LIST_BLOCK,
    modifiers,
  });

  return (
    <div
      className={className}
      aria-label={CARD_LIST_ARIA_LABEL}
    >
      <ParentClassProvider parentClass={CARD_LIST_BLOCK}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={cardIds}
            strategy={rectSortingStrategy}
          >
            {isGrouped ? (
              <CardListGroups
                groups={groups}
                collapsedGroups={collapsedGroups}
                hasAnyCards={hasAnyCards}
                flippedPan={flippedPan}
                cardTypes={cardTypes}
                onToggleCollapse={handleToggleGroupCollapsed}
                onShowForm={handleShowForm}
              />
            ) : (
              <CardListGrid
                cards={cards}
                hasAnyCards={hasAnyCards}
                flippedPan={flippedPan}
                isReorderMode={isReorderMode}
                cardTypes={cardTypes}
                onShowForm={handleShowForm}
              />
            )}
          </SortableContext>

          <DragOverlay dropAnimation={DROP_ANIMATION}>
            <CardListDragOverlay
              activeCard={activeCard}
              cardTypes={cardTypes}
            />
          </DragOverlay>
        </DndContext>
      </ParentClassProvider>
    </div>
  );
};
