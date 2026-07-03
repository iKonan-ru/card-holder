import type { IBankCard } from '@entities/bank-card';
import type { IOwner } from '@entities/card-owner';
import type { ICardType } from '@entities/card-type';
import { getPaymentSystem } from '@shared/lib';
import { GroupBy, type TGroupBy } from '../types/view';
import {
  getBankName,
  getCardTypeName,
  getOwnerName,
} from './resolve-card-facet';

export interface ICardGroup {
  id: string;
  label: string;
  cards: IBankCard[];
}

interface IGroupCardsParams {
  groupBy: TGroupBy;
  cardTypes: ICardType[];
  owners: IOwner[];
}

const UNASSIGNED_GROUP_ID = '__unassigned__';

const UNASSIGNED_LABELS: Partial<Record<TGroupBy, string>> = {
  [GroupBy.Bank]: 'Без банка',
  [GroupBy.PaymentSystem]: 'Без платёжной системы',
  [GroupBy.Type]: 'Без типа',
  [GroupBy.Owner]: 'Без владельца',
};

const resolveGroupValue = (
  card: IBankCard,
  groupBy: TGroupBy,
  { cardTypes, owners }: IGroupCardsParams,
): string | null => {
  if (groupBy === GroupBy.Bank) {
    return getBankName(card.pan);
  }

  if (groupBy === GroupBy.PaymentSystem) {
    return getPaymentSystem(card.pan);
  }

  if (groupBy === GroupBy.Type) {
    return getCardTypeName(card.typeId, cardTypes);
  }

  return getOwnerName(card.ownerId, owners);
};

export const groupCards = (
  visibleCards: IBankCard[],
  params: IGroupCardsParams,
): ICardGroup[] => {
  if (params.groupBy === GroupBy.None) {
    return [];
  }

  const groupsByValue = new Map<string, ICardGroup>();

  visibleCards.forEach((card) => {
    const value = resolveGroupValue(card, params.groupBy, params);
    const groupId = value ?? UNASSIGNED_GROUP_ID;
    const groupLabel = value ?? UNASSIGNED_LABELS[params.groupBy] ?? groupId;

    const existingGroup = groupsByValue.get(groupId);

    if (existingGroup) {
      existingGroup.cards.push(card);

      return;
    }

    groupsByValue.set(groupId, {
      id: groupId,
      label: groupLabel,
      cards: [card],
    });
  });

  const groups = Array.from(groupsByValue.values());
  const unassignedGroups = groups.filter(
    (group) => group.id === UNASSIGNED_GROUP_ID,
  );
  const assignedGroups = groups
    .filter((group) => group.id !== UNASSIGNED_GROUP_ID)
    .sort((a, b) => a.label.localeCompare(b.label));

  return [...assignedGroups, ...unassignedGroups];
};
