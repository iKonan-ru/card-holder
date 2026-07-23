import {
  INDEXEDDB_MODE_READONLY,
  INDEXEDDB_MODE_READWRITE,
} from '../constants';
import {
  decryptRecordFields,
  encryptRecordFields,
  type IStoredEncryptedRecord,
} from '../crypto';
import {
  executeIndexedDBBulkPut,
  executeIndexedDBOperation,
} from './operations';

export interface IRecordStoreErrorMessages {
  getAll: string;
  add: string;
  update: string;
  delete: string;
  put: string;
}

export interface IEncryptedRecordStore<T extends { id: string }> {
  getAll: (cryptoKey: CryptoKey) => Promise<T[]>;
  add: (record: T, cryptoKey: CryptoKey) => Promise<void>;
  update: (record: T, cryptoKey: CryptoKey) => Promise<void>;
  remove: (id: T['id']) => Promise<void>;
  put: (records: T[], cryptoKey: CryptoKey) => Promise<void>;
}

export const createEncryptedRecordStore = <T extends { id: string }>(
  storeName: string,
  errorMessages: IRecordStoreErrorMessages,
): IEncryptedRecordStore<T> => ({
  getAll: async (cryptoKey) => {
    const records = await executeIndexedDBOperation<IStoredEncryptedRecord[]>({
      storeName,
      mode: INDEXEDDB_MODE_READONLY,
      operation: (store) => store.getAll(),
      errorMessage: errorMessages.getAll,
    });

    return Promise.all(
      records.map((record) => decryptRecordFields<T>(record, cryptoKey)),
    );
  },

  add: async (record, cryptoKey) => {
    const encrypted = await encryptRecordFields(record, cryptoKey);

    await executeIndexedDBOperation({
      storeName,
      mode: INDEXEDDB_MODE_READWRITE,
      operation: (store) => store.add(encrypted),
      errorMessage: errorMessages.add,
    });
  },

  update: async (record, cryptoKey) => {
    const encrypted = await encryptRecordFields(record, cryptoKey);

    await executeIndexedDBOperation({
      storeName,
      mode: INDEXEDDB_MODE_READWRITE,
      operation: (store) => store.put(encrypted),
      errorMessage: errorMessages.update,
    });
  },

  remove: async (id) => {
    return executeIndexedDBOperation({
      storeName,
      mode: INDEXEDDB_MODE_READWRITE,
      operation: (store) => store.delete(id),
      errorMessage: errorMessages.delete,
    });
  },

  put: async (records, cryptoKey) => {
    const encryptedRecords = await Promise.all(
      records.map((record) => encryptRecordFields(record, cryptoKey)),
    );

    return executeIndexedDBBulkPut({
      storeName,
      records: encryptedRecords,
      errorMessage: errorMessages.put,
    });
  },
});
