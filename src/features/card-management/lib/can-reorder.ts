import {
  GroupBy,
  SortKey,
  type ICardFilters,
  type TGroupBy,
  type TSortKey,
} from '../types/view';
import { isFiltersEmpty } from './filters';

interface ICanReorderParams {
  sortKey: TSortKey;
  groupBy: TGroupBy;
  filters: ICardFilters;
}

export const canReorder = ({
  sortKey,
  groupBy,
  filters,
}: ICanReorderParams): boolean => {
  const conditions = [
    sortKey === SortKey.Order,
    groupBy === GroupBy.None,
    isFiltersEmpty(filters),
  ];

  return conditions.every(Boolean);
};
