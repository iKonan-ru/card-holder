import { create, type StoreApi, type UseBoundStore } from 'zustand';
import { useCryptoStore } from '@features/app-lock';
import {
  executeEntityOperation,
  logError,
  type IEncryptedRecordStore,
} from '@shared/lib';
import type {
  IDirectoryStoreActions,
  IDirectoryStoreErrorMessages,
  IDirectoryStoreState,
} from '../types';

interface ICreateDirectoryStoreParams<T extends { id: string }> {
  crud: IEncryptedRecordStore<T>;
  createItem: (id: string, label: string) => T;
  errorMessages: IDirectoryStoreErrorMessages;
  context: string;
}

const getCryptoKey = (): CryptoKey => {
  const key = useCryptoStore.getState().cryptoKey;

  if (!key) {
    throw new Error('CryptoKey not available');
  }

  return key;
};

export const createDirectoryStore = <T extends { id: string }>({
  crud,
  createItem,
  errorMessages,
  context,
}: ICreateDirectoryStoreParams<T>): UseBoundStore<
  StoreApi<IDirectoryStoreState<T> & IDirectoryStoreActions<T>>
> =>
  create((set) => ({
    items: [],
    isLoading: false,

    load: async () => {
      const { isUnlocked } = useCryptoStore.getState();

      if (!isUnlocked) {
        return;
      }

      set({ isLoading: true });

      try {
        const cryptoKey = getCryptoKey();
        const items = await crud.getAll(cryptoKey);

        set({ items, isLoading: false });
      } catch (error) {
        logError({
          message: errorMessages.load,
          error,
          context: `${context}.load`,
        });
        set({ isLoading: false });
      }
    },

    add: async (label: string) => {
      const cryptoKey = getCryptoKey();
      const item = createItem(crypto.randomUUID(), label);

      await executeEntityOperation({
        operation: () => crud.add(item, cryptoKey),
        refetch: () => crud.getAll(cryptoKey),
        errorMessage: errorMessages.add,
        context: `${context}.add`,
        onSuccess: (items) => {
          set({ items });
        },
      });

      return item;
    },

    update: async (item: T) => {
      const cryptoKey = getCryptoKey();

      return executeEntityOperation({
        operation: () => crud.update(item, cryptoKey),
        refetch: () => crud.getAll(cryptoKey),
        errorMessage: errorMessages.update,
        context: `${context}.update`,
        onSuccess: (items) => {
          set({ items });
        },
      });
    },

    remove: async (id: string) => {
      const cryptoKey = getCryptoKey();

      return executeEntityOperation({
        operation: () => crud.remove(id),
        refetch: () => crud.getAll(cryptoKey),
        errorMessage: errorMessages.remove,
        context: `${context}.remove`,
        onSuccess: (items) => {
          set({ items });
        },
      });
    },

    importItems: async (items: T[]) => {
      const cryptoKey = getCryptoKey();

      return executeEntityOperation({
        operation: () => crud.put(items, cryptoKey),
        refetch: () => crud.getAll(cryptoKey),
        errorMessage: errorMessages.importItems,
        context: `${context}.importItems`,
        onSuccess: (updatedItems) => {
          set({ items: updatedItems });
        },
      });
    },
  }));
