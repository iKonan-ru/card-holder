import type { IOwner } from '@entities/card-owner';
import {
  ERROR_FAILED_TO_ADD_OWNER,
  ERROR_FAILED_TO_DELETE_OWNER,
  ERROR_FAILED_TO_GET_OWNERS,
  ERROR_FAILED_TO_IMPORT_OWNERS,
  ERROR_FAILED_TO_UPDATE_OWNER,
  INDEXEDDB_MODE_READONLY,
  INDEXEDDB_MODE_READWRITE,
} from '../constants';
import {
  decryptRecordFields,
  encryptRecordFields,
  type IStoredEncryptedRecord,
} from '../crypto';
import { OWNERS_STORE_NAME } from './constants';
import { getDatabase } from './database';
import { executeIndexedDBOperation } from './operations';

export const getAllOwners = async (cryptoKey: CryptoKey): Promise<IOwner[]> => {
  const records = await executeIndexedDBOperation<IStoredEncryptedRecord[]>({
    storeName: OWNERS_STORE_NAME,
    mode: INDEXEDDB_MODE_READONLY,
    operation: (store) => store.getAll(),
    errorMessage: ERROR_FAILED_TO_GET_OWNERS,
  });

  return Promise.all(
    records.map((record) => decryptRecordFields<IOwner>(record, cryptoKey)),
  );
};

export const addOwner = async (
  owner: IOwner,
  cryptoKey: CryptoKey,
): Promise<void> => {
  const encrypted = await encryptRecordFields(owner, cryptoKey);

  await executeIndexedDBOperation({
    storeName: OWNERS_STORE_NAME,
    mode: INDEXEDDB_MODE_READWRITE,
    operation: (store) => store.add(encrypted),
    errorMessage: ERROR_FAILED_TO_ADD_OWNER,
  });
};

export const updateOwner = async (
  owner: IOwner,
  cryptoKey: CryptoKey,
): Promise<void> => {
  const encrypted = await encryptRecordFields(owner, cryptoKey);

  await executeIndexedDBOperation({
    storeName: OWNERS_STORE_NAME,
    mode: INDEXEDDB_MODE_READWRITE,
    operation: (store) => store.put(encrypted),
    errorMessage: ERROR_FAILED_TO_UPDATE_OWNER,
  });
};

export const deleteOwner = async (id: IOwner['id']): Promise<void> => {
  return executeIndexedDBOperation({
    storeName: OWNERS_STORE_NAME,
    mode: INDEXEDDB_MODE_READWRITE,
    operation: (store) => store.delete(id),
    errorMessage: ERROR_FAILED_TO_DELETE_OWNER,
  });
};

export const putOwners = async (
  owners: IOwner[],
  cryptoKey: CryptoKey,
): Promise<void> => {
  const encryptedRecords = await Promise.all(
    owners.map((owner) => encryptRecordFields(owner, cryptoKey)),
  );

  const database = await getDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(
      [OWNERS_STORE_NAME],
      INDEXEDDB_MODE_READWRITE,
    );
    const store = transaction.objectStore(OWNERS_STORE_NAME);

    encryptedRecords.forEach((record) => {
      store.put(record);
    });

    transaction.oncomplete = () => {
      resolve();
    };

    transaction.onerror = () => {
      reject(new Error(ERROR_FAILED_TO_IMPORT_OWNERS));
    };
  });
};
