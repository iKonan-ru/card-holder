import type { ICardFilters } from '../types/view';

export const isFiltersEmpty = (filters: ICardFilters): boolean => {
  const facets = [
    filters.bankIds,
    filters.paymentSystems,
    filters.typeIds,
    filters.ownerIds,
  ];

  return facets.every((facet) => facet.length === 0);
};
