import type { TPaymentSystem } from '@entities/payment-system';

export const PAYMENT_SYSTEM_LABELS: Record<TPaymentSystem, string> = {
  visa: 'Visa',
  mastercard: 'Mastercard',
  mir: 'Мир',
  jcb: 'JCB',
  uzcard: 'Uzcard',
  humo: 'Humo',
};
