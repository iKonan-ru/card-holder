export type PaymentSystem =
  | 'visa'
  | 'mastercard'
  | 'mir'
  | 'jcb'
  | 'uzcard'
  | 'humo';

export interface IPaymentSystemRule {
  system: PaymentSystem;
  checkPrefix: (pan: string) => boolean;
}
