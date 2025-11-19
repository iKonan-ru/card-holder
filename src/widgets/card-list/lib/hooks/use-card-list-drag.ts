import { useState, useEffect, useCallback } from 'react';
import type { DragStartEvent, DragOverEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import type { IBankCard } from '@entities/bank-card';

interface IUseCardListDragParams {
  storeCards: IBankCard[];
  onDragEnd: (cards: IBankCard[]) => void;
}

export const useCardListDrag = ({
  storeCards,
  onDragEnd,
}: IUseCardListDragParams) => {
  const [cards, setCards] = useState<IBankCard[]>(storeCards);
  const [activeCard, setActiveCard] = useState<IBankCard | null>(null);

  useEffect(() => {
    const isNotDragging = !activeCard;

    if (isNotDragging) {
      setCards(storeCards);
    }
  }, [storeCards, activeCard]);

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      const card = cards.find((card) => card.pan === active.id);

      if (card) {
        setActiveCard(card);
      }
    },
    [cards]
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;

      if (!over) {
        return;
      }

      const isActiveIdDifferentFromOverId = active.id !== over.id;

      if (isActiveIdDifferentFromOverId) {
        const oldIndex = cards.findIndex((card) => card.pan === active.id);
        const newIndex = cards.findIndex((card) => card.pan === over.id);

        setCards(arrayMove(cards, oldIndex, newIndex));
      }
    },
    [cards]
  );

  const handleDragEndInternal = useCallback(() => {
    onDragEnd(cards);
    setActiveCard(null);
  }, [cards, onDragEnd]);

  return {
    cards,
    activeCard,
    handleDragStart,
    handleDragOver,
    handleDragEnd: handleDragEndInternal,
  };
};
