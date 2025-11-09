import { getDatabase } from './database';

type IDBMode = 'readonly' | 'readwrite';

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
