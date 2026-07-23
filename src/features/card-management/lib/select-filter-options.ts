import type { IBankCard } from '@entities/bank-card';
import type { ICardFilters } from '../types/view';
import {
  FACET_LIST,
  UNASSIGNED_FACET_ID,
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
  let hasUnassignedCard = false;

  cards.forEach((card) => {
    const id = facet.resolveFilterId(card);

    if (id === null) {
      hasUnassignedCard = true;

      return;
    }

    if (labelById.has(id)) {
      return;
    }

    labelById.set(id, facet.resolveFilterLabel(card, ctx) ?? id);
  });

  const options = Array.from(labelById, ([value, label]) => ({
    value,
    label,
  }));

  options.sort((a, b) => a.label.localeCompare(b.label));

  if (hasUnassignedCard) {
    options.push({ value: UNASSIGNED_FACET_ID, label: facet.unassignedLabel });
  }

  return options;
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
