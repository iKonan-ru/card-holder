import { useEffect, useCallback } from 'react';
import type { IBankCard } from '@entities/bank-card';
import { useCardManagementStore } from '@features/card-management';
import { useCardFormModal } from '@features/card-form';

export const useCardList = () => {
  const {
    cards,
    flippedPan,
    isLoading,
    isReorderMode,
    loadCards,
    reorderCards,
    setCards,
    toggleReorderMode,
    flipCard,
  } = useCardManagementStore();

  const { openAddCardForm, openEditCardForm } = useCardFormModal();

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  const handleDragEnd = useCallback(
    (reorderedCards: IBankCard[]) => {
      setCards(reorderedCards);
      reorderCards(reorderedCards);
    },
    [setCards, reorderCards]
  );

  const handleToggleReorderMode = useCallback(() => {
    toggleReorderMode();
  }, [toggleReorderMode]);

  const handleFlipCard = useCallback(
    (pan: string) => {
      flipCard(pan);
    },
    [flipCard]
  );

  return {
    cards,
    flippedPan,
    isLoading,
    isReorderMode,
    handleShowForm: openAddCardForm,
    handleEditCard: openEditCardForm,
    handleDragEnd,
    handleToggleReorderMode,
    handleFlipCard,
  };
};
