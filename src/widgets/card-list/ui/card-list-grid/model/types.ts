import type { IBankCard } from '@entities/bank-card';

export interface ICardListGridProps {
  cards: IBankCard[];
  flippedPan: string | null;
  isReorderMode: boolean;
  onFlipCard: (pan: string) => void;
  onEditCard: (card: IBankCard) => void;
  onShowForm: () => void;
}
