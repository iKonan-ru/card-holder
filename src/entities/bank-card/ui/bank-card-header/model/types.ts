import type { IBank } from '@entities/bank';
import type { PaymentSystem } from '@shared/lib';

export interface IBankCardHeaderProps {
  bank: IBank;
  paymentSystem: PaymentSystem | null;
}
