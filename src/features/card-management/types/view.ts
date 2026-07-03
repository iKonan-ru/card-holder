export const SortKey = {
  Order: 'order',
  Name: 'name',
  Bank: 'bank',
  PaymentSystem: 'paymentSystem',
  Type: 'type',
  Owner: 'owner',
  Expires: 'expires',
} as const;
export type TSortKey = (typeof SortKey)[keyof typeof SortKey];

export const SortDirection = {
  Asc: 'asc',
  Desc: 'desc',
} as const;
export type TSortDirection = (typeof SortDirection)[keyof typeof SortDirection];

export const GroupBy = {
  None: 'none',
  Bank: 'bank',
  PaymentSystem: 'paymentSystem',
  Type: 'type',
  Owner: 'owner',
} as const;
export type TGroupBy = (typeof GroupBy)[keyof typeof GroupBy];

export interface ICardFilters {
  bankIds: string[];
  paymentSystems: string[];
  typeIds: string[];
  ownerIds: string[];
}
