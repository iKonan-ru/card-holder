import type { IBankCard } from '@entities/bank-card';
import type { ICardFilters } from '../types/view';
import {
  FACET_LIST,
  type IFacetContext,
  type IFacetDescriptor,
} from './facets';

export interface IFacetOption {
  value: string;
  label: string;
}

export interface IFilterFacetOptions {
  key: keyof ICardFilters;
  title: string;
  options: IFacetOption[];
}

const selectFacetOptions = (
  cards: IBankCard[],
  facet: IFacetDescriptor,
  ctx: IFacetContext,
): IFacetOption[] => {
  const labelById = new Map<string, string>();

  cards.forEach((card) => {
    const id = facet.resolveFilterId(card);

    if (id === null || labelById.has(id)) {
      return;
    }

    labelById.set(id, facet.resolveFilterLabel(card, ctx) ?? id);
  });

  return Array.from(labelById, ([value, label]) => ({ value, label }));
};

export const selectFilterFacetOptions = (
  cards: IBankCard[],
  ctx: IFacetContext,
): IFilterFacetOptions[] =>
  FACET_LIST.map((facet) => ({
    key: facet.filterKey,
    title: facet.filterTitle,
    options: selectFacetOptions(cards, facet, ctx),
  }));
