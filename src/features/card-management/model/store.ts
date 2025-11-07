import { create } from 'zustand';
import type { ICardManagementState, ICardManagementActions } from './types';
import type { IBankCard } from '@entities/bank-card';
import { DEFAULT_CARD_ORDER } from './constants';
import {
  getAllCards,
  getCardByPan,
  addCard as addCardToDb,
  updateCard as updateCardInDb,
  deleteCard as deleteCardFromDb,
  updateCardsOrder as updateCardsOrderInDb,
  initDatabase,
  logError,
  ERROR_FAILED_TO_LOAD_CARDS,
  ERROR_FAILED_TO_ADD_CARD,
  ERROR_FAILED_TO_UPDATE_CARD,
  ERROR_FAILED_TO_DELETE_CARD,
  ERROR_FAILED_TO_REORDER_CARDS,
} from '@shared/lib';
import { executeCardOperation } from '../lib';

export const useCardManagementStore = create<
  ICardManagementState & ICardManagementActions
>((set) => ({
  cards: [],
  flippedPan: null,
  isLoading: false,
  isReorderMode: false,

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

  toggleReorderMode: () => {
    set((state) => ({
      isReorderMode: !state.isReorderMode,
      flippedPan: !state.isReorderMode ? null : state.flippedPan,
    }));
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
    const hasOrder = typeof card.order === 'number';

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
