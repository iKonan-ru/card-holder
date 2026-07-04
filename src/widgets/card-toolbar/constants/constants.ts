import {
  FACET_LIST,
  GroupBy,
  SortDirection,
  SortKey,
  type TGroupBy,
  type TSortDirection,
  type TSortKey,
} from '@features/card-management';

export const CARD_TOOLBAR_BLOCK = 'card-toolbar';

const FACET_SORT_OPTIONS: { value: TSortKey; label: string }[] = FACET_LIST.map(
  (facet) => ({ value: facet.id, label: facet.optionLabel }),
);

export const SORT_KEY_OPTIONS: { value: TSortKey; label: string }[] = [
  { value: SortKey.Order, label: 'По порядку' },
  { value: SortKey.Name, label: 'По имени' },
  ...FACET_SORT_OPTIONS,
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

export const RESET_ALL_LABEL = 'Сбросить всё';

const FACET_GROUP_OPTIONS: { value: TGroupBy; label: string }[] =
  FACET_LIST.map((facet) => ({ value: facet.id, label: facet.optionLabel }));

export const GROUP_BY_OPTIONS: { value: TGroupBy; label: string }[] = [
  { value: GroupBy.None, label: 'Без группировки' },
  ...FACET_GROUP_OPTIONS,
];

export const GROUP_BY_PLACEHOLDER = 'Группировка';
export const GROUP_CHIP_REMOVE_ARIA_LABEL = 'Сбросить группировку';
