import type { ICardFilters } from '../types/view';
import { FACET_LIST } from './facets';

export const isFiltersEmpty = (filters: ICardFilters): boolean =>
  FACET_LIST.every((facet) => filters[facet.filterKey].length === 0);
