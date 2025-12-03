import type { IBank } from '@entities/bank';
import type { TPaymentSystem } from '@entities/payment-system';

export interface IBankCard {
  pan: string;
  expires: string;
  name: string;
  cvv: string;
  pin?: string;
  order: number;
  type?: string;
  phrase?: string;
}

export interface IBankCardCommonProps {
  bank: IBank;
  paymentSystem: TPaymentSystem | null;
}
