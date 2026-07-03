import { ERROR_FAILED_TO_OPEN_DATABASE } from '../constants';
import {
  CARD_TYPES_KEY_PATH,
  CARD_TYPES_STORE_NAME,
  CARDS_KEY_PATH,
  CARDS_ORDER_INDEX,
  CARDS_STORE_NAME,
  DATABASE_NAME,
  DATABASE_VERSION,
  INDEX_UNIQUE_FALSE,
  OWNERS_KEY_PATH,
  OWNERS_STORE_NAME,
} from './constants';

let databaseInstance: IDBDatabase | null = null;

const checkIsIDBOpenDBRequest = (
  target: EventTarget | null,
): target is IDBOpenDBRequest => {
  return target !== null && 'result' in target && 'transaction' in target;
};

export const initDatabase = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (databaseInstance) {
      resolve(databaseInstance);

      return;
    }

    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

    request.onerror = () => {
      reject(new Error(ERROR_FAILED_TO_OPEN_DATABASE));
    };

    request.onsuccess = () => {
      databaseInstance = request.result;
      resolve(databaseInstance);
    };

    request.onupgradeneeded = (event) => {
      if (!checkIsIDBOpenDBRequest(event.target)) {
        return;
      }

      const database = event.target.result;

      if (database.objectStoreNames.contains(CARDS_STORE_NAME)) {
        database.deleteObjectStore(CARDS_STORE_NAME);
      }

      const cardsStore = database.createObjectStore(CARDS_STORE_NAME, {
        keyPath: CARDS_KEY_PATH,
      });
      cardsStore.createIndex(CARDS_ORDER_INDEX, CARDS_ORDER_INDEX, {
        unique: INDEX_UNIQUE_FALSE,
      });

      if (database.objectStoreNames.contains(CARD_TYPES_STORE_NAME)) {
        database.deleteObjectStore(CARD_TYPES_STORE_NAME);
      }

      database.createObjectStore(CARD_TYPES_STORE_NAME, {
        keyPath: CARD_TYPES_KEY_PATH,
      });

      if (database.objectStoreNames.contains(OWNERS_STORE_NAME)) {
        database.deleteObjectStore(OWNERS_STORE_NAME);
      }

      database.createObjectStore(OWNERS_STORE_NAME, {
        keyPath: OWNERS_KEY_PATH,
      });
    };
  });
};

export const getDatabase = async (): Promise<IDBDatabase> => {
  if (!databaseInstance) {
    return initDatabase();
  }

  return databaseInstance;
};
