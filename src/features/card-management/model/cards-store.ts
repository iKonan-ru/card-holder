import { create, type StoreApi, type UseBoundStore } from 'zustand';
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
  executeEntityOperation,
  getAllCards,
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
  INITIAL_CARDS,
  INITIAL_FLIPPED_PAN,
  INITIAL_IS_LOADING,
  INITIAL_IS_REORDER_MODE,
} from '../constants';
import type { ICardsActions, ICardsState } from '../types';

const getCryptoKey = (): CryptoKey => {
  const key = useCryptoStore.getState().cryptoKey;

  if (!key) {
    throw new Error('CryptoKey not available');
  }

  return key;
};

export const useCardsStore: UseBoundStore<
  StoreApi<ICardsState & ICardsActions>
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

    return executeEntityOperation({
      operation: () => addCardToDb(cardWithOrder, cryptoKey),
      refetch: () => getAllCards(cryptoKey),
      errorMessage: ERROR_FAILED_TO_ADD_CARD,
      context: 'CardManagementStore.addCard',
      onSuccess: (updatedCards) => {
        set({ cards: updatedCards });
      },
    });
  },

  updateCard: async (card: IBankCard) => {
    const cryptoKey = getCryptoKey();
    const hasOrder = typeof card.order === TYPE_NUMBER;
    const existingCard = get().cards.find(
      (currentCard) => currentCard.id === card.id,
    );
    const cardOrder = hasOrder
      ? card.order
      : (existingCard?.order ?? DEFAULT_CARD_ORDER);
    const cardWithOrder: IBankCard = { ...card, order: cardOrder };

    return executeEntityOperation({
      operation: () => updateCardInDb(cardWithOrder, cryptoKey),
      refetch: () => getAllCards(cryptoKey),
      errorMessage: ERROR_FAILED_TO_UPDATE_CARD,
      context: 'CardManagementStore.updateCard',
      onSuccess: (updatedCards) => {
        set({ cards: updatedCards });
      },
    });
  },

  deleteCard: async (id: IBankCard['id']) => {
    const cryptoKey = getCryptoKey();

    return executeEntityOperation({
      operation: () => deleteCardFromDb(id),
      refetch: () => getAllCards(cryptoKey),
      errorMessage: ERROR_FAILED_TO_DELETE_CARD,
      context: 'CardManagementStore.deleteCard',
      onSuccess: (updatedCards) => {
        set({ cards: updatedCards });
      },
    });
  },

  clearAllCards: async () => {
    const cryptoKey = getCryptoKey();

    return executeEntityOperation({
      operation: () => clearAllCardsFromDb(),
      refetch: () => getAllCards(cryptoKey),
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
    const cryptoKey = getCryptoKey();

    return executeEntityOperation({
      operation: () => updateCardsOrderInDb(cards, cryptoKey),
      refetch: () => getAllCards(cryptoKey),
      errorMessage: ERROR_FAILED_TO_REORDER_CARDS,
      context: 'CardManagementStore.reorderCards',
      onSuccess: (updatedCards) => {
        set({ cards: updatedCards });
      },
    });
  },
}));
