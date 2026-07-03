import type { IBankCard } from '@entities/bank-card';
import type { IOwner } from '@entities/card-owner';
import type { ICardType } from '@entities/card-type';
import { getPaymentSystem } from '@shared/lib';
import {
  SortDirection,
  SortKey,
  type TSortDirection,
  type TSortKey,
} from '../types/view';
import {
  getBankName,
  getCardTypeName,
  getOwnerName,
} from './resolve-card-facet';

const EXPIRES_MONTH_LENGTH = 2;

const DERIVED_SORT_KEYS: TSortKey[] = [
  SortKey.Bank,
  SortKey.PaymentSystem,
  SortKey.Type,
  SortKey.Owner,
];

const normalizeExpires = (expires: string): string => {
  const month = expires.slice(0, EXPIRES_MONTH_LENGTH);
  const year = expires.slice(EXPIRES_MONTH_LENGTH);

  return `${year}${month}`;
};

export interface ICompareCardsParams {
  sortKey: TSortKey;
  sortDirection: TSortDirection;
  cardTypes: ICardType[];
  owners: IOwner[];
}

const resolveDerivedValue = (
  card: IBankCard,
  sortKey: TSortKey,
  { cardTypes, owners }: ICompareCardsParams,
): string | null => {
  if (sortKey === SortKey.Bank) {
    return getBankName(card.pan);
  }

  if (sortKey === SortKey.PaymentSystem) {
    return getPaymentSystem(card.pan);
  }

  if (sortKey === SortKey.Type) {
    return getCardTypeName(card.typeId, cardTypes);
  }

  return getOwnerName(card.ownerId, owners);
};

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

  if (sortKey === SortKey.Name) {
    return finalizeComparison(
      a.name.localeCompare(b.name),
      directionMultiplier,
      a,
      b,
    );
  }

  if (sortKey === SortKey.Expires) {
    return finalizeComparison(
      normalizeExpires(a.expires).localeCompare(normalizeExpires(b.expires)),
      directionMultiplier,
      a,
      b,
    );
  }

  if (DERIVED_SORT_KEYS.includes(sortKey)) {
    const aValue = resolveDerivedValue(a, sortKey, params);
    const bValue = resolveDerivedValue(b, sortKey, params);

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
