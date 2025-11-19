export type TPaymentSystem =
  | 'visa'
  | 'mastercard'
  | 'mir'
  | 'jcb'
  | 'uzcard'
  | 'humo';

export interface IPaymentSystemRule {
  system: TPaymentSystem;
  checkPrefix: (pan: string) => boolean;
}
