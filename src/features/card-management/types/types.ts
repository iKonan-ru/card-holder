import type { IBankCard } from '@entities/bank-card';
import type { Procedure } from '@shared/types';
import type { ICardFilters, TGroupBy, TSortDirection, TSortKey } from './view';

export interface ICardManagementState {
  cards: IBankCard[];
  flippedPan: IBankCard['pan'] | null;
  isLoading: boolean;
  isReorderMode: boolean;
  sortKey: TSortKey;
  sortDirection: TSortDirection;
  groupBy: TGroupBy;
  filters: ICardFilters;
  collapsedGroups: string[];
}

export interface ICardManagementActions {
  flipCard: (pan: IBankCard['pan']) => void;
  unflipCards: Procedure;
  loadCards: () => Promise<void>;
  addCard: (card: IBankCard) => Promise<void>;
  updateCard: (card: IBankCard) => Promise<void>;
  deleteCard: (id: IBankCard['id']) => Promise<void>;
  clearAllCards: () => Promise<void>;
  reorderCards: (cards: IBankCard[]) => Promise<void>;
  setCards: (cards: IBankCard[]) => void;
  setReorderMode: (enabled: boolean) => void;
  toggleReorderMode: Procedure;
  setSortKey: (sortKey: TSortKey) => void;
  setSortDirection: (sortDirection: TSortDirection) => void;
  setGroupBy: (groupBy: TGroupBy) => void;
  toggleGroupCollapsed: (groupId: string) => void;
  setFilters: (filters: Partial<ICardFilters>) => void;
  clearFilters: Procedure;
  resetView: Procedure;
}
