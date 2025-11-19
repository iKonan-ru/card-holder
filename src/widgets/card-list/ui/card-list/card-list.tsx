import { type FC, useMemo } from 'react';
import { ParentClassProvider, useClassName } from '@shared/lib';
import {
  useCardList,
  useDndSensors,
  useCardListDrag,
  CARD_LIST_BLOCK,
  CARD_LIST_ARIA_LABEL,
  DROP_ANIMATION,
  CARD_LIST_MODIFIERS_DRAGGING,
  CARD_LIST_MODIFIERS_EMPTY,
} from '../../lib';
import { DndContext, closestCenter, DragOverlay } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { CardListGrid } from '../card-list-grid';
import { CardListDragOverlay } from '../card-list-drag-overlay';
import './card-list.less';

export const CardList: FC = () => {
  const {
    cards: storeCards,
    flippedPan,
    isReorderMode,
    handleShowForm,
    handleEditCard,
    handleDragEnd: handleDragEndStore,
    handleFlipCard,
  } = useCardList();

  const sensors = useDndSensors();

  const { cards, activeCard, handleDragStart, handleDragOver, handleDragEnd } =
    useCardListDrag({
      storeCards,
      onDragEnd: handleDragEndStore,
    });

  const cardIds = useMemo(() => cards.map((card) => card.pan), [cards]);
  const isDragging = activeCard !== null;

  const modifiers = useMemo(
    () =>
      isDragging ? CARD_LIST_MODIFIERS_DRAGGING : CARD_LIST_MODIFIERS_EMPTY,
    [isDragging]
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
            <CardListGrid
              cards={cards}
              flippedPan={flippedPan}
              isReorderMode={isReorderMode}
              onFlipCard={handleFlipCard}
              onEditCard={handleEditCard}
              onShowForm={handleShowForm}
            />
          </SortableContext>

          <DragOverlay dropAnimation={DROP_ANIMATION}>
            <CardListDragOverlay
              activeCard={activeCard}
              onEditCard={handleEditCard}
            />
          </DragOverlay>
        </DndContext>
      </ParentClassProvider>
    </div>
  );
};
