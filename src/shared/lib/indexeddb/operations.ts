import { getDatabase } from './database';
import {
  INDEXEDDB_MODE_READONLY,
  INDEXEDDB_MODE_READWRITE,
} from '../constants/constants';

type IDBMode = typeof INDEXEDDB_MODE_READONLY | typeof INDEXEDDB_MODE_READWRITE;

interface IExecuteOperationParams<T> {
  storeName: string;
  mode: IDBMode;
  operation: (store: IDBObjectStore) => IDBRequest<T>;
  errorMessage: string;
}

export const executeIndexedDBOperation = async <T>({
  storeName,
  mode,
  operation,
  errorMessage,
}: IExecuteOperationParams<T>): Promise<T> => {
  const database = await getDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([storeName], mode);
    const store = transaction.objectStore(storeName);
    const request = operation(store);

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(new Error(errorMessage));
    };
  });
};
