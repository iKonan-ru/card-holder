import type { IBankCard } from '@entities/bank-card';
import type { ICardFilters } from '../types/view';
import { FACET_LIST, UNASSIGNED_FACET_ID } from './facets';

const matchesFacet = (facetValues: string[], value: string | null): boolean => {
  if (facetValues.length === 0) {
    return true;
  }

  if (value === null) {
    return facetValues.includes(UNASSIGNED_FACET_ID);
  }

  return facetValues.includes(value);
};

export const applyFilters = (
  cards: IBankCard[],
  filters: ICardFilters,
): IBankCard[] => {
  return cards.filter((card) =>
    FACET_LIST.every((facet) =>
      matchesFacet(filters[facet.filterKey], facet.resolveFilterId(card)),
    ),
  );
};
