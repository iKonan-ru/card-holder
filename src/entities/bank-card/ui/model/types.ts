import type { IBankCard } from '../../model';

export interface IBankCardProps {
  card: IBankCard;
  isFlipped?: boolean;
  onFlip?: (pan: string) => void;
  onEdit?: (card: IBankCard) => void;
  isReorderMode?: boolean;
}
