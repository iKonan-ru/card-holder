import type { IBankCard } from '@entities/bank-card';
import { ERROR_NO_CARDS_TO_EXPORT } from '../constants';
import type { IExportData } from '../types';

export const validateCardsForExport = (cards: IBankCard[]): void => {
  const hasCards = cards.length > 0;

  if (!hasCards) {
    throw new Error(ERROR_NO_CARDS_TO_EXPORT);
  }
};

export const prepareExportData = (data: IExportData): string => {
  return JSON.stringify(data);
};
