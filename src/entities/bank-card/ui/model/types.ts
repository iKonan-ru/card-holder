import type { PropsWithParentClass } from '@shared/types';
import type { IBankCard } from '../../model';

export interface IBankCardProps extends PropsWithParentClass {
  card: IBankCard;
  isFlipped?: boolean;
  onFlip?: (pan: string) => void;
  onEdit?: (card: IBankCard) => void;
  isReorderMode?: boolean;
}
