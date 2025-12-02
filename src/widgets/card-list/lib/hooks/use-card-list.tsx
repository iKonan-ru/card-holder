import { useCallback, useEffect } from 'react';
import { useCardFormModal } from '@features/card-form';
import { useCardManagementStore } from '@features/card-management';
import type { IBankCard } from '@entities/bank-card';
import type { Procedure } from '@shared/types';

interface IUseCardListResult {
  cards: IBankCard[];
  flippedPan: string | null;
  isLoading: boolean;
  isReorderMode: boolean;
  handleShowForm: Procedure;
  handleEditCard: (card: IBankCard) => void;
  handleDragEnd: (reorderedCards: IBankCard[]) => void;
  handleToggleReorderMode: Procedure;
  handleFlipCard: (pan: string) => void;
}

export const useCardList = (): IUseCardListResult => {
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
