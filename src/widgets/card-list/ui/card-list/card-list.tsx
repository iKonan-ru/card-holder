import { type FC } from 'react';
import type { PropsWithParentClass } from '@shared/types';
import { createClassName } from '@shared/lib';
import { ReorderToggleButton } from '@shared/ui';
import { ExportButton, ImportButton } from '@features/card-export-import';
import {
  useCardList,
  useDndSensors,
  useCardListDrag,
  CARD_LIST_BLOCK,
  CARD_LIST_ARIA_LABEL,
  DROP_ANIMATION,
} from '../../lib';
import { DndContext, closestCenter, DragOverlay } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { CardListGrid } from '../card-list-grid';
import { CardListDragOverlay } from '../card-list-drag-overlay';
import { ActionButtonsContainer } from '../action-buttons-container';
import './card-list.less';

export const CardList: FC<PropsWithParentClass> = ({ parentClass }) => {
  const {
    cards: storeCards,
    flippedPan,
    isReorderMode,
    handleShowForm,
    handleEditCard,
    handleDragEnd: handleDragEndStore,
    handleToggleReorderMode,
    handleFlipCard,
  } = useCardList();

  const sensors = useDndSensors();

  const { cards, activeCard, handleDragStart, handleDragOver, handleDragEnd } =
    useCardListDrag({
      storeCards,
      onDragEnd: handleDragEndStore,
    });

  const hasCards = cards.length > 0;
  const cardIds = cards.map((card) => card.pan);
  const isDragging = activeCard !== null;

  const modifiers = [];

  if (isDragging) {
    modifiers.push('dragging');
  }

  const className = createClassName({
    blockName: CARD_LIST_BLOCK,
    parentClass,
    modifiers,
  });

  return (
    <div
      className={className}
      aria-label={CARD_LIST_ARIA_LABEL}
    >
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
            parentClass={CARD_LIST_BLOCK}
          />
        </SortableContext>

        <DragOverlay dropAnimation={DROP_ANIMATION}>
          <CardListDragOverlay
            activeCard={activeCard}
            onEditCard={handleEditCard}
            parentClass={CARD_LIST_BLOCK}
          />
        </DragOverlay>
      </DndContext>

      <ActionButtonsContainer parentClass={CARD_LIST_BLOCK}>
        <ImportButton parentClass={CARD_LIST_BLOCK} />

        {hasCards && (
          <>
            <ExportButton parentClass={CARD_LIST_BLOCK} />
            <ReorderToggleButton
              isActive={isReorderMode}
              onClick={handleToggleReorderMode}
              parentClass={CARD_LIST_BLOCK}
            />
          </>
        )}
      </ActionButtonsContainer>
    </div>
  );
};
