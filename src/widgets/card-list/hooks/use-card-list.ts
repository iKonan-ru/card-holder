import { useCallback, useEffect, useMemo } from 'react';
import { useCardFormModal } from '@features/card-form';
import {
  GroupBy,
  groupCards,
  selectVisibleCards,
  useCardsStore,
  useCardViewStore,
  type ICardGroup,
  type TGroupBy,
} from '@features/card-management';
import { useCardTypesManagementStore } from '@features/card-types-management';
import { useOwnersManagementStore } from '@features/owners-management';
import type { IBankCard } from '@entities/bank-card';
import type { Procedure } from '@shared/types';

interface IUseCardListResult {
  cards: IBankCard[];
  hasAnyCards: boolean;
  isGrouped: boolean;
  groupBy: TGroupBy;
  groups: ICardGroup[];
  collapsedGroups: string[];
  isReorderMode: boolean;
  handleShowForm: Procedure;
  handleDragEnd: (reorderedCards: IBankCard[]) => void;
  handleToggleGroupCollapsed: (groupId: string) => void;
}

export const useCardList = (): IUseCardListResult => {
  const cards = useCardsStore((state) => state.cards);
  const isReorderMode = useCardsStore((state) => state.isReorderMode);
  const loadCards = useCardsStore((state) => state.loadCards);
  const reorderCards = useCardsStore((state) => state.reorderCards);
  const setCards = useCardsStore((state) => state.setCards);

  const sortKey = useCardViewStore((state) => state.sortKey);
  const sortDirection = useCardViewStore((state) => state.sortDirection);
  const groupBy = useCardViewStore((state) => state.groupBy);
  const filters = useCardViewStore((state) => state.filters);
  const collapsedGroups = useCardViewStore((state) => state.collapsedGroups);
  const toggleGroupCollapsed = useCardViewStore(
    (state) => state.toggleGroupCollapsed,
  );

  const cardTypes = useCardTypesManagementStore((state) => state.items);
  const loadCardTypes = useCardTypesManagementStore((state) => state.load);
  const owners = useOwnersManagementStore((state) => state.items);
  const loadOwners = useOwnersManagementStore((state) => state.load);

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

  const groups = useMemo(
    () => groupCards(visibleCards, { groupBy, cardTypes, owners }),
    [visibleCards, groupBy, cardTypes, owners],
  );

  const isGrouped = groupBy !== GroupBy.None;

  const handleDragEnd = useCallback(
    (reorderedCards: IBankCard[]) => {
      const cardsWithFreshOrder = reorderedCards.map((card, index) => ({
        ...card,
        order: index,
      }));

      setCards(cardsWithFreshOrder);
      reorderCards(cardsWithFreshOrder);
    },
    [setCards, reorderCards],
  );

  return {
    cards: visibleCards,
    hasAnyCards: cards.length > 0,
    isGrouped,
    groupBy,
    groups,
    collapsedGroups,
    isReorderMode,
    handleShowForm: openAddCardForm,
    handleDragEnd,
    handleToggleGroupCollapsed: toggleGroupCollapsed,
  };
};
