import { create, type StoreApi, type UseBoundStore } from 'zustand';
import { persist } from 'zustand/middleware';
import { useCryptoStore } from '@features/app-lock';
import type { IBankCard } from '@entities/bank-card';
import {
  addCard as addCardToDb,
  clearAllCards as clearAllCardsFromDb,
  deleteCard as deleteCardFromDb,
  ERROR_FAILED_TO_ADD_CARD,
  ERROR_FAILED_TO_CLEAR_CARDS,
  ERROR_FAILED_TO_DELETE_CARD,
  ERROR_FAILED_TO_UPDATE_CARD,
  getAllCards,
  initDatabase,
  logError,
  TYPE_NUMBER,
  updateCard as updateCardInDb,
  updateCardsOrder as updateCardsOrderInDb,
} from '@shared/lib';
import {
  CARD_VIEW_PERSIST_STORE_NAME,
  DEFAULT_CARD_FILTERS,
  DEFAULT_CARD_ORDER,
  DEFAULT_COLLAPSED_GROUPS,
  DEFAULT_GROUP_BY,
  DEFAULT_SORT_DIRECTION,
  DEFAULT_SORT_KEY,
  ERROR_FAILED_TO_LOAD_CARDS,
  ERROR_FAILED_TO_REORDER_CARDS,
  INITIAL_CARDS,
  INITIAL_FLIPPED_PAN,
  INITIAL_IS_LOADING,
  INITIAL_IS_REORDER_MODE,
} from '../constants';
import { canReorder } from '../lib';
import { executeCardOperation } from '../utils';
import type { ICardManagementActions, ICardManagementState } from './types';
import type { ICardFilters } from './view';

const getCryptoKey = (): CryptoKey => {
  const key = useCryptoStore.getState().cryptoKey;

  if (!key) {
    throw new Error('CryptoKey not available');
  }

  return key;
};

export const useCardManagementStore: UseBoundStore<
  StoreApi<ICardManagementState & ICardManagementActions>
> = create(
  persist(
    (set, get) => ({
      cards: INITIAL_CARDS,
      flippedPan: INITIAL_FLIPPED_PAN,
      isLoading: INITIAL_IS_LOADING,
      isReorderMode: INITIAL_IS_REORDER_MODE,
      sortKey: DEFAULT_SORT_KEY,
      sortDirection: DEFAULT_SORT_DIRECTION,
      groupBy: DEFAULT_GROUP_BY,
      filters: DEFAULT_CARD_FILTERS,
      collapsedGroups: DEFAULT_COLLAPSED_GROUPS,

      flipCard: (pan: IBankCard['pan']) => {
        set((state) => ({
          flippedPan: state.flippedPan === pan ? null : pan,
        }));
      },

      unflipCards: () => {
        set(() => ({
          flippedPan: null,
        }));
      },

      setReorderMode: (enabled: boolean) => {
        set((state) => {
          if (state.isReorderMode === enabled) {
            return state;
          }

          return {
            isReorderMode: enabled,
            flippedPan: null,
          };
        });
      },

      toggleReorderMode: () => {
        const { isReorderMode, setReorderMode } = get();
        setReorderMode(!isReorderMode);
      },

      loadCards: async () => {
        const { isUnlocked } = useCryptoStore.getState();

        if (!isUnlocked) {
          return;
        }

        set({ isLoading: true });

        try {
          await initDatabase();
          const cryptoKey = getCryptoKey();
          const loadedCards = await getAllCards(cryptoKey);

          set({
            cards: loadedCards,
            isLoading: false,
          });
        } catch (error) {
          logError({
            message: ERROR_FAILED_TO_LOAD_CARDS,
            error,
            context: 'CardManagementStore.loadCards',
          });
          set({ isLoading: false });
        }
      },

      addCard: async (card: IBankCard) => {
        const cryptoKey = getCryptoKey();
        const allCards = await getAllCards(cryptoKey);
        const maxOrder = allCards.length;
        const cardWithOrder: IBankCard = {
          ...card,
          id: crypto.randomUUID(),
          order: maxOrder,
        };

        return executeCardOperation({
          operation: () => addCardToDb(cardWithOrder, cryptoKey),
          errorMessage: ERROR_FAILED_TO_ADD_CARD,
          context: 'CardManagementStore.addCard',
          cryptoKey,
          onSuccess: (updatedCards) => {
            set({ cards: updatedCards });
          },
        });
      },

      updateCard: async (card: IBankCard) => {
        const cryptoKey = getCryptoKey();
        const hasOrder = typeof card.order === TYPE_NUMBER;

        if (hasOrder) {
          return executeCardOperation({
            operation: () => updateCardInDb(card, cryptoKey),
            errorMessage: ERROR_FAILED_TO_UPDATE_CARD,
            context: 'CardManagementStore.updateCard',
            cryptoKey,
            onSuccess: (updatedCards) => {
              set({ cards: updatedCards });
            },
          });
        }

        const existingCard = get().cards.find(
          (currentCard) => currentCard.id === card.id,
        );
        const cardOrder = existingCard?.order ?? DEFAULT_CARD_ORDER;
        const cardWithOrder: IBankCard = {
          ...card,
          order: cardOrder,
        };

        return executeCardOperation({
          operation: () => updateCardInDb(cardWithOrder, cryptoKey),
          errorMessage: ERROR_FAILED_TO_UPDATE_CARD,
          context: 'CardManagementStore.updateCard',
          cryptoKey,
          onSuccess: (updatedCards) => {
            set({ cards: updatedCards });
          },
        });
      },

      deleteCard: async (id: IBankCard['id']) => {
        const cryptoKey = getCryptoKey();

        return executeCardOperation({
          operation: () => deleteCardFromDb(id),
          errorMessage: ERROR_FAILED_TO_DELETE_CARD,
          context: 'CardManagementStore.deleteCard',
          cryptoKey,
          onSuccess: (updatedCards) => {
            set({ cards: updatedCards });
          },
        });
      },

      clearAllCards: async () => {
        const cryptoKey = getCryptoKey();

        return executeCardOperation({
          operation: () => clearAllCardsFromDb(),
          errorMessage: ERROR_FAILED_TO_CLEAR_CARDS,
          context: 'CardManagementStore.clearAllCards',
          cryptoKey,
          onSuccess: (updatedCards) => {
            set({ cards: updatedCards });
          },
        });
      },

      setCards: (cards: IBankCard[]) => {
        set({ cards });
      },

      reorderCards: async (cards: IBankCard[]) => {
        const cryptoKey = getCryptoKey();

        return executeCardOperation({
          operation: () => updateCardsOrderInDb(cards, cryptoKey),
          errorMessage: ERROR_FAILED_TO_REORDER_CARDS,
          context: 'CardManagementStore.reorderCards',
          cryptoKey,
          onSuccess: (updatedCards) => {
            set({ cards: updatedCards });
          },
        });
      },

      setSortKey: (sortKey) => {
        set((state) => {
          const isReorderAllowed = canReorder({
            sortKey,
            groupBy: state.groupBy,
            filters: state.filters,
          });

          return {
            sortKey,
            isReorderMode: isReorderAllowed ? state.isReorderMode : false,
          };
        });
      },

      setSortDirection: (sortDirection) => {
        set({ sortDirection });
      },

      setGroupBy: (groupBy) => {
        set((state) => {
          const isReorderAllowed = canReorder({
            sortKey: state.sortKey,
            groupBy,
            filters: state.filters,
          });

          return {
            groupBy,
            isReorderMode: isReorderAllowed ? state.isReorderMode : false,
          };
        });
      },

      toggleGroupCollapsed: (groupId: string) => {
        set((state) => {
          const isCollapsed = state.collapsedGroups.includes(groupId);
          const collapsedGroups = isCollapsed
            ? state.collapsedGroups.filter((id) => id !== groupId)
            : [...state.collapsedGroups, groupId];

          return { collapsedGroups };
        });
      },

      setFilters: (partialFilters: Partial<ICardFilters>) => {
        set((state) => {
          const filters: ICardFilters = {
            ...state.filters,
            ...partialFilters,
          };
          const isReorderAllowed = canReorder({
            sortKey: state.sortKey,
            groupBy: state.groupBy,
            filters,
          });

          return {
            filters,
            isReorderMode: isReorderAllowed ? state.isReorderMode : false,
          };
        });
      },

      clearFilters: () => {
        set({ filters: DEFAULT_CARD_FILTERS });
      },

      resetView: () => {
        set({
          sortKey: DEFAULT_SORT_KEY,
          sortDirection: DEFAULT_SORT_DIRECTION,
          groupBy: DEFAULT_GROUP_BY,
          filters: DEFAULT_CARD_FILTERS,
          collapsedGroups: DEFAULT_COLLAPSED_GROUPS,
        });
      },
    }),
    {
      name: CARD_VIEW_PERSIST_STORE_NAME,
      partialize: (state) => ({
        sortKey: state.sortKey,
        sortDirection: state.sortDirection,
        groupBy: state.groupBy,
        filters: state.filters,
        collapsedGroups: state.collapsedGroups,
      }),
    },
  ),
);
