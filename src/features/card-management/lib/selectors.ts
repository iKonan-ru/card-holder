import type { IBankCard } from '@entities/bank-card';
import type { ICardFilters } from '../types/view';
import { applyFilters } from './filtering';
import { compareCards, type ICompareCardsParams } from './sorting';

export interface ISelectVisibleCardsParams extends ICompareCardsParams {
  filters: ICardFilters;
}

export const selectVisibleCards = (
  cards: IBankCard[],
  params: ISelectVisibleCardsParams,
): IBankCard[] => {
  const filtered = applyFilters(cards, params.filters);

  return [...filtered].sort((a, b) => compareCards(a, b, params));
};
