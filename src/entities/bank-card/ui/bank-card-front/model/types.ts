import type { IBank } from '@entities/bank';
import type { PaymentSystem } from '@shared/lib';
import type { IBankCard } from '../../../model';

export interface IBankCardFrontProps {
  card: IBankCard;
  bank: IBank;
  paymentSystem: PaymentSystem | null;
}
