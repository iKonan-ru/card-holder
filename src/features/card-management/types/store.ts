import { create, type StoreApi, type UseBoundStore } from 'zustand';
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
  getCardByPan,
  initDatabase,
  logError,
  TYPE_NUMBER,
  updateCard as updateCardInDb,
  updateCardsOrder as updateCardsOrderInDb,
} from '@shared/lib';
import {
  DEFAULT_CARD_ORDER,
  ERROR_FAILED_TO_LOAD_CARDS,
  ERROR_FAILED_TO_REORDER_CARDS,
} from '../constants';
import { executeCardOperation } from '../utils';
import type { ICardManagementActions, ICardManagementState } from './types';

const INITIAL_CARDS: IBankCard[] = [];
const INITIAL_FLIPPED_PAN = null;
const INITIAL_IS_LOADING = false;
const INITIAL_IS_REORDER_MODE = false;

export const useCardManagementStore: UseBoundStore<
  StoreApi<ICardManagementState & ICardManagementActions>
> = create((set, get) => ({
  cards: INITIAL_CARDS,
  flippedPan: INITIAL_FLIPPED_PAN,
  isLoading: INITIAL_IS_LOADING,
  isReorderMode: INITIAL_IS_REORDER_MODE,

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
    set({ isLoading: true });

    try {
      await initDatabase();
      const loadedCards = await getAllCards();

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
    const allCards = await getAllCards();
    const maxOrder = allCards.length;
    const cardWithOrder: IBankCard = {
      ...card,
      order: maxOrder,
    };

    return executeCardOperation({
      operation: () => addCardToDb(cardWithOrder),
      errorMessage: ERROR_FAILED_TO_ADD_CARD,
      context: 'CardManagementStore.addCard',
      onSuccess: (updatedCards) => {
        set({ cards: updatedCards });
      },
    });
  },

  updateCard: async (card: IBankCard) => {
    const hasOrder = typeof card.order === TYPE_NUMBER;

    if (hasOrder) {
      return executeCardOperation({
        operation: () => updateCardInDb(card),
        errorMessage: ERROR_FAILED_TO_UPDATE_CARD,
        context: 'CardManagementStore.updateCard',
        onSuccess: (updatedCards) => {
          set({ cards: updatedCards });
        },
      });
    }

    const existingCard = await getCardByPan(card.pan);
    const cardOrder = existingCard?.order ?? DEFAULT_CARD_ORDER;
    const cardWithOrder: IBankCard = {
      ...card,
      order: cardOrder,
    };

    return executeCardOperation({
      operation: () => updateCardInDb(cardWithOrder),
      errorMessage: ERROR_FAILED_TO_UPDATE_CARD,
      context: 'CardManagementStore.updateCard',
      onSuccess: (updatedCards) => {
        set({ cards: updatedCards });
      },
    });
  },

  deleteCard: async (pan: IBankCard['pan']) => {
    return executeCardOperation({
      operation: () => deleteCardFromDb(pan),
      errorMessage: ERROR_FAILED_TO_DELETE_CARD,
      context: 'CardManagementStore.deleteCard',
      onSuccess: (updatedCards) => {
        set({ cards: updatedCards });
      },
    });
  },

  clearAllCards: async () => {
    return executeCardOperation({
      operation: () => clearAllCardsFromDb(),
      errorMessage: ERROR_FAILED_TO_CLEAR_CARDS,
      context: 'CardManagementStore.clearAllCards',
      onSuccess: (updatedCards) => {
        set({ cards: updatedCards });
      },
    });
  },

  setCards: (cards: IBankCard[]) => {
    set({ cards });
  },

  reorderCards: async (cards: IBankCard[]) => {
    return executeCardOperation({
      operation: () => updateCardsOrderInDb(cards),
      errorMessage: ERROR_FAILED_TO_REORDER_CARDS,
      context: 'CardManagementStore.reorderCards',
      onSuccess: (updatedCards) => {
        set({ cards: updatedCards });
      },
    });
  },
}));
