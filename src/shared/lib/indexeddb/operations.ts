import { getDatabase } from './database';

type IDBMode = 'readonly' | 'readwrite';

interface IExecuteOperationParams<T> {
  storeName: string;
  mode: IDBMode;
  operation: (store: IDBObjectStore) => IDBRequest<T>;
  errorMessage: string;
}

/**
 * Выполняет операцию с IndexedDB в контексте транзакции
 * @template T - Тип возвращаемого значения операции
 * @param params - Параметры операции
 * @param params.storeName - Имя object store
 * @param params.mode - Режим транзакции (readonly/readwrite)
 * @param params.operation - Функция выполняющая операцию с store
 * @param params.errorMessage - Сообщение об ошибке
 * @returns Промис с результатом операции
 * @throws Ошибка с указанным сообщением если операция не удалась
 */
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
