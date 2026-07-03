import type { IBankCard } from '@entities/bank-card';
import type { IOwner } from '@entities/card-owner';
import type { ICardType } from '@entities/card-type';
import type { ICardFilters, TSortDirection, TSortKey } from '../types/view';
import { applyFilters } from './filtering';
import { compareCards } from './sorting';

export interface ISelectVisibleCardsParams {
  sortKey: TSortKey;
  sortDirection: TSortDirection;
  filters: ICardFilters;
  cardTypes: ICardType[];
  owners: IOwner[];
}

export const selectVisibleCards = (
  cards: IBankCard[],
  params: ISelectVisibleCardsParams,
): IBankCard[] => {
  const filtered = applyFilters(cards, params.filters);

  return [...filtered].sort((a, b) => compareCards(a, b, params));
};
