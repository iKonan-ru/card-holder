import type { IBankCard } from '@entities/bank-card';
import { getBankByCardNumber, getPaymentSystem } from '@shared/lib';
import type { ICardFilters } from '../types/view';

const matchesFacet = (facet: string[], value: string | null): boolean => {
  if (facet.length === 0) {
    return true;
  }

  if (value === null) {
    return false;
  }

  return facet.includes(value);
};

export const applyFilters = (
  cards: IBankCard[],
  filters: ICardFilters,
): IBankCard[] => {
  return cards.filter((card) => {
    const bankId = getBankByCardNumber(card.pan);
    const paymentSystem = getPaymentSystem(card.pan);

    const checks = [
      matchesFacet(filters.bankIds, bankId),
      matchesFacet(filters.paymentSystems, paymentSystem),
      matchesFacet(filters.typeIds, card.typeId ?? null),
      matchesFacet(filters.ownerIds, card.ownerId ?? null),
    ];

    return checks.every(Boolean);
  });
};
