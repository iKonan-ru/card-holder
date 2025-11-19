import type { IBankCard } from '../../model';
import type { IBank } from '@entities/bank';
import type { TPaymentSystem } from '@entities/payment-system';

export interface IBankCardCommonProps {
  bank: IBank;
  paymentSystem: TPaymentSystem | null;
}

export interface IBankCardProps {
  card: IBankCard;
  isFlipped?: boolean;
  onFlip?: (pan: string) => void;
  onEdit?: (card: IBankCard) => void;
  isReorderMode?: boolean;
}
