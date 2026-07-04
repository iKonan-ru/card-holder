import {
  GroupBy,
  SortDirection,
  SortKey,
  type TGroupBy,
  type TSortDirection,
  type TSortKey,
} from '../model/view';
import type { ICardFilters } from '../types/view';

export const DEFAULT_SORT_KEY: TSortKey = SortKey.Order;
export const DEFAULT_SORT_DIRECTION: TSortDirection = SortDirection.Asc;
export const DEFAULT_GROUP_BY: TGroupBy = GroupBy.None;
export const DEFAULT_CARD_FILTERS: ICardFilters = {
  bankIds: [],
  paymentSystems: [],
  typeIds: [],
  ownerIds: [],
};
export const DEFAULT_COLLAPSED_GROUPS: string[] = [];

export const CARD_VIEW_PERSIST_STORE_NAME = 'card-view';
