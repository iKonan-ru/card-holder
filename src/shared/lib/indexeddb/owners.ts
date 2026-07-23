import type { IOwner } from '@entities/card-owner';
import {
  ERROR_FAILED_TO_ADD_OWNER,
  ERROR_FAILED_TO_DELETE_OWNER,
  ERROR_FAILED_TO_GET_OWNERS,
  ERROR_FAILED_TO_IMPORT_OWNERS,
  ERROR_FAILED_TO_UPDATE_OWNER,
} from '../constants';
import { OWNERS_STORE_NAME } from './constants';
import { createEncryptedRecordStore } from './create-record-store';

const ownersStore = createEncryptedRecordStore<IOwner>(OWNERS_STORE_NAME, {
  getAll: ERROR_FAILED_TO_GET_OWNERS,
  add: ERROR_FAILED_TO_ADD_OWNER,
  update: ERROR_FAILED_TO_UPDATE_OWNER,
  delete: ERROR_FAILED_TO_DELETE_OWNER,
  put: ERROR_FAILED_TO_IMPORT_OWNERS,
});

export const getAllOwners = ownersStore.getAll;
export const addOwner = ownersStore.add;
export const updateOwner = ownersStore.update;
export const deleteOwner = ownersStore.remove;
export const putOwners = ownersStore.put;
