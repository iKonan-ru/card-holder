import {
  FACET_LIST,
  GroupBy,
  SortDirection,
  SortKey,
  type TGroupBy,
  type TSortDirection,
  type TSortKey,
} from '@features/card-management';

export const CARD_SETTINGS_PANEL_BLOCK = 'card-settings-panel';

export const CARD_SETTINGS_PANEL_TITLE = 'Настройки отображения';
export const CARD_SETTINGS_PANEL_CLOSE_ARIA_LABEL = 'Закрыть';

export const CARD_SETTINGS_PANEL_OVERFLOW_HIDDEN = 'hidden';

/**
 * Ширина, ниже которой панель ведёт себя как оверлей поверх контента, а не
 * поджимает его сбоку - должно совпадать с @tablet в variables.less
 */
export const TABLET_BREAKPOINT_PX = 768;

export const RESET_ALL_LABEL = 'Сбросить всё';

const FACET_SORT_OPTIONS: { value: TSortKey; label: string }[] = FACET_LIST.map(
  (facet) => ({ value: facet.id, label: facet.optionLabel }),
);

export const SORT_SECTION_TITLE = 'Сортировка';
export const SORT_KEY_PLACEHOLDER = 'Поле сортировки';

// "По порядку" - это сброс к дефолту, а не значение данных, поэтому
// закреплён первым; остальные пункты выводятся по алфавиту.
const SORT_KEY_REST_OPTIONS: { value: TSortKey; label: string }[] = [
  ...FACET_SORT_OPTIONS,
  { value: SortKey.Expires, label: 'По сроку действия' },
].sort((a, b) => a.label.localeCompare(b.label));

export const SORT_KEY_OPTIONS: { value: TSortKey; label: string }[] = [
  { value: SortKey.Order, label: 'По порядку' },
  ...SORT_KEY_REST_OPTIONS,
];

export const SORT_DIRECTION_OPTIONS: {
  value: TSortDirection;
  label: string;
}[] = [
  { value: SortDirection.Asc, label: 'По возрастанию' },
  { value: SortDirection.Desc, label: 'По убыванию' },
];

const FACET_GROUP_OPTIONS: { value: TGroupBy; label: string }[] =
  FACET_LIST.map((facet) => ({ value: facet.id, label: facet.optionLabel }));

export const GROUP_SECTION_TITLE = 'Группировка';
export const GROUP_BY_PLACEHOLDER = 'Тип группировки';

// "Без группировки" - это сброс к дефолту, а не значение данных, поэтому
// закреплён первым; остальные пункты выводятся по алфавиту.
const GROUP_BY_REST_OPTIONS: { value: TGroupBy; label: string }[] = [
  ...FACET_GROUP_OPTIONS,
].sort((a, b) => a.label.localeCompare(b.label));

export const GROUP_BY_OPTIONS: { value: TGroupBy; label: string }[] = [
  { value: GroupBy.None, label: 'Без группировки' },
  ...GROUP_BY_REST_OPTIONS,
];

export const FILTERS_SECTION_TITLE = 'Фильтры';
