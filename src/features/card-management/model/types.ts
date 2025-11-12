import type { IBankCard } from '@entities/bank-card';

export interface ICardManagementState {
  cards: IBankCard[];
  flippedPan: IBankCard['pan'] | null;
  isLoading: boolean;
  isReorderMode: boolean;
}

export interface ICardManagementActions {
  flipCard: (pan: IBankCard['pan']) => void;
  unflipCards: () => void;
  loadCards: () => Promise<void>;
  addCard: (card: IBankCard) => Promise<void>;
  updateCard: (card: IBankCard) => Promise<void>;
  deleteCard: (pan: IBankCard['pan']) => Promise<void>;
  clearAllCards: () => Promise<void>;
  reorderCards: (cards: IBankCard[]) => Promise<void>;
  setCards: (cards: IBankCard[]) => void;
  setReorderMode: (enabled: boolean) => void;
  toggleReorderMode: () => void;
}
