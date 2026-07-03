import type { ICardType } from '@entities/card-type';
import {
  ERROR_FAILED_TO_ADD_CARD_TYPE,
  ERROR_FAILED_TO_DELETE_CARD_TYPE,
  ERROR_FAILED_TO_GET_CARD_TYPES,
  ERROR_FAILED_TO_UPDATE_CARD_TYPE,
  INDEXEDDB_MODE_READONLY,
  INDEXEDDB_MODE_READWRITE,
} from '../constants';
import {
  decryptRecordFields,
  encryptRecordFields,
  type IStoredEncryptedRecord,
} from '../crypto';
import { CARD_TYPES_STORE_NAME } from './constants';
import { executeIndexedDBOperation } from './operations';

export const getAllCardTypes = async (
  cryptoKey: CryptoKey,
): Promise<ICardType[]> => {
  const records = await executeIndexedDBOperation<IStoredEncryptedRecord[]>({
    storeName: CARD_TYPES_STORE_NAME,
    mode: INDEXEDDB_MODE_READONLY,
    operation: (store) => store.getAll(),
    errorMessage: ERROR_FAILED_TO_GET_CARD_TYPES,
  });

  return Promise.all(
    records.map((record) => decryptRecordFields<ICardType>(record, cryptoKey)),
  );
};

export const addCardType = async (
  cardType: ICardType,
  cryptoKey: CryptoKey,
): Promise<void> => {
  const encrypted = await encryptRecordFields(cardType, cryptoKey);

  await executeIndexedDBOperation({
    storeName: CARD_TYPES_STORE_NAME,
    mode: INDEXEDDB_MODE_READWRITE,
    operation: (store) => store.add(encrypted),
    errorMessage: ERROR_FAILED_TO_ADD_CARD_TYPE,
  });
};

export const updateCardType = async (
  cardType: ICardType,
  cryptoKey: CryptoKey,
): Promise<void> => {
  const encrypted = await encryptRecordFields(cardType, cryptoKey);

  await executeIndexedDBOperation({
    storeName: CARD_TYPES_STORE_NAME,
    mode: INDEXEDDB_MODE_READWRITE,
    operation: (store) => store.put(encrypted),
    errorMessage: ERROR_FAILED_TO_UPDATE_CARD_TYPE,
  });
};

export const deleteCardType = async (id: ICardType['id']): Promise<void> => {
  return executeIndexedDBOperation({
    storeName: CARD_TYPES_STORE_NAME,
    mode: INDEXEDDB_MODE_READWRITE,
    operation: (store) => store.delete(id),
    errorMessage: ERROR_FAILED_TO_DELETE_CARD_TYPE,
  });
};
