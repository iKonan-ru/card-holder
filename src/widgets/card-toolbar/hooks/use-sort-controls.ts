import { useMemo } from 'react';
import type { IconType } from 'react-icons';
import { FiArrowDown, FiArrowUp } from 'react-icons/fi';
import {
  DEFAULT_SORT_DIRECTION,
  DEFAULT_SORT_KEY,
  SortDirection,
  useCardViewStore,
  type TSortDirection,
  type TSortKey,
} from '@features/card-management';
import {
  SORT_DIRECTION_ARROW,
  SORT_DIRECTION_LABEL_ASC,
  SORT_DIRECTION_LABEL_DESC,
  SORT_KEY_OPTIONS,
} from '../constants';

const SORT_KEY_VALUES = new Set<string>(
  SORT_KEY_OPTIONS.map((option) => option.value),
);

const isSortKey = (value: string): value is TSortKey =>
  SORT_KEY_VALUES.has(value);

export interface IUseSortControlsResult {
  sortKey: TSortKey;
  sortDirection: TSortDirection;
  isSortActive: boolean;
  directionIcon: IconType;
  directionLabel: string;
  activeSortLabel: string;
  handleSortKeyChange: (value: string) => void;
  handleToggleDirection: () => void;
  handleResetSort: () => void;
}

export const useSortControls = (): IUseSortControlsResult => {
  const sortKey = useCardViewStore((state) => state.sortKey);
  const sortDirection = useCardViewStore((state) => state.sortDirection);
  const setSortKey = useCardViewStore((state) => state.setSortKey);
  const setSortDirection = useCardViewStore((state) => state.setSortDirection);

  const isSortActive =
    sortKey !== DEFAULT_SORT_KEY || sortDirection !== DEFAULT_SORT_DIRECTION;

  const handleSortKeyChange = (value: string) => {
    if (isSortKey(value)) {
      setSortKey(value);
    }
  };

  const handleToggleDirection = () => {
    const nextDirection =
      sortDirection === SortDirection.Asc
        ? SortDirection.Desc
        : SortDirection.Asc;

    setSortDirection(nextDirection);
  };

  const handleResetSort = () => {
    setSortKey(DEFAULT_SORT_KEY);
    setSortDirection(DEFAULT_SORT_DIRECTION);
  };

  const directionIcon = useMemo(
    () => (sortDirection === SortDirection.Asc ? FiArrowUp : FiArrowDown),
    [sortDirection],
  );

  const directionLabel = useMemo(
    () =>
      sortDirection === SortDirection.Asc
        ? SORT_DIRECTION_LABEL_ASC
        : SORT_DIRECTION_LABEL_DESC,
    [sortDirection],
  );

  const activeSortLabel = useMemo(() => {
    const option = SORT_KEY_OPTIONS.find((item) => item.value === sortKey);

    return `${option?.label ?? sortKey} ${SORT_DIRECTION_ARROW[sortDirection]}`;
  }, [sortKey, sortDirection]);

  return {
    sortKey,
    sortDirection,
    isSortActive,
    directionIcon,
    directionLabel,
    activeSortLabel,
    handleSortKeyChange,
    handleToggleDirection,
    handleResetSort,
  };
};
