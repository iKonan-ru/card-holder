import type { IBankCard } from '../../model';
import type { IBank } from '@entities/bank';
import type { PaymentSystem } from '@shared/lib';

export interface IBankCardCommonProps {
  bank: IBank;
  paymentSystem: PaymentSystem | null;
}

export interface IBankCardProps {
  card: IBankCard;
  isFlipped?: boolean;
  onFlip?: (pan: string) => void;
  onEdit?: (card: IBankCard) => void;
  isReorderMode?: boolean;
}
