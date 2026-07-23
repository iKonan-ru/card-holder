import { createDirectoryStore } from '@features/directory-store';
import type { ICardType } from '@entities/card-type';
import {
  addCardType,
  deleteCardType,
  ERROR_FAILED_TO_ADD_CARD_TYPE,
  ERROR_FAILED_TO_DELETE_CARD_TYPE,
  ERROR_FAILED_TO_IMPORT_CARD_TYPES,
  ERROR_FAILED_TO_UPDATE_CARD_TYPE,
  getAllCardTypes,
  putCardTypes,
  updateCardType,
} from '@shared/lib';
import { ERROR_FAILED_TO_LOAD_CARD_TYPES } from '../constants';

export const useCardTypesManagementStore = createDirectoryStore<ICardType>({
  crud: {
    getAll: getAllCardTypes,
    add: addCardType,
    update: updateCardType,
    remove: deleteCardType,
    put: putCardTypes,
  },
  createItem: (id, name) => ({ id, name }),
  errorMessages: {
    load: ERROR_FAILED_TO_LOAD_CARD_TYPES,
    add: ERROR_FAILED_TO_ADD_CARD_TYPE,
    update: ERROR_FAILED_TO_UPDATE_CARD_TYPE,
    remove: ERROR_FAILED_TO_DELETE_CARD_TYPE,
    importItems: ERROR_FAILED_TO_IMPORT_CARD_TYPES,
  },
  context: 'CardTypesManagementStore',
});
