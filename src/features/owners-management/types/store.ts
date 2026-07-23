import { createDirectoryStore } from '@features/directory-store';
import type { IOwner } from '@entities/card-owner';
import {
  addOwner,
  deleteOwner,
  ERROR_FAILED_TO_ADD_OWNER,
  ERROR_FAILED_TO_DELETE_OWNER,
  ERROR_FAILED_TO_IMPORT_OWNERS,
  ERROR_FAILED_TO_UPDATE_OWNER,
  getAllOwners,
  putOwners,
  updateOwner,
} from '@shared/lib';
import { ERROR_FAILED_TO_LOAD_OWNERS } from '../constants';

export const useOwnersManagementStore = createDirectoryStore<IOwner>({
  crud: {
    getAll: getAllOwners,
    add: addOwner,
    update: updateOwner,
    remove: deleteOwner,
    put: putOwners,
  },
  createItem: (id, realName) => ({ id, realName }),
  errorMessages: {
    load: ERROR_FAILED_TO_LOAD_OWNERS,
    add: ERROR_FAILED_TO_ADD_OWNER,
    update: ERROR_FAILED_TO_UPDATE_OWNER,
    remove: ERROR_FAILED_TO_DELETE_OWNER,
    importItems: ERROR_FAILED_TO_IMPORT_OWNERS,
  },
  context: 'OwnersManagementStore',
});
