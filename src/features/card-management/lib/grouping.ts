import type { IBankCard } from '@entities/bank-card';
import { GroupBy, type TGroupBy } from '../model/view';
import { FACETS, UNASSIGNED_FACET_ID, type IFacetContext } from './facets';

export interface ICardGroup {
  id: string;
  label: string;
  cards: IBankCard[];
}

interface IGroupCardsParams extends IFacetContext {
  groupBy: TGroupBy;
}

export const groupCards = (
  visibleCards: IBankCard[],
  params: IGroupCardsParams,
): ICardGroup[] => {
  if (params.groupBy === GroupBy.None) {
    return [];
  }

  const facet = FACETS[params.groupBy];
  const groupsByValue = new Map<string, ICardGroup>();

  visibleCards.forEach((card) => {
    const value = facet.resolveValue(card, params);
    const groupId = value ?? UNASSIGNED_FACET_ID;
    const groupLabel = value ?? facet.unassignedLabel;

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
    (group) => group.id === UNASSIGNED_FACET_ID,
  );
  const assignedGroups = groups
    .filter((group) => group.id !== UNASSIGNED_FACET_ID)
    .sort((a, b) => a.label.localeCompare(b.label));

  return [...assignedGroups, ...unassignedGroups];
};
