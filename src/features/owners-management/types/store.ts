import { create, type StoreApi, type UseBoundStore } from 'zustand';
import { useCryptoStore } from '@features/app-lock';
import type { IOwner } from '@entities/card-owner';
import {
  addOwner as addOwnerToDb,
  deleteOwner as deleteOwnerFromDb,
  ERROR_FAILED_TO_ADD_OWNER,
  ERROR_FAILED_TO_DELETE_OWNER,
  ERROR_FAILED_TO_UPDATE_OWNER,
  getAllOwners,
  logError,
  updateOwner as updateOwnerInDb,
} from '@shared/lib';
import {
  ERROR_FAILED_TO_LOAD_OWNERS,
  INITIAL_IS_LOADING,
  INITIAL_OWNERS,
} from '../constants';
import { executeOwnerOperation } from '../utils';
import type { IOwnersManagementActions, IOwnersManagementState } from './types';

const getCryptoKey = (): CryptoKey => {
  const key = useCryptoStore.getState().cryptoKey;

  if (!key) {
    throw new Error('CryptoKey not available');
  }

  return key;
};

export const useOwnersManagementStore: UseBoundStore<
  StoreApi<IOwnersManagementState & IOwnersManagementActions>
> = create((set) => ({
  owners: INITIAL_OWNERS,
  isLoading: INITIAL_IS_LOADING,

  loadOwners: async () => {
    const { isUnlocked } = useCryptoStore.getState();

    if (!isUnlocked) {
      return;
    }

    set({ isLoading: true });

    try {
      const cryptoKey = getCryptoKey();
      const owners = await getAllOwners(cryptoKey);

      set({ owners, isLoading: false });
    } catch (error) {
      logError({
        message: ERROR_FAILED_TO_LOAD_OWNERS,
        error,
        context: 'OwnersManagementStore.loadOwners',
      });
      set({ isLoading: false });
    }
  },

  addOwner: async (realName: string, aliases: string[]) => {
    const cryptoKey = getCryptoKey();
    const owner: IOwner = { id: crypto.randomUUID(), realName, aliases };

    await executeOwnerOperation({
      operation: () => addOwnerToDb(owner, cryptoKey),
      errorMessage: ERROR_FAILED_TO_ADD_OWNER,
      context: 'OwnersManagementStore.addOwner',
      cryptoKey,
      onSuccess: (owners) => {
        set({ owners });
      },
    });

    return owner;
  },

  updateOwner: async (owner: IOwner) => {
    const cryptoKey = getCryptoKey();

    return executeOwnerOperation({
      operation: () => updateOwnerInDb(owner, cryptoKey),
      errorMessage: ERROR_FAILED_TO_UPDATE_OWNER,
      context: 'OwnersManagementStore.updateOwner',
      cryptoKey,
      onSuccess: (owners) => {
        set({ owners });
      },
    });
  },

  deleteOwner: async (id: string) => {
    const cryptoKey = getCryptoKey();

    return executeOwnerOperation({
      operation: () => deleteOwnerFromDb(id),
      errorMessage: ERROR_FAILED_TO_DELETE_OWNER,
      context: 'OwnersManagementStore.deleteOwner',
      cryptoKey,
      onSuccess: (owners) => {
        set({ owners });
      },
    });
  },
}));
