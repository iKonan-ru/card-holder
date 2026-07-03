import { create, type StoreApi, type UseBoundStore } from 'zustand';
import { useCryptoStore } from '@features/app-lock';
import type { ICardType } from '@entities/card-type';
import {
  addCardType as addCardTypeToDb,
  deleteCardType as deleteCardTypeFromDb,
  ERROR_FAILED_TO_ADD_CARD_TYPE,
  ERROR_FAILED_TO_DELETE_CARD_TYPE,
  ERROR_FAILED_TO_UPDATE_CARD_TYPE,
  getAllCardTypes,
  logError,
  updateCardType as updateCardTypeInDb,
} from '@shared/lib';
import {
  ERROR_FAILED_TO_LOAD_CARD_TYPES,
  INITIAL_CARD_TYPES,
  INITIAL_IS_LOADING,
} from '../constants';
import { executeCardTypeOperation } from '../utils';
import type {
  ICardTypesManagementActions,
  ICardTypesManagementState,
} from './types';

const getCryptoKey = (): CryptoKey => {
  const key = useCryptoStore.getState().cryptoKey;

  if (!key) {
    throw new Error('CryptoKey not available');
  }

  return key;
};

export const useCardTypesManagementStore: UseBoundStore<
  StoreApi<ICardTypesManagementState & ICardTypesManagementActions>
> = create((set) => ({
  cardTypes: INITIAL_CARD_TYPES,
  isLoading: INITIAL_IS_LOADING,

  loadCardTypes: async () => {
    const { isUnlocked } = useCryptoStore.getState();

    if (!isUnlocked) {
      return;
    }

    set({ isLoading: true });

    try {
      const cryptoKey = getCryptoKey();
      const cardTypes = await getAllCardTypes(cryptoKey);

      set({ cardTypes, isLoading: false });
    } catch (error) {
      logError({
        message: ERROR_FAILED_TO_LOAD_CARD_TYPES,
        error,
        context: 'CardTypesManagementStore.loadCardTypes',
      });
      set({ isLoading: false });
    }
  },

  addCardType: async (name: string) => {
    const cryptoKey = getCryptoKey();
    const cardType: ICardType = { id: crypto.randomUUID(), name };

    return executeCardTypeOperation({
      operation: () => addCardTypeToDb(cardType, cryptoKey),
      errorMessage: ERROR_FAILED_TO_ADD_CARD_TYPE,
      context: 'CardTypesManagementStore.addCardType',
      cryptoKey,
      onSuccess: (cardTypes) => {
        set({ cardTypes });
      },
    });
  },

  updateCardType: async (cardType: ICardType) => {
    const cryptoKey = getCryptoKey();

    return executeCardTypeOperation({
      operation: () => updateCardTypeInDb(cardType, cryptoKey),
      errorMessage: ERROR_FAILED_TO_UPDATE_CARD_TYPE,
      context: 'CardTypesManagementStore.updateCardType',
      cryptoKey,
      onSuccess: (cardTypes) => {
        set({ cardTypes });
      },
    });
  },

  deleteCardType: async (id: string) => {
    const cryptoKey = getCryptoKey();

    return executeCardTypeOperation({
      operation: () => deleteCardTypeFromDb(id),
      errorMessage: ERROR_FAILED_TO_DELETE_CARD_TYPE,
      context: 'CardTypesManagementStore.deleteCardType',
      cryptoKey,
      onSuccess: (cardTypes) => {
        set({ cardTypes });
      },
    });
  },
}));
