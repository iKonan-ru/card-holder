import type { IBankCard } from '@entities/bank-card';
import {
  SortDirection,
  SortKey,
  type TSortDirection,
  type TSortKey,
} from '../model/view';
import { FACET_IDS, FACETS, type IFacetContext } from './facets';

const EXPIRES_MONTH_LENGTH = 2;

const normalizeExpires = (expires: string): string => {
  const month = expires.slice(0, EXPIRES_MONTH_LENGTH);
  const year = expires.slice(EXPIRES_MONTH_LENGTH);

  return `${year}${month}`;
};

export interface ICompareCardsParams extends IFacetContext {
  sortKey: TSortKey;
  sortDirection: TSortDirection;
}

const finalizeComparison = (
  comparison: number,
  directionMultiplier: number,
  a: IBankCard,
  b: IBankCard,
): number => {
  if (comparison !== 0) {
    return comparison * directionMultiplier;
  }

  return a.order - b.order;
};

const isFacetSortKey = (
  sortKey: TSortKey,
): sortKey is (typeof FACET_IDS)[number] =>
  (FACET_IDS as readonly TSortKey[]).includes(sortKey);

export const compareCards = (
  a: IBankCard,
  b: IBankCard,
  params: ICompareCardsParams,
): number => {
  const { sortKey, sortDirection } = params;
  const directionMultiplier = sortDirection === SortDirection.Desc ? -1 : 1;

  if (sortKey === SortKey.Order) {
    return a.order - b.order;
  }

  if (sortKey === SortKey.Expires) {
    return finalizeComparison(
      normalizeExpires(a.expires).localeCompare(normalizeExpires(b.expires)),
      directionMultiplier,
      a,
      b,
    );
  }

  if (isFacetSortKey(sortKey)) {
    const facet = FACETS[sortKey];
    const aValue = facet.resolveValue(a, params);
    const bValue = facet.resolveValue(b, params);

    if (aValue === null || bValue === null) {
      const isAEmpty = aValue === null;
      const isBEmpty = bValue === null;

      if (isAEmpty === isBEmpty) {
        return finalizeComparison(0, directionMultiplier, a, b);
      }

      return isAEmpty ? 1 : -1;
    }

    return finalizeComparison(
      aValue.localeCompare(bValue),
      directionMultiplier,
      a,
      b,
    );
  }

  return a.order - b.order;
};
