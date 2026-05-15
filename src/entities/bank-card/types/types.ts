import type { IBank } from '@entities/bank';
import type { TPaymentSystem } from '@entities/payment-system';

export interface IBankCardAddress {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  county?: string;
  zip?: string;
}

export interface IBankCard {
  id: string;
  pan: string;
  expires: string;
  name: string;
  cvv: string;
  pin?: string;
  order: number;
  type?: string;
  phrase?: string;
  address?: IBankCardAddress;
}

export interface IBankCardCommonProps {
  bank: IBank;
  paymentSystem: TPaymentSystem | null;
}
