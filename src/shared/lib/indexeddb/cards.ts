import type { IBankCard } from '@entities/bank-card';
import {
  ERROR_FAILED_TO_ADD_CARD,
  ERROR_FAILED_TO_CLEAR_CARDS,
  ERROR_FAILED_TO_DELETE_CARD,
  ERROR_FAILED_TO_GET_CARDS,
  ERROR_FAILED_TO_UPDATE_CARD,
  ERROR_FAILED_TO_UPDATE_CARDS_ORDER,
  INDEXEDDB_MODE_READONLY,
  INDEXEDDB_MODE_READWRITE,
} from '../constants';
import {
  decryptCardFields,
  encryptCardFields,
  type IStoredEncryptedCard,
} from '../crypto';
import { CARDS_STORE_NAME } from './constants';
import {
  executeIndexedDBBulkPut,
  executeIndexedDBOperation,
} from './operations';

const sortCardsByOrder = (cards: IBankCard[]): IBankCard[] => {
  return [...cards].sort((cardA, cardB) => cardA.order - cardB.order);
};

export const getAllCards = async (
  cryptoKey: CryptoKey,
): Promise<IBankCard[]> => {
  const records = await executeIndexedDBOperation<IStoredEncryptedCard[]>({
    storeName: CARDS_STORE_NAME,
    mode: INDEXEDDB_MODE_READONLY,
    operation: (store) => store.getAll(),
    errorMessage: ERROR_FAILED_TO_GET_CARDS,
  });

  const cards = await Promise.all(
    records.map((record) => decryptCardFields(record, cryptoKey)),
  );

  return sortCardsByOrder(cards);
};

export const addCard = async (
  card: IBankCard,
  cryptoKey: CryptoKey,
): Promise<void> => {
  const encrypted = await encryptCardFields(card, cryptoKey);

  await executeIndexedDBOperation({
    storeName: CARDS_STORE_NAME,
    mode: INDEXEDDB_MODE_READWRITE,
    operation: (store) => store.add(encrypted),
    errorMessage: ERROR_FAILED_TO_ADD_CARD,
  });
};

export const updateCard = async (
  card: IBankCard,
  cryptoKey: CryptoKey,
): Promise<void> => {
  const encrypted = await encryptCardFields(card, cryptoKey);

  await executeIndexedDBOperation({
    storeName: CARDS_STORE_NAME,
    mode: INDEXEDDB_MODE_READWRITE,
    operation: (store) => store.put(encrypted),
    errorMessage: ERROR_FAILED_TO_UPDATE_CARD,
  });
};

export const deleteCard = async (id: IBankCard['id']): Promise<void> => {
  return executeIndexedDBOperation({
    storeName: CARDS_STORE_NAME,
    mode: INDEXEDDB_MODE_READWRITE,
    operation: (store) => store.delete(id),
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

export const updateCardsOrder = async (
  cards: IBankCard[],
  cryptoKey: CryptoKey,
): Promise<void> => {
  const encryptedRecords = await Promise.all(
    cards.map((card, index) =>
      encryptCardFields({ ...card, order: index }, cryptoKey),
    ),
  );

  return executeIndexedDBBulkPut({
    storeName: CARDS_STORE_NAME,
    records: encryptedRecords,
    errorMessage: ERROR_FAILED_TO_UPDATE_CARDS_ORDER,
  });
};
