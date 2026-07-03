import { useCallback, useEffect, useMemo } from 'react';
import { useCardFormModal } from '@features/card-form';
import {
  selectVisibleCards,
  useCardManagementStore,
} from '@features/card-management';
import { useCardTypesManagementStore } from '@features/card-types-management';
import { useOwnersManagementStore } from '@features/owners-management';
import type { IBankCard } from '@entities/bank-card';
import type { Procedure } from '@shared/types';

interface IUseCardListResult {
  cards: IBankCard[];
  hasAnyCards: boolean;
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
  const sortKey = useCardManagementStore((state) => state.sortKey);
  const sortDirection = useCardManagementStore((state) => state.sortDirection);
  const filters = useCardManagementStore((state) => state.filters);
  const loadCards = useCardManagementStore((state) => state.loadCards);
  const reorderCards = useCardManagementStore((state) => state.reorderCards);
  const setCards = useCardManagementStore((state) => state.setCards);
  const toggleReorderMode = useCardManagementStore(
    (state) => state.toggleReorderMode,
  );

  const cardTypes = useCardTypesManagementStore((state) => state.cardTypes);
  const loadCardTypes = useCardTypesManagementStore(
    (state) => state.loadCardTypes,
  );
  const owners = useOwnersManagementStore((state) => state.owners);
  const loadOwners = useOwnersManagementStore((state) => state.loadOwners);

  const { openAddCardForm } = useCardFormModal();

  useEffect(() => {
    loadCards();
    loadCardTypes();
    loadOwners();
  }, [loadCards, loadCardTypes, loadOwners]);

  const visibleCards = useMemo(
    () =>
      selectVisibleCards(cards, {
        sortKey,
        sortDirection,
        filters,
        cardTypes,
        owners,
      }),
    [cards, sortKey, sortDirection, filters, cardTypes, owners],
  );

  const handleDragEnd = useCallback(
    (reorderedCards: IBankCard[]) => {
      setCards(reorderedCards);
      reorderCards(reorderedCards);
    },
    [setCards, reorderCards],
  );

  return {
    cards: visibleCards,
    hasAnyCards: cards.length > 0,
    flippedPan,
    isLoading,
    isReorderMode,
    handleShowForm: openAddCardForm,
    handleDragEnd,
    handleToggleReorderMode: toggleReorderMode,
  };
};
