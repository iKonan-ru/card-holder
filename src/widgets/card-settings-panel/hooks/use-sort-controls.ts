import {
  SortKey,
  useCardViewStore,
  type TSortDirection,
  type TSortKey,
} from '@features/card-management';
import { SORT_KEY_OPTIONS } from '../constants';

const SORT_KEY_VALUES = new Set<string>(
  SORT_KEY_OPTIONS.map((option) => option.value),
);

const isSortKey = (value: string): value is TSortKey =>
  SORT_KEY_VALUES.has(value);

export interface IUseSortControlsResult {
  sortKey: TSortKey;
  sortDirection: TSortDirection;
  isDirectionDisabled: boolean;
  handleSortKeyChange: (value: string) => void;
  handleSetDirection: (direction: TSortDirection) => void;
}

export const useSortControls = (): IUseSortControlsResult => {
  const sortKey = useCardViewStore((state) => state.sortKey);
  const sortDirection = useCardViewStore((state) => state.sortDirection);
  const setSortKey = useCardViewStore((state) => state.setSortKey);
  const setSortDirection = useCardViewStore((state) => state.setSortDirection);

  const isDirectionDisabled = sortKey === SortKey.Order;

  const handleSortKeyChange = (value: string) => {
    if (isSortKey(value)) {
      setSortKey(value);
    }
  };

  const handleSetDirection = (direction: TSortDirection) => {
    setSortDirection(direction);
  };

  return {
    sortKey,
    sortDirection,
    isDirectionDisabled,
    handleSortKeyChange,
    handleSetDirection,
  };
};
