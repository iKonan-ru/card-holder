import {
  SortDirection,
  SortKey,
  type TSortDirection,
  type TSortKey,
} from '@features/card-management';

export const CARD_TOOLBAR_BLOCK = 'card-toolbar';

export const SORT_KEY_OPTIONS: { value: TSortKey; label: string }[] = [
  { value: SortKey.Order, label: 'По порядку' },
  { value: SortKey.Name, label: 'По имени' },
  { value: SortKey.Bank, label: 'По банку' },
  { value: SortKey.PaymentSystem, label: 'По платёжной системе' },
  { value: SortKey.Type, label: 'По типу' },
  { value: SortKey.Owner, label: 'По владельцу' },
  { value: SortKey.Expires, label: 'По сроку действия' },
];

export const SORT_KEY_PLACEHOLDER = 'Сортировка';

export const SORT_DIRECTION_LABEL_ASC = 'По возрастанию';
export const SORT_DIRECTION_LABEL_DESC = 'По убыванию';

export const SORT_DIRECTION_ARROW: Record<TSortDirection, string> = {
  [SortDirection.Asc]: '↑',
  [SortDirection.Desc]: '↓',
};

export const SORT_CHIP_REMOVE_ARIA_LABEL = 'Сбросить сортировку';
