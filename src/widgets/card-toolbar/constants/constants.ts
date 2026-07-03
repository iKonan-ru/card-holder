import {
  GroupBy,
  SortDirection,
  SortKey,
  type TGroupBy,
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

export const FILTER_BUTTON_LABEL = 'Фильтры';
export const FILTER_SHEET_TITLE = 'Фильтры';
export const FILTER_SECTION_TITLE_BANK = 'Банк';
export const FILTER_SECTION_TITLE_PAYMENT_SYSTEM = 'Платёжная система';
export const FILTER_SECTION_TITLE_TYPE = 'Тип карты';
export const FILTER_SECTION_TITLE_OWNER = 'Владелец';

export const RESET_ALL_LABEL = 'Сбросить всё';

export const GROUP_BY_OPTIONS: { value: TGroupBy; label: string }[] = [
  { value: GroupBy.None, label: 'Без группировки' },
  { value: GroupBy.Bank, label: 'По банку' },
  { value: GroupBy.PaymentSystem, label: 'По платёжной системе' },
  { value: GroupBy.Type, label: 'По типу' },
  { value: GroupBy.Owner, label: 'По владельцу' },
];

export const GROUP_BY_PLACEHOLDER = 'Группировка';
export const GROUP_CHIP_REMOVE_ARIA_LABEL = 'Сбросить группировку';
