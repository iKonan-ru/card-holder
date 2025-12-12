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
  handleDragEnd: (reorderedCards: IBankCard[]) => void;
  handleToggleReorderMode: Procedure;
}

export const useCardList = (): IUseCardListResult => {
  const cards = useCardManagementStore((state) => state.cards);
  const flippedPan = useCardManagementStore((state) => state.flippedPan);
  const isLoading = useCardManagementStore((state) => state.isLoading);
  const isReorderMode = useCardManagementStore((state) => state.isReorderMode);
  const loadCards = useCardManagementStore((state) => state.loadCards);
  const reorderCards = useCardManagementStore((state) => state.reorderCards);
  const setCards = useCardManagementStore((state) => state.setCards);
  const toggleReorderMode = useCardManagementStore(
    (state) => state.toggleReorderMode,
  );

  const { openAddCardForm } = useCardFormModal();

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  const handleDragEnd = useCallback(
    (reorderedCards: IBankCard[]) => {
      setCards(reorderedCards);
      reorderCards(reorderedCards);
    },
    [setCards, reorderCards],
  );

  const handleToggleReorderMode = useCallback(() => {
    toggleReorderMode();
  }, [toggleReorderMode]);

  return {
    cards,
    flippedPan,
    isLoading,
    isReorderMode,
    handleShowForm: openAddCardForm,
    handleDragEnd,
    handleToggleReorderMode,
  };
};
