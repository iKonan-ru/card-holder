import type { IBankCard } from '@entities/bank-card';
import {
  GroupBy,
  SortDirection,
  SortKey,
  type ICardFilters,
  type TGroupBy,
  type TSortDirection,
  type TSortKey,
} from '../types/view';

export const ERROR_FAILED_TO_LOAD_CARDS = 'Не удалось загрузить карты';
export const ERROR_FAILED_TO_REORDER_CARDS = 'Не удалось изменить порядок карт';

export const DEFAULT_CARD_ORDER = 0;

export const INITIAL_CARDS: IBankCard[] = [];
export const INITIAL_FLIPPED_PAN = null;
export const INITIAL_IS_LOADING = false;
export const INITIAL_IS_REORDER_MODE = false;

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
