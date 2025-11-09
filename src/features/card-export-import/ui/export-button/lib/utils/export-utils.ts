import type { IBankCard } from '@entities/bank-card';
import { ERROR_NO_CARDS_TO_EXPORT } from '../constants';

export const validateCardsForExport = (cards: IBankCard[]): void => {
  const hasCards = cards.length > 0;

  if (!hasCards) {
    throw new Error(ERROR_NO_CARDS_TO_EXPORT);
  }
};

export const prepareCardsForExport = (cards: IBankCard[]): string => {
  return JSON.stringify(cards);
};
