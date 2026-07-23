import type { ICardType } from '@entities/card-type';
import {
  ERROR_FAILED_TO_ADD_CARD_TYPE,
  ERROR_FAILED_TO_DELETE_CARD_TYPE,
  ERROR_FAILED_TO_GET_CARD_TYPES,
  ERROR_FAILED_TO_IMPORT_CARD_TYPES,
  ERROR_FAILED_TO_UPDATE_CARD_TYPE,
} from '../constants';
import { CARD_TYPES_STORE_NAME } from './constants';
import { createEncryptedRecordStore } from './create-record-store';

const cardTypesStore = createEncryptedRecordStore<ICardType>(
  CARD_TYPES_STORE_NAME,
  {
    getAll: ERROR_FAILED_TO_GET_CARD_TYPES,
    add: ERROR_FAILED_TO_ADD_CARD_TYPE,
    update: ERROR_FAILED_TO_UPDATE_CARD_TYPE,
    delete: ERROR_FAILED_TO_DELETE_CARD_TYPE,
    put: ERROR_FAILED_TO_IMPORT_CARD_TYPES,
  },
);

export const getAllCardTypes = cardTypesStore.getAll;
export const addCardType = cardTypesStore.add;
export const updateCardType = cardTypesStore.update;
export const deleteCardType = cardTypesStore.remove;
export const putCardTypes = cardTypesStore.put;
