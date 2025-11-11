import type { IBankCard } from '@entities/bank-card';
import { executeIndexedDBOperation } from './operations';
import { CARDS_STORE_NAME } from './constants';
import {
  ERROR_FAILED_TO_ADD_CARD,
  ERROR_FAILED_TO_UPDATE_CARD,
  ERROR_FAILED_TO_DELETE_CARD,
  ERROR_FAILED_TO_GET_CARDS,
  ERROR_FAILED_TO_GET_CARD,
  ERROR_FAILED_TO_CLEAR_CARDS,
  ERROR_FAILED_TO_UPDATE_CARDS_ORDER,
} from '../constants/errors';
import {
  INDEXEDDB_MODE_READONLY,
  INDEXEDDB_MODE_READWRITE,
} from '../constants';
import { getDatabase } from './database';

const sortCardsByOrder = (cards: IBankCard[]): IBankCard[] => {
  return [...cards].sort((cardA, cardB) => cardA.order - cardB.order);
};

export const getAllCards = async (): Promise<IBankCard[]> => {
  const cards = await executeIndexedDBOperation({
    storeName: CARDS_STORE_NAME,
    mode: INDEXEDDB_MODE_READONLY,
    operation: (store) => store.getAll(),
    errorMessage: ERROR_FAILED_TO_GET_CARDS,
  });

  return sortCardsByOrder(cards);
};

export const getCardByPan = async (
  pan: IBankCard['pan']
): Promise<IBankCard | undefined> => {
  return executeIndexedDBOperation({
    storeName: CARDS_STORE_NAME,
    mode: INDEXEDDB_MODE_READONLY,
    operation: (store) => store.get(pan),
    errorMessage: ERROR_FAILED_TO_GET_CARD,
  });
};

export const checkCardExists = async (
  pan: IBankCard['pan']
): Promise<boolean> => {
  const card = await getCardByPan(pan);

  return Boolean(card);
};

export const addCard = async (card: IBankCard): Promise<void> => {
  await executeIndexedDBOperation({
    storeName: CARDS_STORE_NAME,
    mode: INDEXEDDB_MODE_READWRITE,
    operation: (store) => store.add(card),
    errorMessage: ERROR_FAILED_TO_ADD_CARD,
  });
};

export const updateCard = async (card: IBankCard): Promise<void> => {
  await executeIndexedDBOperation({
    storeName: CARDS_STORE_NAME,
    mode: INDEXEDDB_MODE_READWRITE,
    operation: (store) => store.put(card),
    errorMessage: ERROR_FAILED_TO_UPDATE_CARD,
  });
};

export const deleteCard = async (pan: IBankCard['pan']): Promise<void> => {
  return executeIndexedDBOperation({
    storeName: CARDS_STORE_NAME,
    mode: INDEXEDDB_MODE_READWRITE,
    operation: (store) => store.delete(pan),
    errorMessage: ERROR_FAILED_TO_DELETE_CARD,
  });
};

export const clearAllCards = async (): Promise<void> => {
  return executeIndexedDBOperation({
    storeName: CARDS_STORE_NAME,
    mode: INDEXEDDB_MODE_READWRITE,
    operation: (store) => store.clear(),
    errorMessage: ERROR_FAILED_TO_CLEAR_CARDS,
  });
};

export const updateCardsOrder = async (cards: IBankCard[]): Promise<void> => {
  const database = await getDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(
      [CARDS_STORE_NAME],
      INDEXEDDB_MODE_READWRITE
    );
    const store = transaction.objectStore(CARDS_STORE_NAME);

    cards.forEach((card, index) => {
      const updatedCard: IBankCard = {
        ...card,
        order: index,
      };
      store.put(updatedCard);
    });

    transaction.oncomplete = () => {
      resolve();
    };

    transaction.onerror = () => {
      reject(new Error(ERROR_FAILED_TO_UPDATE_CARDS_ORDER));
    };
  });
};
