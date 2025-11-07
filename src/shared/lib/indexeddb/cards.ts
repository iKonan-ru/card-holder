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
import { getDatabase } from './database';

const sortCardsByOrder = (cards: IBankCard[]): IBankCard[] => {
  return [...cards].sort((cardA, cardB) => cardA.order - cardB.order);
};

/**
 * Получает все банковские карты из IndexedDB отсортированные по полю order
 * @returns Промис с массивом всех карт
 * @throws Ошибка если операция с базой данных не удалась
 */
export const getAllCards = async (): Promise<IBankCard[]> => {
  const cards = await executeIndexedDBOperation({
    storeName: CARDS_STORE_NAME,
    mode: 'readonly',
    operation: (store) => store.getAll(),
    errorMessage: ERROR_FAILED_TO_GET_CARDS,
  });

  return sortCardsByOrder(cards);
};

/**
 * Получает банковскую карту по номеру PAN
 * @param pan - Номер карты
 * @returns Промис с картой или undefined если карта не найдена
 * @throws Ошибка если операция с базой данных не удалась
 */
export const getCardByPan = async (
  pan: IBankCard['pan']
): Promise<IBankCard | undefined> => {
  return executeIndexedDBOperation({
    storeName: CARDS_STORE_NAME,
    mode: 'readonly',
    operation: (store) => store.get(pan),
    errorMessage: ERROR_FAILED_TO_GET_CARD,
  });
};

/**
 * Проверяет существование карты с указанным PAN в базе данных
 * @param pan - Номер карты для проверки
 * @returns Промис с true если карта существует, иначе false
 */
export const checkCardExists = async (
  pan: IBankCard['pan']
): Promise<boolean> => {
  const card = await getCardByPan(pan);

  return Boolean(card);
};

/**
 * Добавляет новую банковскую карту в IndexedDB
 * @param card - Данные карты для добавления
 * @returns Промис без значения
 * @throws Ошибка если карта с таким PAN уже существует или операция не удалась
 */
export const addCard = async (card: IBankCard): Promise<void> => {
  await executeIndexedDBOperation({
    storeName: CARDS_STORE_NAME,
    mode: 'readwrite',
    operation: (store) => store.add(card),
    errorMessage: ERROR_FAILED_TO_ADD_CARD,
  });
};

/**
 * Обновляет существующую банковскую карту в IndexedDB
 * @param card - Обновлённые данные карты
 * @returns Промис без значения
 * @throws Ошибка если операция обновления не удалась
 */
export const updateCard = async (card: IBankCard): Promise<void> => {
  await executeIndexedDBOperation({
    storeName: CARDS_STORE_NAME,
    mode: 'readwrite',
    operation: (store) => store.put(card),
    errorMessage: ERROR_FAILED_TO_UPDATE_CARD,
  });
};

/**
 * Удаляет банковскую карту из IndexedDB по номеру PAN
 * @param pan - Номер карты для удаления
 * @returns Промис без значения
 * @throws Ошибка если операция удаления не удалась
 */
export const deleteCard = async (pan: IBankCard['pan']): Promise<void> => {
  return executeIndexedDBOperation({
    storeName: CARDS_STORE_NAME,
    mode: 'readwrite',
    operation: (store) => store.delete(pan),
    errorMessage: ERROR_FAILED_TO_DELETE_CARD,
  });
};

/**
 * Удаляет все банковские карты из IndexedDB
 * @returns Промис без значения
 * @throws Ошибка если операция очистки не удалась
 */
export const clearAllCards = async (): Promise<void> => {
  return executeIndexedDBOperation({
    storeName: CARDS_STORE_NAME,
    mode: 'readwrite',
    operation: (store) => store.clear(),
    errorMessage: ERROR_FAILED_TO_CLEAR_CARDS,
  });
};

/**
 * Обновляет порядок карт в IndexedDB в рамках одной транзакции
 * @param cards - Массив карт с обновлёнными значениями order
 * @returns Промис без значения
 * @throws Ошибка если транзакция не удалась
 */
export const updateCardsOrder = async (cards: IBankCard[]): Promise<void> => {
  const database = await getDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([CARDS_STORE_NAME], 'readwrite');
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
