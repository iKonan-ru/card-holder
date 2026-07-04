import type { IBankCard } from '@entities/bank-card';
import type { IOwner } from '@entities/card-owner';
import type { ICardType } from '@entities/card-type';
import { PAYMENT_SYSTEM_LABELS } from '@shared/data';
import { getBankByCardNumber, getPaymentSystem } from '@shared/lib';
import { SortKey } from '../model/view';
import type { ICardFilters } from '../types/view';
import {
  getBankName,
  getCardTypeName,
  getOwnerName,
} from './resolve-card-facet';

// Единый реестр «фасетов» (Банк / Платёжная система / Тип / Владелец) -
// источник правды для сортировки, группировки, фильтрации и опций тулбара.
export const FACET_IDS = [
  SortKey.Bank,
  SortKey.PaymentSystem,
  SortKey.Type,
  SortKey.Owner,
] as const;

export type TFacetId = (typeof FACET_IDS)[number];

export interface IFacetContext {
  cardTypes: ICardType[];
  owners: IOwner[];
}

export interface IFacetDescriptor {
  id: TFacetId;
  filterTitle: string;
  optionLabel: string;
  unassignedLabel: string;
  filterKey: keyof ICardFilters;
  // Значение для сортировки/группировки
  resolveValue: (card: IBankCard, ctx: IFacetContext) => string | null;
  // Идентификатор для сопоставления с выбранными значениями фильтра
  resolveFilterId: (card: IBankCard) => string | null;
  // Подпись для отображения в списке опций фильтра
  resolveFilterLabel: (card: IBankCard, ctx: IFacetContext) => string | null;
}

const resolvePaymentSystemLabel = (pan: string): string | null => {
  const system = getPaymentSystem(pan);

  return system ? PAYMENT_SYSTEM_LABELS[system] : null;
};

export const FACETS: Record<TFacetId, IFacetDescriptor> = {
  [SortKey.Bank]: {
    id: SortKey.Bank,
    filterTitle: 'Банк',
    optionLabel: 'По банку',
    unassignedLabel: 'Без банка',
    filterKey: 'bankIds',
    resolveValue: (card) => getBankName(card.pan),
    resolveFilterId: (card) => getBankByCardNumber(card.pan),
    resolveFilterLabel: (card) => getBankName(card.pan),
  },
  [SortKey.PaymentSystem]: {
    id: SortKey.PaymentSystem,
    filterTitle: 'Платёжная система',
    optionLabel: 'По платёжной системе',
    unassignedLabel: 'Без платёжной системы',
    filterKey: 'paymentSystems',
    resolveValue: (card) => getPaymentSystem(card.pan),
    resolveFilterId: (card) => getPaymentSystem(card.pan),
    resolveFilterLabel: (card) => resolvePaymentSystemLabel(card.pan),
  },
  [SortKey.Type]: {
    id: SortKey.Type,
    filterTitle: 'Тип карты',
    optionLabel: 'По типу',
    unassignedLabel: 'Без типа',
    filterKey: 'typeIds',
    resolveValue: (card, ctx) => getCardTypeName(card.typeId, ctx.cardTypes),
    resolveFilterId: (card) => card.typeId ?? null,
    resolveFilterLabel: (card, ctx) =>
      getCardTypeName(card.typeId, ctx.cardTypes),
  },
  [SortKey.Owner]: {
    id: SortKey.Owner,
    filterTitle: 'Владелец',
    optionLabel: 'По владельцу',
    unassignedLabel: 'Без владельца',
    filterKey: 'ownerIds',
    resolveValue: (card, ctx) => getOwnerName(card.ownerId, ctx.owners),
    resolveFilterId: (card) => card.ownerId ?? null,
    resolveFilterLabel: (card, ctx) => getOwnerName(card.ownerId, ctx.owners),
  },
};

export const FACET_LIST: IFacetDescriptor[] = FACET_IDS.map((id) => FACETS[id]);
