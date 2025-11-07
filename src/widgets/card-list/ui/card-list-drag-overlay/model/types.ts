import type { IBankCard } from '@entities/bank-card';

export interface ICardListDragOverlayProps {
  activeCard: IBankCard | null;
  onEditCard: (card: IBankCard) => void;
  parentClass: string;
}
